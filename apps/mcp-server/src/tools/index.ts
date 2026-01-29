import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiClient, LifeArea, Practice } from '../api-client';

const PRACTICE_SUGGESTIONS: Record<string, { name: string; description: string; category: string; frequency: string }[]> = {
  health: [
    { name: 'Morning stretch routine', description: '10-minute gentle stretching to start the day', category: 'habit', frequency: 'daily' },
    { name: 'Hydration tracking', description: 'Drink 8 glasses of water throughout the day', category: 'habit', frequency: 'daily' },
    { name: 'Evening walk', description: '20-minute walk after dinner for digestion and reflection', category: 'routine', frequency: 'daily' },
    { name: 'Weekly meal prep', description: 'Prepare healthy meals for the upcoming week', category: 'routine', frequency: 'weekly' },
    { name: 'Sleep hygiene ritual', description: 'Wind-down routine 30 minutes before bed', category: 'ritual', frequency: 'daily' },
  ],
  career: [
    { name: 'Morning intention setting', description: 'Set top 3 priorities for the workday', category: 'habit', frequency: 'daily' },
    { name: 'Skill learning block', description: 'Dedicated time for professional development', category: 'routine', frequency: 'daily' },
    { name: 'Weekly review', description: 'Review accomplishments and plan for next week', category: 'routine', frequency: 'weekly' },
    { name: 'Networking outreach', description: 'Connect with one professional contact', category: 'habit', frequency: 'weekly' },
    { name: 'Deep work session', description: '90-minute focused work without distractions', category: 'routine', frequency: 'daily' },
  ],
  relationships: [
    { name: 'Quality time block', description: 'Uninterrupted time with loved ones', category: 'ritual', frequency: 'daily' },
    { name: 'Gratitude expression', description: 'Express appreciation to someone important', category: 'habit', frequency: 'daily' },
    { name: 'Weekly date night', description: 'Dedicated quality time with partner', category: 'ritual', frequency: 'weekly' },
    { name: 'Friend check-in', description: 'Reach out to a friend you haven\'t talked to recently', category: 'habit', frequency: 'weekly' },
    { name: 'Active listening practice', description: 'Practice fully present listening in conversations', category: 'habit', frequency: 'daily' },
  ],
  mind: [
    { name: 'Morning meditation', description: '10-minute mindfulness meditation', category: 'ritual', frequency: 'daily' },
    { name: 'Reading time', description: '30 minutes of reading for growth or pleasure', category: 'habit', frequency: 'daily' },
    { name: 'Journaling practice', description: 'Write reflections, thoughts, and insights', category: 'ritual', frequency: 'daily' },
    { name: 'Learning something new', description: 'Explore a new topic or skill', category: 'habit', frequency: 'weekly' },
    { name: 'Digital detox hour', description: 'One hour without screens or devices', category: 'routine', frequency: 'daily' },
  ],
  creativity: [
    { name: 'Morning pages', description: 'Stream of consciousness writing upon waking', category: 'ritual', frequency: 'daily' },
    { name: 'Creative play time', description: 'Unstructured creative exploration', category: 'routine', frequency: 'daily' },
    { name: 'Inspiration gathering', description: 'Collect ideas, images, and inspiration', category: 'habit', frequency: 'daily' },
    { name: 'Weekly creative project', description: 'Work on a personal creative project', category: 'routine', frequency: 'weekly' },
    { name: 'Try something new', description: 'Experiment with a new creative medium or technique', category: 'habit', frequency: 'weekly' },
  ],
  finance: [
    { name: 'Daily expense tracking', description: 'Log all expenses at end of day', category: 'habit', frequency: 'daily' },
    { name: 'Weekly budget review', description: 'Review spending against budget', category: 'routine', frequency: 'weekly' },
    { name: 'Savings transfer', description: 'Move money to savings account', category: 'habit', frequency: 'weekly' },
    { name: 'Financial learning', description: 'Read or learn about personal finance', category: 'habit', frequency: 'weekly' },
    { name: 'Monthly financial review', description: 'Comprehensive review of financial health', category: 'routine', frequency: 'monthly' },
  ],
  spirituality: [
    { name: 'Morning gratitude', description: 'List 3 things you\'re grateful for', category: 'ritual', frequency: 'daily' },
    { name: 'Mindful breathing', description: '5 minutes of conscious breathing', category: 'habit', frequency: 'daily' },
    { name: 'Nature connection', description: 'Spend time in nature mindfully', category: 'ritual', frequency: 'daily' },
    { name: 'Values reflection', description: 'Reflect on living in alignment with values', category: 'routine', frequency: 'weekly' },
    { name: 'Service to others', description: 'Perform an act of kindness or service', category: 'habit', frequency: 'daily' },
  ],
  default: [
    { name: 'Daily check-in', description: 'Brief self-assessment of this life area', category: 'habit', frequency: 'daily' },
    { name: 'Weekly planning', description: 'Set intentions for the week ahead', category: 'routine', frequency: 'weekly' },
    { name: 'Progress reflection', description: 'Reflect on growth and challenges', category: 'ritual', frequency: 'weekly' },
    { name: 'Small improvement', description: 'Make one small improvement each day', category: 'habit', frequency: 'daily' },
    { name: 'Learning exploration', description: 'Learn something new related to this area', category: 'habit', frequency: 'weekly' },
  ],
};

