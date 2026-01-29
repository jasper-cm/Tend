import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tend-life-area-detail',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-soil">Life Area Detail</h2>
      <p class="text-bark">Viewing life area: {{ lifeAreaId }}</p>
      <!-- TODO: Fetch and display life area details, associated practices, and reflections -->
    </div>
  `,
})
export class LifeAreaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  lifeAreaId = '';

  ngOnInit(): void {
    this.lifeAreaId = this.route.snapshot.paramMap.get('id') ?? '';
  }
}
