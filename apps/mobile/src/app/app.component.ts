import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonMenuToggle,
  IonSplitPane,
  IonAvatar,
  IonButton,
  IonButtons,
  IonNote,
  IonFooter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leafOutline,
  leaf,
  fitnessOutline,
  fitness,
  journalOutline,
  journal,
  sparklesOutline,
  sparkles,
  personOutline,
  settingsOutline,
  helpCircleOutline,
  logOutOutline,
  moonOutline,
  notificationsOutline,
  shieldCheckmarkOutline,
  informationCircleOutline,
  chevronForwardOutline,
  closeOutline,
} from 'ionicons/icons';

interface MenuItem {
  title: string;
  url: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'tend-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonMenuToggle,
    IonSplitPane,
    IonAvatar,
    IonButton,
    IonButtons,
    IonNote,
    IonFooter,
  ],
  template: `
    <ion-app>
      <ion-menu contentId="main-content" type="overlay">
        <!-- Menu Header with User Profile -->
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 24px 20px 32px; position: relative; overflow: hidden;">
          <!-- Decorative Elements -->
          <div style="position: absolute; top: -30%; right: -20%; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -40%; left: -15%; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>

          <div style="position: relative; z-index: 1;">
            <!-- Close Button -->
            <ion-menu-toggle style="position: absolute; top: -8px; right: -8px;">
              <ion-button fill="clear" style="--color: rgba(255,255,255,0.8);">
                <ion-icon slot="icon-only" name="close-outline"></ion-icon>
              </ion-button>
            </ion-menu-toggle>

            <!-- User Avatar -->
            <div style="width: 72px; height: 72px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border: 3px solid rgba(255,255,255,0.3);">
              <span style="font-size: 36px;">🌱</span>
            </div>

            <!-- User Info -->
            <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: white;">Welcome, Gardener</h2>
            <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.85);">Tending your life garden</p>

            <!-- Stats Row -->
            <div style="display: flex; gap: 24px; margin-top: 16px;">
              <div>
                <span style="font-size: 20px; font-weight: 700; color: white;">8</span>
                <span style="font-size: 12px; color: rgba(255,255,255,0.8); display: block;">Life Areas</span>
              </div>
              <div>
                <span style="font-size: 20px; font-weight: 700; color: white;">12</span>
                <span style="font-size: 12px; color: rgba(255,255,255,0.8); display: block;">Practices</span>
              </div>
              <div>
                <span style="font-size: 20px; font-weight: 700; color: white;">5</span>
                <span style="font-size: 12px; color: rgba(255,255,255,0.8); display: block;">Day Streak</span>
              </div>
            </div>
          </div>
        </div>

        <ion-content style="--background: #FAFAFA;">
          <!-- Main Navigation -->
          <div style="padding: 16px 12px 8px;">
            <p style="font-size: 11px; font-weight: 600; color: #9E9E9E; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 8px;">Navigate</p>
          </div>

          <ion-list style="padding: 0; background: transparent;">
            @for (item of mainMenuItems; track item.url) {
              <ion-menu-toggle auto-hide="false">
                <ion-item
                  [routerLink]="item.url"
                  routerLinkActive="menu-item-active"
                  lines="none"
                  detail="false"
                  button
                  style="--background: transparent; --padding-start: 16px; --inner-padding-end: 16px; --min-height: 52px; margin: 4px 12px; border-radius: 12px;"
                >
                  <div
                    slot="start"
                    [style.background]="item.color + '20'"
                    style="width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 12px;"
                  >
                    <ion-icon [name]="item.icon" [style.color]="item.color" style="font-size: 22px;"></ion-icon>
                  </div>
                  <ion-label style="font-weight: 500; font-size: 15px;">{{ item.title }}</ion-label>
                  <ion-icon name="chevron-forward-outline" slot="end" style="color: #BDBDBD; font-size: 18px;"></ion-icon>
                </ion-item>
              </ion-menu-toggle>
            }
          </ion-list>

          <!-- Settings Section -->
          <div style="padding: 24px 12px 8px;">
            <p style="font-size: 11px; font-weight: 600; color: #9E9E9E; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 8px;">Settings</p>
          </div>

          <ion-list style="padding: 0; background: transparent;">
            @for (item of settingsMenuItems; track item.title) {
              <ion-menu-toggle auto-hide="false">
                <ion-item
                  lines="none"
                  detail="false"
                  button
                  style="--background: transparent; --padding-start: 16px; --inner-padding-end: 16px; --min-height: 48px; margin: 2px 12px; border-radius: 12px;"
                >
                  <ion-icon [name]="item.icon" slot="start" style="color: #757575; font-size: 20px; margin-right: 12px;"></ion-icon>
                  <ion-label style="font-weight: 500; font-size: 14px; color: #616161;">{{ item.title }}</ion-label>
                </ion-item>
              </ion-menu-toggle>
            }
          </ion-list>

          <!-- App Version -->
          <div style="padding: 32px 20px; text-align: center;">
            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #E8F5E9, #C8E6C9); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
              <span style="font-size: 24px;">🌿</span>
            </div>
            <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #4CAF50;">Tend</p>
            <p style="margin: 0; font-size: 12px; color: #9E9E9E;">Version 1.0.0</p>
          </div>
        </ion-content>
      </ion-menu>

      <ion-router-outlet id="main-content" />
    </ion-app>
  `,
  styles: [`
    ion-item.menu-item-active {
      --background: rgba(76, 175, 80, 0.12);
    }

    ion-item.menu-item-active ion-label {
      color: #2E7D32;
      font-weight: 600;
    }
  `],
})
export class AppComponent {
  mainMenuItems: MenuItem[] = [
    { title: 'My Garden', url: '/garden', icon: 'leaf-outline', color: '#4CAF50' },
    { title: 'Practices', url: '/practices', icon: 'fitness-outline', color: '#FF9800' },
    { title: 'Reflections', url: '/reflections', icon: 'journal-outline', color: '#2196F3' },
    { title: 'Garden Guide', url: '/guide', icon: 'sparkles-outline', color: '#9C27B0' },
  ];

  settingsMenuItems = [
    { title: 'Profile', icon: 'person-outline' },
    { title: 'Notifications', icon: 'notifications-outline' },
    { title: 'Appearance', icon: 'moon-outline' },
    { title: 'Privacy', icon: 'shield-checkmark-outline' },
    { title: 'Help & Support', icon: 'help-circle-outline' },
    { title: 'About', icon: 'information-circle-outline' },
  ];

  constructor() {
    addIcons({
      leafOutline,
      leaf,
      fitnessOutline,
      fitness,
      journalOutline,
      journal,
      sparklesOutline,
      sparkles,
      personOutline,
      settingsOutline,
      helpCircleOutline,
      logOutOutline,
      moonOutline,
      notificationsOutline,
      shieldCheckmarkOutline,
      informationCircleOutline,
      chevronForwardOutline,
      closeOutline,
    });
  }
}
