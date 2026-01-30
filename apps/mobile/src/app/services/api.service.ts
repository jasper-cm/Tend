import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  reflections?: { reflection: Reflection }[];
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
  updatedAt: string;
  lifeAreas?: { lifeArea: LifeArea }[];
}

export interface CreateReflectionDto {
  title: string;
  content: string;
  type?: string;
  mood?: string;
  gratitude?: string[];
  insights?: string[];
  lifeAreaIds?: string[];
  userId: string;
}

export interface ChatResponse {
  reply: string;
  context: {
    gardenHealth: number;
    activeStreaks: number;
    recentReflections: number;
  };
}

export interface Insight {
  type: 'celebration' | 'encouragement' | 'suggestion' | 'observation';
  title: string;
  message: string;
  lifeArea?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface InsightsResponse {
  insights: Insight[];
  summary: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  // Life Areas
  getLifeAreas(): Observable<LifeArea[]> {
    return this.http.get<LifeArea[]>(`${this.baseUrl}/life-areas`);
  }

  getLifeArea(id: string): Observable<LifeArea> {
    return this.http.get<LifeArea>(`${this.baseUrl}/life-areas/${id}`);
  }

  createLifeArea(data: Partial<LifeArea>): Observable<LifeArea> {
    return this.http.post<LifeArea>(`${this.baseUrl}/life-areas`, data);
  }

  updateLifeArea(id: string, data: Partial<LifeArea>): Observable<LifeArea> {
    return this.http.put<LifeArea>(`${this.baseUrl}/life-areas/${id}`, data);
  }

  deleteLifeArea(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/life-areas/${id}`);
  }

  // Practices
  getPractices(): Observable<Practice[]> {
    return this.http.get<Practice[]>(`${this.baseUrl}/practices`);
  }

  getPractice(id: string): Observable<Practice> {
    return this.http.get<Practice>(`${this.baseUrl}/practices/${id}`);
  }

  createPractice(data: Partial<Practice>): Observable<Practice> {
    return this.http.post<Practice>(`${this.baseUrl}/practices`, data);
  }

  updatePractice(id: string, data: Partial<Practice>): Observable<Practice> {
    return this.http.put<Practice>(`${this.baseUrl}/practices/${id}`, data);
  }

  deletePractice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/practices/${id}`);
  }

  logPractice(id: string, data: { durationMinutes?: number; notes?: string; quality?: number }): Observable<PracticeLog> {
    return this.http.post<PracticeLog>(`${this.baseUrl}/practices/${id}/log`, data);
  }

  // Reflections
  getReflections(lifeAreaId?: string): Observable<Reflection[]> {
    const url = lifeAreaId
      ? `${this.baseUrl}/reflections?lifeAreaId=${lifeAreaId}`
      : `${this.baseUrl}/reflections`;
    return this.http.get<Reflection[]>(url);
  }

  getReflection(id: string): Observable<Reflection> {
    return this.http.get<Reflection>(`${this.baseUrl}/reflections/${id}`);
  }

  createReflection(data: CreateReflectionDto): Observable<Reflection> {
    return this.http.post<Reflection>(`${this.baseUrl}/reflections`, data);
  }

  updateReflection(id: string, data: Partial<Reflection>): Observable<Reflection> {
    return this.http.put<Reflection>(`${this.baseUrl}/reflections/${id}`, data);
  }

  deleteReflection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reflections/${id}`);
  }

  // Garden Guide
  chat(message: string, history?: { role: 'user' | 'assistant'; content: string }[]): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/garden-guide/chat`, { message, history });
  }

  getInsights(): Observable<InsightsResponse> {
    return this.http.get<InsightsResponse>(`${this.baseUrl}/garden-guide/insights`);
  }
}