function getSuggestionsForLifeArea(lifeArea: LifeArea, existingPractices: Practice[], goal?: string): typeof PRACTICE_SUGGESTIONS['default'] {
  const slug = lifeArea.slug.toLowerCase();
  const suggestions = PRACTICE_SUGGESTIONS[slug] || PRACTICE_SUGGESTIONS.default;

  const existingNames = existingPractices.map(p => p.name.toLowerCase());
  const filtered = suggestions.filter(s => !existingNames.some(name => name.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(name)));

  if (goal) {
    const goalLower = goal.toLowerCase();
    const prioritized = filtered.sort((a, b) => {
      const aMatch = a.name.toLowerCase().includes(goalLower) || a.description.toLowerCase().includes(goalLower);
      const bMatch = b.name.toLowerCase().includes(goalLower) || b.description.toLowerCase().includes(goalLower);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
    return prioritized.slice(0, 3);
  }

  return filtered.slice(0, 3);
}

export function registerTools(server: McpServer) {
  server.tool(
    'get-life-areas',
    'Retrieve all life areas with their current health scores',
    {},
    async () => {
      const { data: lifeAreas, error } = await apiClient.lifeAreas.getAll();

      if (error) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error }) }],
        };
      }

      const result = lifeAreas?.map((la) => ({
        id: la.id,
        name: la.name,
        slug: la.slug,
        description: la.description,
        icon: la.icon,
        color: la.color,
        healthScore: la.healthScore,
        practiceCount: la.practices?.length || 0,
        healthStatus: la.healthScore >= 75 ? 'thriving' : la.healthScore >= 50 ? 'growing' : 'needs attention',
      })) || [];

      return {
        content: [
          { type: 'text' as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );

  server.tool(
    'get-practices',
    'Retrieve practices for a specific life area, with recent logs',
    { lifeAreaId: z.string().optional().describe('Filter by life area ID') },
    async ({ lifeAreaId }) => {
      const { data: practices, error } = await apiClient.practices.getAll();

      if (error) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error }) }],
        };
      }

      let filtered = practices || [];
      if (lifeAreaId) {
        filtered = filtered.filter((p) => p.lifeAreaId === lifeAreaId);
      }

      const result = filtered.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        frequency: p.frequency,
        isActive: p.isActive,
        currentStreak: p.currentStreak,
        longestStreak: p.longestStreak,
        lifeArea: p.lifeArea?.name || 'Unknown',
        streakStatus: p.currentStreak >= 7 ? 'strong' : p.currentStreak > 0 ? 'building' : 'inactive',
      }));

      return {
        content: [
          { type: 'text' as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );

  server.tool(
    'get-reflections',
    'Retrieve journal reflections, optionally filtered by life area or date range',
    {
      lifeAreaId: z.string().optional().describe('Filter by life area ID'),
      fromDate: z.string().optional().describe('Start date (ISO 8601)'),
      toDate: z.string().optional().describe('End date (ISO 8601)'),
    },
    async ({ lifeAreaId, fromDate, toDate }) => {
      const { data: reflections, error } = await apiClient.reflections.getAll(lifeAreaId);

      if (error) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error }) }],
        };
      }

      let filtered = reflections || [];

      if (fromDate) {
        const from = new Date(fromDate);
        filtered = filtered.filter((r) => new Date(r.createdAt) >= from);
      }

      if (toDate) {
        const to = new Date(toDate);
        filtered = filtered.filter((r) => new Date(r.createdAt) <= to);
      }

      const result = filtered.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content.substring(0, 200) + (r.content.length > 200 ? '...' : ''),
        mood: r.mood,
        gratitude: r.gratitude,
        insights: r.insights,
        createdAt: r.createdAt,
        lifeAreas: r.lifeAreas?.map((la) => la.lifeArea.name) || [],
      }));

      return {
        content: [
          { type: 'text' as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );

  server.tool(
    'suggest-practice',
    'Suggest a new practice based on user goals and current life area health',
    {
      lifeAreaId: z.string().describe('The life area to suggest a practice for'),
      goal: z.string().optional().describe('Specific goal to work toward'),
    },
    async ({ lifeAreaId, goal }) => {
      const { data: lifeArea, error: laError } = await apiClient.lifeAreas.getOne(lifeAreaId);

      if (laError || !lifeArea) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: laError || 'Life area not found' }) }],
        };
      }

      const { data: practices } = await apiClient.practices.getAll();
      const lifeAreaPractices = (practices || []).filter(p => p.lifeAreaId === lifeAreaId);

      const suggestions = getSuggestionsForLifeArea(lifeArea, lifeAreaPractices, goal);

      const result = {
        lifeArea: {
          id: lifeArea.id,
          name: lifeArea.name,
          healthScore: lifeArea.healthScore,
          currentPracticeCount: lifeAreaPractices.length,
        },
        goal: goal || 'general improvement',
        suggestions: suggestions.map(s => ({
          ...s,
          rationale: lifeArea.healthScore < 50
            ? `This practice can help boost your ${lifeArea.name} health score from its current level of ${lifeArea.healthScore}.`
            : `This practice can help maintain and further improve your ${lifeArea.name} area.`,
        })),
        tip: lifeAreaPractices.length === 0
          ? 'Start with just one practice and build consistency before adding more.'
          : lifeAreaPractices.length < 3
            ? 'You have room to add more practices. Consider adding one that complements your existing routine.'
            : 'You have several practices already. Focus on consistency before adding more.',
      };

      return {
        content: [
          { type: 'text' as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );
}
