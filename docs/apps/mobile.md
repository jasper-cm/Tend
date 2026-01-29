---
layout: default
title: Mobile Application
nav_order: 7
parent: Apps
---

# Mobile Application

The Tend mobile app is built with Ionic 8 and Capacitor 6, leveraging Angular 18 standalone components for a native-like experience on iOS and Android.

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Ionic | 8.x | Mobile UI framework |
| Capacitor | 6.x | Native runtime bridge |
| Angular | 18.x | Component framework |
| Ionicons | 7.x | Icon library |

---

## Project Structure

```
apps/mobile/
├── src/
│   ├── app/
│   │   ├── pages/                    # Tab pages
│   │   │   ├── garden/               # Life Garden dashboard
│   │   │   ├── practices/            # Practice tracking
│   │   │   ├── reflections/          # Journal entries
│   │   │   └── garden-guide/         # AI chat interface
│   │   ├── tabs/                     # Tab navigation component
│   │   ├── app.component.ts          # Root component
│   │   └── app.routes.ts             # Route definitions
│   ├── theme/
│   │   └── variables.scss            # Ionic theme variables
│   ├── global.scss                   # Global styles
│   ├── index.html                    # HTML entry point
│   └── main.ts                       # Bootstrap
├── ios/                              # iOS native project (after build)
├── android/                          # Android native project (after build)
├── capacitor.config.ts               # Capacitor configuration
├── ionic.config.json                 # Ionic CLI configuration
├── tsconfig.app.json                 # TypeScript config
└── project.json                      # Nx project config
```

---

## Navigation

The mobile app uses a tab-based navigation pattern with four main sections:

| Tab | Icon | Route | Page | Description |
|-----|------|-------|------|-------------|
| Garden | leaf-outline | `/garden` | `GardenPage` | Life area overview |
| Practices | barbell-outline | `/practices` | `PracticesPage` | Habit tracking |
| Reflect | journal-outline | `/reflections` | `ReflectionsPage` | Journaling |
| Guide | chatbubble-outline | `/guide` | `GardenGuidePage` | AI assistance |

### Route Configuration

```typescript
// app.routes.ts
export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./tabs/tabs.component').then((m) => m.TabsComponent),
    children: [
      {
        path: 'garden',
        loadComponent: () =>
          import('./pages/garden/garden.page').then((m) => m.GardenPage),
      },
      {
        path: 'practices',
        loadComponent: () =>
          import('./pages/practices/practices.page').then((m) => m.PracticesPage),
      },
      {
        path: 'reflections',
        loadComponent: () =>
          import('./pages/reflections/reflections.page').then((m) => m.ReflectionsPage),
      },
      {
        path: 'guide',
        loadComponent: () =>
          import('./pages/garden-guide/garden-guide.page').then((m) => m.GardenGuidePage),
      },
      { path: '', redirectTo: 'garden', pathMatch: 'full' },
    ],
  },
];
```

---

## Components

### Standalone Architecture

All components use Angular 18's standalone component pattern with Ionic components:

