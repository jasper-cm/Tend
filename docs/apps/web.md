---
layout: default
title: Web Application
nav_order: 6
parent: Apps
---

# Web Application

The Tend web application is built with Angular 18 using standalone components and TailwindCSS for styling.

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 18.x | Component framework |
| TailwindCSS | 3.x | Utility-first CSS |
| RxJS | 7.x | Reactive programming |
| Angular Router | 18.x | Client-side routing |

---

## Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── pages/                 # Route components
│   │   │   ├── garden/            # Life Garden dashboard
│   │   │   ├── life-areas/        # Life areas list
│   │   │   ├── life-area-detail/  # Single life area view
│   │   │   ├── practices/         # Practices list
│   │   │   ├── reflections/       # Journal entries
│   │   │   └── garden-guide/      # AI chat interface
│   │   ├── app.component.ts       # Root component
│   │   ├── app.config.ts          # App configuration
│   │   └── app.routes.ts          # Route definitions
│   ├── styles.scss                # Global styles
│   ├── index.html                 # HTML entry point
│   └── main.ts                    # Bootstrap
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.app.json              # TypeScript config
├── tsconfig.spec.json             # Test config
└── project.json                   # Nx project config
```

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `GardenComponent` | Life Garden dashboard |
| `/life-areas` | `LifeAreasComponent` | All life areas |
| `/life-areas/:id` | `LifeAreaDetailComponent` | Single life area |
| `/practices` | `PracticesComponent` | All practices |
| `/reflections` | `ReflectionsComponent` | Journal entries |
| `/garden-guide` | `GardenGuideComponent` | AI chat |

---

## Components

### Standalone Architecture

All components use Angular 18's standalone component pattern:

```typescript
@Component({
  selector: 'tend-garden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `...`,
})
export class GardenComponent {
  // Component logic
}
```

**Benefits:**
- No NgModule boilerplate
- Better tree-shaking
- Simpler imports
- Improved developer experience

### App Component

The root component provides the main layout:

```typescript
@Component({
  selector: 'tend-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-cream">
      <header class="bg-leaf-dark text-parchment p-4">
        <h1 class="text-2xl font-bold">Tend</h1>
        <p class="text-sage">Tend your life as the fruitful garden it is</p>
      </header>
      <nav class="bg-parchment border-b border-sage/30 p-4">
        <!-- Navigation links -->
      </nav>
      <main class="p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
```

### Garden Component (Dashboard)

The main dashboard showing all life areas with health scores:

```typescript
@Component({
  selector: 'tend-garden',
  standalone: true,
  imports: [CommonModule, LifeAreaCardComponent],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-soil">Your Life Garden</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        @for (area of lifeAreas; track area.id) {
          <tend-life-area-card
            [name]="area.name"
            [description]="area.description"
            [healthScore]="area.healthScore"
            [color]="area.color"
            [activePractices]="area.practices.length"
            (selected)="onAreaSelected(area)"
          />
        }
      </div>
    </div>
  `,
})
export class GardenComponent {
  lifeAreas: LifeArea[] = [];
}
```

---

## Styling

### TailwindCSS Configuration

The app uses a custom "garden" color palette defined in `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Earth tones
        soil: { DEFAULT: '#3d2e1f', light: '#5c4033' },
        bark: { DEFAULT: '#8b7355', light: '#a99276' },

        // Greens
        leaf: { DEFAULT: '#4a7c59', light: '#6b9e7a', dark: '#2f5738' },
        moss: '#7a8b5c',
        fern: '#5a7247',
        sage: '#87a878',

        // Accents
        bloom: '#c27ba0',
        water: '#6b9daa',
        sun: { DEFAULT: '#d4a843', light: '#e8c86a' },
        terracotta: '#c07850',

        // Backgrounds
        parchment: '#f5f0e8',
        cream: '#faf6ee',
      },
    },
  },
};
```

### Global Styles

Global styles are defined in `src/styles.scss`:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-soil: #3d2e1f;
  --color-leaf: #4a7c59;
  --color-cream: #faf6ee;
  // ... more CSS variables
}

body {
  background-color: var(--color-cream);
  color: var(--color-soil);
  font-family: system-ui, sans-serif;
}
```

### Design Principles

1. **Warm, earthy palette** - Colors inspired by nature and gardens
2. **Clean whitespace** - Generous padding and margins
3. **Accessible contrast** - WCAG AA compliant color combinations
4. **Responsive design** - Mobile-first with breakpoints for larger screens

---

## Shared UI Components

The web app uses components from the `@tend/ui` library:

### HealthBadgeComponent

Displays health scores with color-coded badges:

```typescript
import { HealthBadgeComponent } from '@tend/ui';

// Usage in template:
<tend-health-badge [score]="75" />

// Output: Green badge with "75" and appropriate styling
```

### StreakIndicatorComponent

Shows practice streak counts:

```typescript
<tend-streak-indicator [currentStreak]="5" [longestStreak]="12" />
```

### LifeAreaCardComponent

Card component for displaying life areas:

```typescript
<tend-life-area-card
  [name]="'Health'"
  [description]="'Physical well-being'"
  [healthScore]="75"
  [color]="'#c07850'"
  [activePractices]="3"
  (selected)="onSelect()"
/>
```

---

## State Management

The current implementation uses simple component state. For future scaling:

- **NgRx** - For complex state requirements
- **Signals** - Angular 18's reactive primitives
- **Services** - Injectable services with BehaviorSubject

---

## API Integration

HTTP calls are made using Angular's HttpClient:

```typescript
@Injectable({ providedIn: 'root' })
export class LifeAreasService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAll(): Observable<LifeArea[]> {
    return this.http.get<LifeArea[]>(`${this.baseUrl}/life-areas`);
  }

  getOne(id: string): Observable<LifeArea> {
    return this.http.get<LifeArea>(`${this.baseUrl}/life-areas/${id}`);
  }

  create(data: CreateLifeAreaDto): Observable<LifeArea> {
    return this.http.post<LifeArea>(`${this.baseUrl}/life-areas`, data);
  }
}
```

---

## Development

### Running Locally

```bash
npm run start:web
```

Opens at `http://localhost:4200` with hot reload.

### Building for Production

```bash
npx nx run web:build --configuration=production
```

Output is written to `dist/apps/web/`.

### Running Tests

```bash
npx nx run web:test
```

Tests use Jest with `jest-preset-angular`.

### Linting

```bash
npx nx run web:lint
```

---

## Testing

### Component Testing

```typescript
describe('GardenComponent', () => {
  let fixture: ComponentFixture<GardenComponent>;
  let component: GardenComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display life areas', () => {
    component.lifeAreas = [
      { id: '1', name: 'Health', healthScore: 75, ... }
    ];
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('tend-life-area-card');
    expect(cards.length).toBe(1);
  });
});
```

---

## Environment Configuration

### Development

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

### Production

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.tend.app/api',
};
```
