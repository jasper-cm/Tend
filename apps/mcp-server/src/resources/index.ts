import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiClient } from '../api-client';

export function registerResources(server: McpServer) {
  server.resource(
    'life-garden-overview',
    'tend://garden/overview',
    { description: 'A holistic view of all life areas with health scores and recent activity' },
    async () => {
      const { data: lifeAreas, error } = await apiClient.lifeAreas.getAll();

      if (error) {
        return {
          contents: [
            {
              uri: 'tend://garden/overview',
              mimeType: 'application/json',
              text: JSON.stringify({ error, lifeAreas: [] }),
            },
          ],
        };
      }

      const overview = {
        totalLifeAreas: lifeAreas?.length || 0,
        averageHealthScore:
          lifeAreas && lifeAreas.length > 0
            ? Math.round(
                lifeAreas.reduce((sum, la) => sum + la.healthScore, 0) / lifeAreas.length
              )
            : 0,
        lifeAreas: lifeAreas?.map((la) => ({
          id: la.id,
          name: la.name,
          slug: la.slug,
          icon: la.icon,
          color: la.color,
          healthScore: la.healthScore,
          practiceCount: la.practices?.length || 0,
        })) || [],
        healthDistribution: {
          thriving: lifeAreas?.filter((la) => la.healthScore >= 75).length || 0,
          growing: lifeAreas?.filter((la) => la.healthScore >= 50 && la.healthScore < 75).length || 0,
          needsAttention: lifeAreas?.filter((la) => la.healthScore < 50).length || 0,
        },
      };

      return {
        contents: [
          {
            uri: 'tend://garden/overview',
            mimeType: 'application/json',
            text: JSON.stringify(overview, null, 2),
          },
        ],
      };
    }
  );

  server.resource(
    'practice-streaks',
    'tend://practices/streaks',
    { description: 'Current practice streaks and consistency metrics' },
    async () => {
      const { data: practices, error } = await apiClient.practices.getAll();

      if (error) {
        return {
          contents: [
            {
              uri: 'tend://practices/streaks',
              mimeType: 'application/json',
              text: JSON.stringify({ error, streaks: [] }),
            },
          ],
        };
      }

      const streaks = practices
        ?.filter((p) => p.isActive)
        .map((p) => ({
          practiceId: p.id,
          practiceName: p.name,
          lifeArea: p.lifeArea?.name || 'Unknown',
          currentStreak: p.currentStreak,
          longestStreak: p.longestStreak,
          frequency: p.frequency,
          isOnStreak: p.currentStreak > 0,
        }))
        .sort((a, b) => b.currentStreak - a.currentStreak) || [];

      const summary = {
        totalActivePractices: streaks.length,
        practicesOnStreak: streaks.filter((s) => s.isOnStreak).length,
        longestCurrentStreak: Math.max(...streaks.map((s) => s.currentStreak), 0),
        streaks,
      };

      return {
        contents: [
          {
            uri: 'tend://practices/streaks',
            mimeType: 'application/json',
            text: JSON.stringify(summary, null, 2),
          },
        ],
      };
    }
  );

  server.resource(
    'weekly-reflection-summary',
    'tend://reflections/weekly',
    { description: 'Summary of reflections from the past week across all life areas' },
    async () => {
      const { data: reflections, error } = await apiClient.reflections.getAll();

      if (error) {
        return {
          contents: [
            {
              uri: 'tend://reflections/weekly',
              mimeType: 'application/json',
              text: JSON.stringify({ error, reflections: [] }),
            },
          ],
        };
      }

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const weeklyReflections =
        reflections?.filter((r) => new Date(r.createdAt) >= oneWeekAgo) || [];

      const moodCounts: Record<string, number> = {};
      const lifeAreaCounts: Record<string, number> = {};
      const allGratitude: string[] = [];
      const allInsights: string[] = [];

      weeklyReflections.forEach((r) => {
        if (r.mood) {
          moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
        }
        r.lifeAreas?.forEach((la) => {
          const name = la.lifeArea.name;
          lifeAreaCounts[name] = (lifeAreaCounts[name] || 0) + 1;
        });
        allGratitude.push(...r.gratitude);
        allInsights.push(...r.insights);
      });

      const summary = {
        totalReflections: weeklyReflections.length,
        dateRange: {
          from: oneWeekAgo.toISOString(),
          to: new Date().toISOString(),
        },
        moodDistribution: moodCounts,
        lifeAreaFocus: lifeAreaCounts,
        recentGratitude: allGratitude.slice(0, 10),
        recentInsights: allInsights.slice(0, 10),
        reflections: weeklyReflections.map((r) => ({
          id: r.id,
          title: r.title,
          mood: r.mood,
          createdAt: r.createdAt,
          lifeAreas: r.lifeAreas?.map((la) => la.lifeArea.name) || [],
        })),
      };

      return {
        contents: [
          {
            uri: 'tend://reflections/weekly',
            mimeType: 'application/json',
            text: JSON.stringify(summary, null, 2),
          },
        ],
      };
    }
  );
}
