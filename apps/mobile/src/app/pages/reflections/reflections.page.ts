import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButton,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonChip,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, happyOutline, sadOutline } from 'ionicons/icons';
import { ApiService, Reflection, LifeArea } from '../../services/api.service';

@Component({
  selector: 'tend-reflections-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonButton,
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonChip,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Reflections</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openNewReflection()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div class="loading-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p>Loading reflections...</p>
        </div>
      } @else {
        @if (reflections().length === 0) {
          <ion-card>
            <ion-card-content class="empty-state">
              <div class="empty-icon">📝</div>
              <h3>No reflections yet</h3>
              <p>Start journaling to track your growth and insights.</p>
              <ion-button (click)="openNewReflection()" color="primary" class="ion-margin-top">
                Write Your First Reflection
              </ion-button>
            </ion-card-content>
          </ion-card>
        } @else {
          <ion-list>
            @for (reflection of reflections(); track reflection.id) {
              <ion-card class="reflection-card">
                <ion-card-header>
                  <div class="reflection-header">
                    <ion-card-title>{{ reflection.title }}</ion-card-title>
                    @if (reflection.mood) {
                      <span class="mood-emoji">{{ getMoodEmoji(reflection.mood) }}</span>
                    }
                  </div>
                  <p class="reflection-date">{{ formatDate(reflection.createdAt) }}</p>
                </ion-card-header>
                <ion-card-content>
                  <p class="reflection-content">{{ reflection.content }}</p>

                  @if (reflection.gratitude && reflection.gratitude.length > 0) {
                    <div class="gratitude-section">
                      <h4>Gratitude</h4>
                      <div class="gratitude-list">
                        @for (item of reflection.gratitude; track $index) {
                          <ion-chip size="small" color="warning">{{ item }}</ion-chip>
                        }
                      </div>
                    </div>
                  }

                  @if (reflection.lifeAreas && reflection.lifeAreas.length > 0) {
                    <div class="life-areas-section">
                      @for (la of reflection.lifeAreas; track la.lifeArea.id) {
                        <ion-chip size="small" color="tertiary">{{ la.lifeArea.name }}</ion-chip>
                      }
                    </div>
                  }
                </ion-card-content>
              </ion-card>
            }
          </ion-list>
        }
      }

      <!-- New Reflection Modal -->
      <ion-modal [isOpen]="showNewReflection()" (didDismiss)="closeNewReflection()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-buttons slot="start">
                <ion-button (click)="closeNewReflection()">
                  <ion-icon slot="icon-only" name="close-outline"></ion-icon>
                </ion-button>
              </ion-buttons>
              <ion-title>New Reflection</ion-title>
              <ion-buttons slot="end">
                <ion-button
                  (click)="saveReflection()"
                  [disabled]="!newReflection.title || !newReflection.content"
                >
                  Save
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding">
            <ion-list>
              <ion-item>
                <ion-input
                  label="Title"
                  labelPlacement="stacked"
                  [(ngModel)]="newReflection.title"
                  placeholder="What's on your mind?"
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">How are you feeling?</ion-label>
                <div class="mood-selector">
                  @for (mood of moods; track mood.value) {
                    <button
                      class="mood-button"
                      [class.selected]="newReflection.mood === mood.value"
                      (click)="newReflection.mood = mood.value"
                    >
                      {{ mood.emoji }}
                    </button>
                  }
                </div>
              </ion-item>

              <ion-item>
                <ion-textarea
                  label="Your Reflection"
                  labelPlacement="stacked"
                  [(ngModel)]="newReflection.content"
                  placeholder="Write your thoughts, observations, and insights..."
                  [rows]="6"
                  [autoGrow]="true"
                ></ion-textarea>
              </ion-item>

              <ion-item>
                <ion-select
                  label="Related Life Areas"
                  labelPlacement="stacked"
                  [(ngModel)]="selectedLifeAreas"
                  [multiple]="true"
                  placeholder="Select life areas"
                >
                  @for (area of lifeAreas(); track area.id) {
                    <ion-select-option [value]="area.id">{{ area.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-input
                  label="Gratitude (press Enter to add)"
                  labelPlacement="stacked"
                  [(ngModel)]="gratitudeInput"
                  (keyup.enter)="addGratitude()"
                  placeholder="What are you grateful for?"
                ></ion-input>
              </ion-item>

              @if (newReflection.gratitude.length > 0) {
                <div class="gratitude-chips ion-padding-horizontal">
                  @for (item of newReflection.gratitude; track $index) {
                    <ion-chip color="warning">
                      {{ item }}
                      <ion-icon name="close-outline" (click)="removeGratitude($index)"></ion-icon>
                    </ion-chip>
                  }
                </div>
              }
            </ion-list>
          </ion-content>
        </ng-template>
      </ion-modal>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button (click)="openNewReflection()">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: var(--ion-color-medium);
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: var(--ion-color-dark);
    }

    .empty-state p {
      margin: 0;
      color: var(--ion-color-medium);
    }

    .reflection-card {
      margin: 16px;
    }

    .reflection-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .mood-emoji {
      font-size: 28px;
    }

    .reflection-date {
      font-size: 12px;
      color: var(--ion-color-medium);
      margin-top: 4px;
    }

    .reflection-content {
      white-space: pre-line;
      margin: 0 0 16px 0;
    }

    .gratitude-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--ion-color-light);
    }

    .gratitude-section h4 {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--ion-color-dark);
    }

    .gratitude-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .life-areas-section {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 12px;
    }

    .mood-selector {
      display: flex;
      gap: 8px;
      padding: 8px 0;
    }

    .mood-button {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid var(--ion-color-light);
      background: var(--ion-color-light);
      font-size: 24px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mood-button.selected {
      border-color: var(--ion-color-primary);
      background: var(--ion-color-primary-tint);
      transform: scale(1.1);
    }

    .gratitude-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding-bottom: 16px;
    }
  `],
})
export class ReflectionsPage implements OnInit {
  private api = inject(ApiService);

  reflections = signal<Reflection[]>([]);
  lifeAreas = signal<LifeArea[]>([]);
  loading = signal(true);
  showNewReflection = signal(false);
  selectedLifeAreas: string[] = [];

  newReflection = {
    title: '',
    content: '',
    mood: '',
    gratitude: [] as string[],
  };
  gratitudeInput = '';

  moods = [
    { value: 'great', emoji: '😊', label: 'Great' },
    { value: 'good', emoji: '🙂', label: 'Good' },
    { value: 'okay', emoji: '😐', label: 'Okay' },
    { value: 'low', emoji: '😔', label: 'Low' },
    { value: 'difficult', emoji: '😢', label: 'Difficult' },
  ];

  private moodEmojis: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    neutral: '😐',
    low: '😔',
    difficult: '😢',
  };

  constructor() {
    addIcons({
      addOutline,
      closeOutline,
      happyOutline,
      sadOutline,
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  handleRefresh(event: CustomEvent): void {
    this.loadData();
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  private loadData(): void {
    this.loading.set(true);
    this.api.getReflections().subscribe({
      next: (reflections) => {
        this.reflections.set(reflections);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });

    this.api.getLifeAreas().subscribe({
      next: (areas) => {
        this.lifeAreas.set(areas);
      },
    });
  }

  openNewReflection(): void {
    this.showNewReflection.set(true);
  }

  closeNewReflection(): void {
    this.showNewReflection.set(false);
    this.resetForm();
  }

  addGratitude(): void {
    if (this.gratitudeInput.trim()) {
      this.newReflection.gratitude.push(this.gratitudeInput.trim());
      this.gratitudeInput = '';
    }
  }

  removeGratitude(index: number): void {
    this.newReflection.gratitude.splice(index, 1);
  }

  saveReflection(): void {
    if (!this.newReflection.title || !this.newReflection.content) return;

    this.api.createReflection({
      title: this.newReflection.title,
      content: this.newReflection.content,
      mood: this.newReflection.mood || undefined,
      gratitude: this.newReflection.gratitude,
      lifeAreaIds: this.selectedLifeAreas,
      userId: 'demo-user',
    }).subscribe({
      next: (reflection) => {
        this.reflections.set([reflection, ...this.reflections()]);
        this.closeNewReflection();
      },
    });
  }

  private resetForm(): void {
    this.newReflection = {
      title: '',
      content: '',
      mood: '',
      gratitude: [],
    };
    this.gratitudeInput = '';
    this.selectedLifeAreas = [];
  }

  getMoodEmoji(mood: string): string {
    return this.moodEmojis[mood.toLowerCase()] || '😐';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
