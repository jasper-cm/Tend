import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Insight {
  type: 'celebration' | 'encouragement' | 'suggestion' | 'observation';
  title: string;
  message: string;
  lifeArea?: string;
  priority: 'high' | 'medium' | 'low';
}

@Injectable()
export class GardenGuideService {
  constructor(private readonly prisma: PrismaService) {}

  async chat(userId: string, message: string, history: ChatMessage[] = []) {
    const context = await this.gatherUserContext(userId);

    const systemPrompt = this.buildSystemPrompt(context);
    const conversationContext = this.buildConversationContext(history, message);

    const response = this.generateResponse(message, context);

    return {
      reply: response,
      context: {
        gardenHealth: context.averageHealthScore,
        activeStreaks: context.totalActiveStreaks,
        recentReflections: context.recentReflectionCount,
      },
    };
  }

  async generateInsights(userId: string): Promise<{ insights: Insight[]; summary: string }> {
    const context = await this.gatherUserContext(userId);
    const insights: Insight[] = [];

    if (context.thrivingAreas.length > 0) {
      insights.push({
        type: 'celebration',
        title: 'Flourishing Areas',
        message: `Your ${context.thrivingAreas.map(a => a.name).join(', ')} ${context.thrivingAreas.length === 1 ? 'area is' : 'areas are'} thriving! Keep up the great work.`,
        priority: 'medium',
      });
    }

    if (context.needsAttentionAreas.length > 0) {
      const lowestArea = context.needsAttentionAreas[0];
      insights.push({
        type: 'suggestion',
        title: 'Area Needing Attention',
        message: `Your ${lowestArea.name} area could use some care. Consider adding a small daily practice to nurture this part of your garden.`,
        lifeArea: lowestArea.name,
        priority: 'high',
      });
    }

    if (context.longestStreak > 0) {
      insights.push({
        type: 'celebration',
        title: 'Streak Achievement',
        message: `Amazing! You have a ${context.longestStreak}-day streak going. Consistency is the key to growth.`,
        priority: 'medium',
      });
    }

    if (context.practicesWithNoLogs.length > 0) {
      const practice = context.practicesWithNoLogs[0];
      insights.push({
        type: 'encouragement',
        title: 'Dormant Practice',
        message: `Your "${practice.name}" practice hasn't been logged recently. Even small steps count - could you do a brief session today?`,
        lifeArea: practice.lifeAreaName,
        priority: 'medium',
      });
    }

    if (context.recentReflectionCount === 0) {
      insights.push({
        type: 'suggestion',
        title: 'Time to Reflect',
        message: 'You haven\'t written a reflection recently. Taking a few minutes to journal can help you process your growth and set intentions.',
        priority: 'medium',
      });
    } else if (context.recentMoods.length > 0) {
      const moodTrend = this.analyzeMoodTrend(context.recentMoods);
      if (moodTrend) {
        insights.push({
          type: 'observation',
          title: 'Mood Insight',
          message: moodTrend,
          priority: 'low',
        });
      }
    }

    if (context.upcomingMilestones.length > 0) {
      const milestone = context.upcomingMilestones[0];
      insights.push({
        type: 'encouragement',
        title: 'Milestone Approaching',
        message: `You're ${milestone.daysAway} days away from a ${milestone.days}-day streak on "${milestone.practiceName}". Keep going!`,
        priority: 'high',
      });
    }

    const areasWithGaps = context.lifeAreas.filter(a => a.practiceCount === 0);
    if (areasWithGaps.length > 0 && areasWithGaps.length <= 2) {
      insights.push({
        type: 'suggestion',
        title: 'Untended Areas',
        message: `Your ${areasWithGaps.map(a => a.name).join(' and ')} ${areasWithGaps.length === 1 ? 'area has' : 'areas have'} no practices yet. Consider adding one small habit to start tending ${areasWithGaps.length === 1 ? 'this area' : 'these areas'}.`,
        priority: 'low',
      });
    }

    const summary = this.generateSummary(context, insights);

    return {
      insights: insights.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      summary,
    };
  }