```typescript
@Component({
  selector: 'tend-garden-page',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>My Garden</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>Your life garden overview will appear here.</p>
    </ion-content>
  `,
})
export class GardenPage {}
```

### Tab Bar Component

The tabs component manages bottom navigation:

```typescript
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
```

---

## Pages

### Garden Page

The main dashboard showing all life areas with their health scores:

**Features:**
- Grid of life area cards with health scores
- Visual indicators using garden color palette
- Quick access to each life area's detail view

### Practices Page

Track and log daily habits and routines:

**Features:**
- List of active practices grouped by life area
- Quick-log button for each practice
- Streak counters showing consistency
- Filter by life area or frequency

### Reflections Page

Journal entries for self-reflection:

**Features:**
- Chronological list of journal entries
- Mood indicator badges
- Create new reflection with type selection
- Link reflections to relevant life areas

### Garden Guide Page

AI-powered coaching interface:

**Features:**
- Chat interface with the Garden Guide AI
- Contextual suggestions based on health scores
- Practice recommendations
- Reflection prompts

---

## Styling

### Ionic Theme Variables

Custom theme variables are defined in `src/theme/variables.scss`:

```scss
:root {
  // Garden color palette
  --ion-color-primary: #4a7c59;           // leaf green
  --ion-color-primary-rgb: 74, 124, 89;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-shade: #2f5738;
  --ion-color-primary-tint: #6b9e7a;

  --ion-color-secondary: #d4a843;         // sun gold
  --ion-color-secondary-rgb: 212, 168, 67;

  --ion-color-tertiary: #c07850;          // terracotta
  --ion-color-tertiary-rgb: 192, 120, 80;

  // Background colors
  --ion-background-color: #faf6ee;        // cream
  --ion-toolbar-background: #2f5738;      // leaf-dark
  --ion-tab-bar-background: #f5f0e8;      // parchment

  // Text colors
  --ion-text-color: #3d2e1f;              // soil
  --ion-toolbar-color: #f5f0e8;           // parchment
}
```

### Global Styles

Additional global styles in `src/global.scss`:

```scss
// Garden-themed utilities
.bg-leaf { background-color: var(--ion-color-primary); }
.bg-cream { background-color: var(--ion-background-color); }
.text-soil { color: var(--ion-text-color); }

// Card styling
ion-card {
  --background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(61, 46, 31, 0.1);
}
```

---

## Capacitor Configuration

Native platform configuration in `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tend.app',
  appName: 'Tend',
  webDir: 'dist/apps/mobile',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#faf6ee',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#2f5738',
    },
  },
};

export default config;
```

---

## Development

### Running in Browser

```bash
npm run start:mobile
```

Opens at `http://localhost:4200` with live reload and Ionic DevTools.

### Building for Production

```bash
# Build the web assets
npx nx run mobile:build --configuration=production

# Sync to native projects
npx cap sync
```

### Running on iOS

```bash
# Add iOS platform (first time only)
npx cap add ios

# Open in Xcode
npx cap open ios

# Or run directly
npx cap run ios
```

### Running on Android

```bash
# Add Android platform (first time only)
npx cap add android

# Open in Android Studio
npx cap open android

# Or run directly
npx cap run android
```

### Live Reload on Device

```bash
# Start dev server with external host
npx nx run mobile:serve --host=0.0.0.0

# Update capacitor.config.ts with your IP
# server: { url: 'http://192.168.1.x:4200' }

npx cap run ios --livereload
```

---

## Testing

### Unit Tests

```bash
npx nx run mobile:test
```

Tests use Jest with `jest-preset-angular`.

### Component Test Example

```typescript
describe('GardenPage', () => {
  let fixture: ComponentFixture<GardenPage>;
  let component: GardenPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## Native Features (Planned)

### Push Notifications

Daily reminders for practice completion:

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

// Request permission
await PushNotifications.requestPermissions();

// Schedule local notification
await PushNotifications.schedule({
  notifications: [{
    title: 'Time to Tend',
    body: 'Complete your morning practices',
    id: 1,
    schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 8) },
  }],
});
```

### Haptic Feedback

Satisfying feedback when logging practices:

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// On practice completion
await Haptics.impact({ style: ImpactStyle.Medium });
```

### Secure Storage

Store authentication tokens securely:

```typescript
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

await SecureStoragePlugin.set({ key: 'auth_token', value: token });
const { value } = await SecureStoragePlugin.get({ key: 'auth_token' });
```

---

## App Store Deployment

### iOS (App Store Connect)

1. Configure signing in Xcode
2. Archive the app: Product > Archive
3. Upload to App Store Connect
4. Submit for review

### Android (Google Play)

1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Complete store listing
4. Submit for review

See the [Deployment Guide](../deployment) for detailed instructions.
