import { Uuid } from '../shared/value-objects/Uuid';

export type BudgetType = 'personal' | 'shared';

export interface BudgetProps {
  id: Uuid;
  name: string;
  ownerId: Uuid;
  participantIds: Uuid[];
  type: BudgetType;
}

export class BudgetModel {
  private constructor(private props: BudgetProps) {}

  static create(props: BudgetProps): BudgetModel {
    if (!props.name?.trim()) throw new Error('Budget name is required');
    return new BudgetModel({
      ...props,
      participantIds: props.participantIds ?? [],
    });
  }

  get id(): Uuid {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  rename(name: string) {
    if (!name?.trim()) throw new Error('Budget name is required');
    this.props.name = name.trim();
  }
}
