const API_BASE_URL = process.env.TEND_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return { data: null as T, error: error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export interface LifeArea {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  healthScore: number;
  userId: string;
  practices?: Practice[];
}

export interface Practice {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  durationMinutes: number | null;
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  lifeAreaId: string;
  lifeArea?: LifeArea;
  logs?: PracticeLog[];
}

export interface PracticeLog {
  id: string;
  practiceId: string;
  completedAt: string;
  durationMinutes: number | null;
  notes: string | null;
  quality: number | null;
}

export interface Reflection {
  id: string;
  type: string;
  title: string;
  content: string;
  mood: string | null;
  gratitude: string[];
  insights: string[];
  userId: string;
  createdAt: string;
  lifeAreas?: { lifeArea: LifeArea }[];
}

export const apiClient = {
  lifeAreas: {
    getAll: () => fetchApi<LifeArea[]>('/life-areas'),
    getOne: (id: string) => fetchApi<LifeArea>(`/life-areas/${id}`),
  },

  practices: {
    getAll: () => fetchApi<Practice[]>('/practices'),
    getOne: (id: string) => fetchApi<Practice>(`/practices/${id}`),
    log: (id: string, data: { durationMinutes?: number; notes?: string; quality?: number }) =>
      fetchApi<PracticeLog>(`/practices/${id}/log`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  reflections: {
    getAll: (lifeAreaId?: string) =>
      fetchApi<Reflection[]>(
        lifeAreaId ? `/reflections?lifeAreaId=${lifeAreaId}` : '/reflections'
      ),
    getOne: (id: string) => fetchApi<Reflection>(`/reflections/${id}`),
    create: (data: {
      title: string;
      content: string;
      type?: string;
      mood?: string;
      gratitude?: string[];
      insights?: string[];
      lifeAreaIds?: string[];
      userId: string;
    }) =>
      fetchApi<Reflection>('/reflections', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