  private async gatherUserContext(userId: string) {
    const lifeAreas = await this.prisma.lifeArea.findMany({
      where: { userId },
      include: {
        practices: {
          include: {
            logs: {
              orderBy: { completedAt: 'desc' },
              take: 30,
            },
          },
        },
        reflections: {
          include: { reflection: true },
          orderBy: { reflection: { createdAt: 'desc' } },
          take: 5,
        },
      },
    });

    const reflections = await this.prisma.reflection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReflections = reflections.filter(r => r.createdAt >= sevenDaysAgo);

    const allPractices = lifeAreas.flatMap(la =>
      la.practices.map(p => ({
        ...p,
        lifeAreaName: la.name,
      }))
    );

    const activePractices = allPractices.filter(p => p.isActive);
    const totalActiveStreaks = activePractices.filter(p => p.currentStreak > 0).length;
    const longestStreak = Math.max(...activePractices.map(p => p.currentStreak), 0);

    const practicesWithNoLogs = activePractices.filter(p => {
      if (p.logs.length === 0) return true;
      const lastLog = p.logs[0];
      const daysSinceLastLog = Math.floor(
        (Date.now() - new Date(lastLog.completedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceLastLog > 3;
    });

    const healthScores = lifeAreas.map(la => la.healthScore);
    const averageHealthScore = healthScores.length > 0
      ? Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length)
      : 50;

    const thrivingAreas = lifeAreas.filter(la => la.healthScore >= 75);
    const needsAttentionAreas = lifeAreas
      .filter(la => la.healthScore < 50)
      .sort((a, b) => a.healthScore - b.healthScore);

    const upcomingMilestones = activePractices
      .filter(p => {
        const milestones = [7, 14, 21, 30, 60, 90, 100];
        return milestones.some(m => p.currentStreak > 0 && m - p.currentStreak <= 3 && m - p.currentStreak > 0);
      })
      .map(p => {
        const milestones = [7, 14, 21, 30, 60, 90, 100];
        const nextMilestone = milestones.find(m => m > p.currentStreak) || 100;
        return {
          practiceName: p.name,
          currentStreak: p.currentStreak,
          days: nextMilestone,
          daysAway: nextMilestone - p.currentStreak,
        };
      });

    return {
      lifeAreas: lifeAreas.map(la => ({
        id: la.id,
        name: la.name,
        healthScore: la.healthScore,
        practiceCount: la.practices.length,
      })),
      averageHealthScore,
      thrivingAreas,
      needsAttentionAreas,
      totalActiveStreaks,
      longestStreak,
      practicesWithNoLogs,
      recentReflectionCount: recentReflections.length,
      recentMoods: recentReflections.map(r => r.mood).filter(Boolean) as string[],
      upcomingMilestones,
    };
  }

  private buildSystemPrompt(context: any): string {
    return `You are the Garden Guide, a warm and supportive AI coach helping users tend their "life garden."
Your role is to provide personalized guidance based on their life areas, practices, and reflections.

Current garden status:
- Overall health: ${context.averageHealthScore}/100
- Active streaks: ${context.totalActiveStreaks}
- Recent reflections: ${context.recentReflectionCount}
- Thriving areas: ${context.thrivingAreas.map((a: any) => a.name).join(', ') || 'None yet'}
- Areas needing attention: ${context.needsAttentionAreas.map((a: any) => a.name).join(', ') || 'All doing well'}

Be encouraging, use garden metaphors naturally, and focus on progress over perfection.`;
  }

  private buildConversationContext(history: ChatMessage[], currentMessage: string): string {
    const historyText = history
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'User' : 'Guide'}: ${m.content}`)
      .join('\n');
    return `${historyText}\nUser: ${currentMessage}`;
  }

  private generateResponse(message: string, context: any): string {
    const messageLower = message.toLowerCase();

    if (messageLower.includes('how am i doing') || messageLower.includes('garden status') || messageLower.includes('overview')) {
      return this.generateStatusResponse(context);
    }

    if (messageLower.includes('suggest') || messageLower.includes('recommend') || messageLower.includes('what should i')) {
      return this.generateSuggestionResponse(context);
    }

    if (messageLower.includes('streak') || messageLower.includes('progress')) {
      return this.generateProgressResponse(context);
    }

    if (messageLower.includes('help') || messageLower.includes('struggling') || messageLower.includes('hard')) {
      return this.generateEncouragementResponse(context);
    }

    return this.generateDefaultResponse(context);
  }

  private generateStatusResponse(context: any): string {
    const healthDescription = context.averageHealthScore >= 75 ? 'flourishing beautifully' :
      context.averageHealthScore >= 50 ? 'growing steadily' : 'needing some tender care';

    let response = `Your life garden is ${healthDescription} with an overall health of ${context.averageHealthScore}/100. `;

    if (context.thrivingAreas.length > 0) {
      response += `Your ${context.thrivingAreas.map((a: any) => a.name).join(', ')} ${context.thrivingAreas.length === 1 ? 'area is' : 'areas are'} particularly vibrant right now. `;
    }

    if (context.needsAttentionAreas.length > 0) {
      response += `Consider giving some extra attention to your ${context.needsAttentionAreas[0].name} area - even small actions can help it bloom.`;
    }

    return response;
  }

  private generateSuggestionResponse(context: any): string {
    if (context.needsAttentionAreas.length > 0) {
      const area = context.needsAttentionAreas[0];
      return `I'd suggest focusing on your ${area.name} area, which is currently at ${area.healthScore}/100. Try adding one small, daily practice that takes less than 5 minutes. Consistency in small things leads to big growth!`;
    }

    if (context.practicesWithNoLogs.length > 0) {
      const practice = context.practicesWithNoLogs[0];
      return `You have a practice called "${practice.name}" that hasn't been tended lately. Sometimes revisiting dormant practices can reignite our growth. Would you like to try a brief session today?`;
    }

    return `Your garden is doing well! To continue growing, consider deepening your existing practices or reflecting on what's working well. Sometimes the best growth comes from consistency rather than adding more.`;
  }

