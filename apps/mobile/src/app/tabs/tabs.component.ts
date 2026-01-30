import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leaf,
  leafOutline,
  fitness,
  fitnessOutline,
  journal,
  journalOutline,
  sparkles,
  sparklesOutline,
} from 'ionicons/icons';

@Component({
  selector: 'tend-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="garden">
          <ion-icon name="leaf-outline" aria-hidden="true"></ion-icon>
          <ion-label>Garden</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="practices">
          <ion-icon name="fitness-outline" aria-hidden="true"></ion-icon>
          <ion-label>Practices</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="reflections">
          <ion-icon name="journal-outline" aria-hidden="true"></ion-icon>
          <ion-label>Reflect</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="guide">
          <ion-icon name="sparkles-outline" aria-hidden="true"></ion-icon>
          <ion-label>Guide</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --background: rgba(253, 252, 249, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid rgba(122, 157, 128, 0.2);
      padding-bottom: env(safe-area-inset-bottom, 0);
    }

    ion-tab-button {
      --color: #7a9d80;
      --color-selected: #3d9a50;
      --padding-top: 8px;
      --padding-bottom: 8px;
      transition: all 0.2s ease;

      &::part(native) {
        transition: transform 0.2s ease;
      }

      &.tab-selected::part(native) {
        transform: translateY(-2px);
      }

      ion-icon {
        font-size: 24px;
        transition: transform 0.2s ease;
      }

      &.tab-selected ion-icon {
        transform: scale(1.1);
      }

      ion-label {
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.02em;
        margin-top: 2px;
      }
    }
  `],
})
export class TabsComponent {
  constructor() {
    addIcons({
      leaf,
      leafOutline,
      fitness,
      fitnessOutline,
      journal,
      journalOutline,
      sparkles,
      sparklesOutline,
    });
  }
}
