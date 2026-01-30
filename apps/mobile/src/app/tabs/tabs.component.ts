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
      <ion-tab-bar slot="bottom" style="--background: rgba(255, 255, 255, 0.97); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid rgba(0, 0, 0, 0.06); padding-bottom: env(safe-area-inset-bottom, 0); height: 56px; box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.04);">
        <ion-tab-button tab="garden" style="--color: #9E9E9E; --color-selected: #4CAF50; --padding-top: 6px; --padding-bottom: 6px;">
          <ion-icon name="leaf-outline" style="font-size: 26px;"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 500; letter-spacing: 0.02em; margin-top: 2px;">Garden</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="practices" style="--color: #9E9E9E; --color-selected: #4CAF50; --padding-top: 6px; --padding-bottom: 6px;">
          <ion-icon name="fitness-outline" style="font-size: 26px;"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 500; letter-spacing: 0.02em; margin-top: 2px;">Practices</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="reflections" style="--color: #9E9E9E; --color-selected: #4CAF50; --padding-top: 6px; --padding-bottom: 6px;">
          <ion-icon name="journal-outline" style="font-size: 26px;"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 500; letter-spacing: 0.02em; margin-top: 2px;">Reflect</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="guide" style="--color: #9E9E9E; --color-selected: #4CAF50; --padding-top: 6px; --padding-bottom: 6px;">
          <ion-icon name="sparkles-outline" style="font-size: 26px;"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 500; letter-spacing: 0.02em; margin-top: 2px;">Guide</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
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
