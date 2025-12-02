import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { RecentAchievement } from '../../types/dashboard.types';
import { OsCardComponent } from '@shared/ui-components/molecules/os-card/os-card.component';
import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { LocaleService } from '@shared/formatting';

@Component({
  selector: 'os-recent-achievements-widget',
  standalone: true,
  imports: [CommonModule, OsCardComponent, OsIconComponent],
  template: `
    <div class="recent-achievements-widget" role="region" [attr.aria-labelledby]="'recent-achievements-title'">
      <header class="recent-achievements-widget__header">
        <h2 id="recent-achievements-title" class="recent-achievements-widget__title">Conquistas Recentes</h2>
      </header>

      @if (isLoading()) {
      <div class="recent-achievements-widget__loading" role="status" aria-live="polite">
        <div class="recent-achievements-widget__skeleton" aria-hidden="true">
          >
          @for (item of [1, 2, 3]; track item) {
          <div class="recent-achievements-widget__skeleton-item">
            <div class="recent-achievements-widget__skeleton-icon"></div>
            <div class="recent-achievements-widget__skeleton-content">
              <div class="recent-achievements-widget__skeleton-text"></div>
              <div class="recent-achievements-widget__skeleton-date"></div>
            </div>
          </div>
          }
        </div>
      </div>
      } @else if (isEmpty()) {
      <div class="recent-achievements-widget__empty" role="status">
        <os-icon name="emoji_events" size="lg" variant="default" aria-hidden="true" />
        <p class="recent-achievements-widget__empty-text">
          Continue trabalhando em suas metas para desbloquear conquistas!
        </p>
      </div>
      } @else {
      <div class="recent-achievements-widget__list" role="list">
        @for (achievement of displayedAchievements(); track achievement.id; let i = $index) {
        <os-card
          [variant]="'elevated'"
          [size]="'small'"
          [class]="'recent-achievements-widget__card recent-achievements-widget__card--' + achievement.type"
          [attr.aria-label]="achievement.message + '. Conquistado em ' + formatDate(achievement.date)"
          [attr.style.animation-delay]="i * 0.1 + 's'"
        >
          <div class="recent-achievements-widget__card-content">
            <os-icon
              [name]="achievement.icon"
              [size]="'md'"
              [variant]="'success'"
              [ariaHidden]="true"
            />
            <div class="recent-achievements-widget__card-text">
              <p class="recent-achievements-widget__card-message">{{ achievement.message }}</p>
              <span class="recent-achievements-widget__card-date">{{ formatDate(achievement.date) }}</span>
            </div>
          </div>
        </os-card>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./recent-achievements-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentAchievementsWidgetComponent {
  private readonly localeService = inject(LocaleService);

  readonly achievements = input<RecentAchievement[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly maxDisplayed = input<number>(5);

  readonly isEmpty = computed(() => !this.isLoading() && this.achievements().length === 0);
  readonly displayedAchievements = computed(() => {
    const achievements = this.achievements();
    return achievements.slice(0, this.maxDisplayed());
  });

  formatDate(date: Date): string {
    return this.localeService.formatDateShort(date);
  }
}
