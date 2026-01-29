import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { leafOutline, barbellOutline, journalOutline, chatbubbleOutline } from 'ionicons/icons';

@Component({
  selector: 'tend-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="garden">
          <ion-icon name="leaf-outline" />
          <ion-label>Garden</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="practices">
          <ion-icon name="barbell-outline" />
          <ion-label>Practices</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="reflections">
          <ion-icon name="journal-outline" />
          <ion-label>Reflect</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="guide">
          <ion-icon name="chatbubble-outline" />
          <ion-label>Guide</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsComponent {
  constructor() {
    addIcons({ leafOutline, barbellOutline, journalOutline, chatbubbleOutline });
  }
}
