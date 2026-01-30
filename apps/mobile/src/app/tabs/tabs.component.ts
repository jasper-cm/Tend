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
      <ion-tab-bar slot="bottom" style="--background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.95) 100%); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid rgba(134, 239, 172, 0.2); padding-bottom: env(safe-area-inset-bottom, 0); height: 60px; box-shadow: 0 -8px 32px rgba(34, 197, 94, 0.08);">
        <ion-tab-button tab="garden" style="--color: #9ca3af; --color-selected: #22c55e; --padding-top: 8px; --padding-bottom: 8px; transition: all 0.3s ease;">
          <ion-icon name="leaf-outline" style="font-size: 24px;"></ion-icon>
          <ion-label style="font-size: 10px; font-weight: 600; letter-spacing: 0.03em; margin-top: 4px;">Garden</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="practices" style="--color: #9ca3af; --color-selected: #22c55e; --padding-top: 8px; --padding-bottom: 8px; transition: all 0.3s ease;">
          <ion-icon name="fitness-outline" style="font-size: 24px;"></ion-icon>
          <ion-label style="font-size: 10px; font-weight: 600; letter-spacing: 0.03em; margin-top: 4px;">Practices</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="reflections" style="--color: #9ca3af; --color-selected: #22c55e; --padding-top: 8px; --padding-bottom: 8px; transition: all 0.3s ease;">
          <ion-icon name="journal-outline" style="font-size: 24px;"></ion-icon>
          <ion-label style="font-size: 10px; font-weight: 600; letter-spacing: 0.03em; margin-top: 4px;">Reflect</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="guide" style="--color: #9ca3af; --color-selected: #22c55e; --padding-top: 8px; --padding-bottom: 8px; transition: all 0.3s ease;">
          <ion-icon name="sparkles-outline" style="font-size: 24px;"></ion-icon>
          <ion-label style="font-size: 10px; font-weight: 600; letter-spacing: 0.03em; margin-top: 4px;">Guide</ion-label>
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