  private generateProgressResponse(context: any): string {
    if (context.longestStreak > 0) {
      let response = `Great progress! You have ${context.totalActiveStreaks} active ${context.totalActiveStreaks === 1 ? 'streak' : 'streaks'}, with your longest being ${context.longestStreak} days. `;

      if (context.upcomingMilestones.length > 0) {
        const milestone = context.upcomingMilestones[0];
        response += `You're just ${milestone.daysAway} ${milestone.daysAway === 1 ? 'day' : 'days'} away from a ${milestone.days}-day milestone on "${milestone.practiceName}". Keep going!`;
      }

      return response;
    }

    return `Every garden starts somewhere! Begin with one small practice today, and you'll have started your first streak. Remember: a single seed planted consistently grows into a mighty tree.`;
  }

  private generateEncouragementResponse(context: any): string {
    return `I hear you, and I want you to know that every gardener faces challenging seasons. The fact that you're here, tending to your growth, shows real commitment. Even on difficult days, small actions matter. What's one tiny thing you could do right now to nurture yourself? Sometimes just acknowledging where we are is the first step forward.`;
  }

  private generateDefaultResponse(context: any): string {
    const greetings = [
      `Welcome back to your garden! How can I help you tend to your growth today?`,
      `I'm here to help you nurture your life areas. What aspect of your garden would you like to focus on?`,
      `Every day is a new opportunity to tend your garden. What's on your mind?`,
    ];

    return greetings[Math.floor(Math.random() * greetings.length)] +
      ` Your garden is currently at ${context.averageHealthScore}/100 overall health.`;
  }

  private analyzeMoodTrend(moods: string[]): string | null {
    if (moods.length < 2) return null;

    const moodScores: Record<string, number> = {
      'great': 5, 'good': 4, 'okay': 3, 'neutral': 3, 'low': 2, 'difficult': 1,
    };

    const scores = moods.map(m => moodScores[m.toLowerCase()] || 3);
    const recent = scores.slice(0, Math.ceil(scores.length / 2));
    const older = scores.slice(Math.ceil(scores.length / 2));

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    if (recentAvg > olderAvg + 0.5) {
      return 'Your recent reflections show an upward trend in mood. Whatever you\'re doing seems to be working!';
    } else if (recentAvg < olderAvg - 0.5) {
      return 'I notice your recent reflections suggest you might be going through a challenging time. Remember, all seasons pass, and reaching out for support is a sign of strength.';
    }

    return null;
  }

  private generateSummary(context: any, insights: Insight[]): string {
    const healthStatus = context.averageHealthScore >= 75 ? 'thriving' :
      context.averageHealthScore >= 50 ? 'growing steadily' : 'in a season of renewal';

    const highPriorityCount = insights.filter(i => i.priority === 'high').length;

    let summary = `Your life garden is ${healthStatus} at ${context.averageHealthScore}/100. `;

    if (context.totalActiveStreaks > 0) {
      summary += `You have ${context.totalActiveStreaks} active ${context.totalActiveStreaks === 1 ? 'streak' : 'streaks'}. `;
    }

    if (highPriorityCount > 0) {
      summary += `There ${highPriorityCount === 1 ? 'is' : 'are'} ${highPriorityCount} ${highPriorityCount === 1 ? 'area' : 'areas'} that could benefit from your attention.`;
    } else {
      summary += `Keep nurturing your practices consistently!`;
    }

    return summary;
  }
}
