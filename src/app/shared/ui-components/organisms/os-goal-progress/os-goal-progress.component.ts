import {
  Component,
  computed,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';

import { OsProgressBarComponent } from '../../atoms/os-progress-bar/os-progress-bar.component';
import {
  OsMoneyDisplayComponent,
  OsMoneyDisplayVariant,
} from '../../molecules/os-money-display/os-money-display.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export interface GoalProgressData {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: Date;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

export type GoalProgressVariant = 'default' | 'compact' | 'detailed' | 'minimal';
export type GoalProgressSize = 'small' | 'medium' | 'large';
export type GoalProgressTheme = 'light' | 'dark';
export type GoalProgressMilestone = 25 | 50 | 75 | 90 | 100;

@Component({
  selector: 'os-goal-progress',
  standalone: true,
  imports: [OsProgressBarComponent, OsMoneyDisplayComponent, OsIconComponent],
  template: `
    <div class="os-goal-progress" [class]="goalClasses()" [attr.aria-label]="ariaLabel()">
      <div class="os-goal-progress__header">
        @if (showIcon()) {
          <div class="os-goal-progress__icon">
            <os-icon [name]="iconName()" [size]="iconSize()" [attr.aria-hidden]="true" />
          </div>
        }
    
        <div class="os-goal-progress__title-section">
          <h3 class="os-goal-progress__title" [id]="titleId()">
            {{ goalData().title }}
          </h3>
          @if (goalData().description && showDescription()) {
            <p class="os-goal-progress__description" [id]="descriptionId()">
              {{ goalData().description }}
            </p>
          }
        </div>
    
        @if (showCategory() && goalData().category) {
          <div class="os-goal-progress__category">
            <span class="os-goal-progress__category-text">{{ goalData().category }}</span>
          </div>
        }
      </div>
    
      <div class="os-goal-progress__content">
        <div class="os-goal-progress__amounts">
          <div class="os-goal-progress__current">
            <os-money-display
              [value]="goalData().currentAmount"
              [currency]="goalData().currency"
              [variant]="currentAmountVariant()"
              [size]="amountSize()"
              />
            <span class="os-goal-progress__current-label">Arrecadado</span>
          </div>
    
          <div class="os-goal-progress__target">
            <os-money-display
              [value]="goalData().targetAmount"
              [currency]="goalData().currency"
              [variant]="targetAmountVariant()"
              [size]="amountSize()"
              />
            <span class="os-goal-progress__target-label">Meta</span>
          </div>
        </div>
    
        <div class="os-goal-progress__progress">
          <os-progress-bar
            [value]="progressPercentage()"
            [variant]="progressVariant()"
            [size]="progressSize()"
            [showPercentage]="showPercentage()"
            [animated]="animated()"
            [showCelebration]="shouldShowCelebration()"
            [celebrationText]="celebrationText()"
            />
    
          @if (shouldShowMilestone()) {
            <div class="os-goal-progress__milestone" [attr.aria-live]="'polite'">
              <os-icon name="celebration" size="sm" [attr.aria-hidden]="true" />
              <span class="os-goal-progress__milestone-text">
                {{ currentMilestone() }}% alcançado! 🎯
              </span>
            </div>
          }
        </div>
    
        @if (showStats()) {
          <div class="os-goal-progress__stats">
            <div class="os-goal-progress__stat">
              <span class="os-goal-progress__stat-label">Progresso</span>
              <span class="os-goal-progress__stat-value">{{ progressPercentage() }}%</span>
            </div>
    
            @if (remainingAmount() > 0) {
              <div class="os-goal-progress__stat">
                <span class="os-goal-progress__stat-label">Restante</span>
                <span class="os-goal-progress__stat-value">
                  <os-money-display
                    [value]="remainingAmount()"
                    [currency]="goalData().currency"
                    [variant]="'default'"
                    [size]="'small'"
                    />
                </span>
              </div>
              } @if (goalData().deadline && showDeadline()) {
              <div class="os-goal-progress__stat">
                <span class="os-goal-progress__stat-label">Prazo</span>
                <span class="os-goal-progress__stat-value">{{ formattedDeadline() }}</span>
              </div>
            }
          </div>
        }
      </div>
    
      @if (showActions() && actions().length > 0) {
        <div class="os-goal-progress__actions">
          <ng-content select="[slot=actions]" />
        </div>
        } @if (shouldShowCelebration()) {
        <div class="os-goal-progress__celebration" [attr.aria-live]="'assertive'">
          <div class="os-goal-progress__celebration-content">
            <os-icon name="celebration" size="lg" [attr.aria-hidden]="true" />
            <span class="os-goal-progress__celebration-text">{{ celebrationText() }}</span>
          </div>
          <div class="os-goal-progress__confetti">
            @for (piece of [1, 2, 3, 4, 5, 6, 7, 8]; track piece) {
              <div
                class="os-goal-progress__confetti-piece"
              ></div>
            }
          </div>
        </div>
      }
    </div>
    `,
  styleUrls: ['./os-goal-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"region"',
    '[attr.aria-labelledby]': 'titleId()',
  },
})
export class OsGoalProgressComponent {
  readonly goalData = input.required<GoalProgressData>();
  readonly variant = input<GoalProgressVariant>('default');
  readonly size = input<GoalProgressSize>('medium');
  readonly theme = input<GoalProgressTheme>('light');
  readonly showIcon = input(true);
  readonly showDescription = input(true);
  readonly showCategory = input(true);
  readonly showStats = input(true);
  readonly showPercentage = input(true);
  readonly showDeadline = input(true);
  readonly showActions = input(false);
  readonly animated = input(true);
  readonly actions = input<{ label: string; variant?: string; disabled?: boolean }[]>([]);
  readonly ariaLabel = input<string | null>(null);
  readonly showCelebration = input(true);
  readonly showMilestones = input(true);
  readonly celebrationText = input('Meta alcançada! 🎉');
  readonly enableHapticFeedback = input(false);

  readonly goalClick = output<GoalProgressData>();
  readonly actionClick = output<{
    action: { label: string; variant?: string; disabled?: boolean };
    goal: GoalProgressData;
  }>();
  readonly milestoneReached = output<{
    milestone: GoalProgressMilestone;
    goal: GoalProgressData;
  }>();
  readonly goalCompleted = output<GoalProgressData>();

  readonly titleId = signal(`goal-title-${Math.random().toString(36).substr(2, 9)}`);
  readonly descriptionId = signal(`goal-description-${Math.random().toString(36).substr(2, 9)}`);
  readonly isCelebrating = signal(false);
  readonly reachedMilestones = signal<Set<GoalProgressMilestone>>(new Set());

  readonly progressPercentage = computed(() => {
    const data = this.goalData();
    if (data.targetAmount <= 0) return 0;
    return Math.min(Math.round((data.currentAmount / data.targetAmount) * 100), 100);
  });

  readonly remainingAmount = computed(() => {
    const data = this.goalData();
    return Math.max(data.targetAmount - data.currentAmount, 0);
  });

  readonly isCompleted = computed(() => {
    return this.progressPercentage() >= 100;
  });

  readonly isOverdue = computed(() => {
    const data = this.goalData();
    if (!data.deadline) return false;
    return new Date() > data.deadline && !this.isCompleted();
  });

  readonly currentMilestone = computed((): GoalProgressMilestone | null => {
    const percentage = this.progressPercentage();
    if (percentage >= 100) return 100;
    if (percentage >= 90) return 90;
    if (percentage >= 75) return 75;
    if (percentage >= 50) return 50;
    if (percentage >= 25) return 25;
    return null;
  });

  readonly shouldShowCelebration = computed(() => {
    return this.showCelebration() && this.isCompleted() && !this.isCelebrating();
  });

  readonly shouldShowMilestone = computed(() => {
    if (!this.showMilestones()) return false;
    const current = this.currentMilestone();
    const reached = this.reachedMilestones();
    return current !== null && !reached.has(current);
  });

  readonly goalClasses = computed(() => {
    const classes = ['os-goal-progress'];
    classes.push(`os-goal-progress--${this.variant()}`);
    classes.push(`os-goal-progress--${this.size()}`);

    if (this.theme() === 'dark') {
      classes.push('os-goal-progress--dark');
    }

    if (this.isCompleted()) {
      classes.push('os-goal-progress--completed');
    }

    if (this.isOverdue()) {
      classes.push('os-goal-progress--overdue');
    }

    if (this.goalData().priority) {
      classes.push(`os-goal-progress--priority-${this.goalData().priority}`);
    }

    return classes.join(' ');
  });

  readonly iconName = computed(() => {
    if (this.isCompleted()) return 'check-circle';
    if (this.isOverdue()) return 'alert-circle';
    return 'target';
  });

  readonly iconSize = computed(() => {
    const sizeMap: Record<string, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  readonly progressVariant = computed(() => {
    if (this.isCompleted()) return 'success';
    if (this.isOverdue()) return 'danger';
    if (this.goalData().priority === 'high') return 'warning';
    return 'primary';
  });

  readonly progressSize = computed(() => {
    const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  });

  readonly currentAmountVariant = computed((): OsMoneyDisplayVariant => {
    if (this.isCompleted()) return 'success';
    if (this.isOverdue()) return 'error';
    return 'default';
  });

  readonly targetAmountVariant = computed((): OsMoneyDisplayVariant => {
    return 'default';
  });

  readonly amountSize = computed(() => {
    const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  });

  readonly formattedDeadline = computed(() => {
    const deadline = this.goalData().deadline;
    if (!deadline) return '';

    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencido';
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays <= 7) return `${diffDays} dias`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semanas`;
    return `${Math.ceil(diffDays / 30)} meses`;
  });

  constructor() {
    effect(() => {
      const currentMilestone = this.currentMilestone();
      const reachedMilestones = this.reachedMilestones();
      const shouldShowMilestone = this.shouldShowMilestone();
      const shouldShowCelebration = this.shouldShowCelebration();

      if (shouldShowMilestone && currentMilestone !== null) {
        const newReached = new Set(reachedMilestones);
        newReached.add(currentMilestone);
        this.reachedMilestones.set(newReached);

        this.milestoneReached.emit({
          milestone: currentMilestone,
          goal: this.goalData(),
        });

        if (this.enableHapticFeedback() && 'vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }

      if (shouldShowCelebration) {
        this.isCelebrating.set(true);
        this.goalCompleted.emit(this.goalData());

        if (this.enableHapticFeedback() && 'vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }

        setTimeout(() => {
          this.isCelebrating.set(false);
        }, 3000);
      }
    });
  }

  onGoalClick(): void {
    this.goalClick.emit(this.goalData());
  }

  onActionClick(action: { label: string; variant?: string; disabled?: boolean }): void {
    this.actionClick.emit({ action, goal: this.goalData() });
  }
}
