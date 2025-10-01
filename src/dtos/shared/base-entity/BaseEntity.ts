import { DateString } from '../date-string/DateString';

export interface BaseEntityDto {
  readonly id: string;
  readonly createdAt: DateString;
  readonly updatedAt: DateString;
}

export class BaseEntityHelper {
  static isValid(entity: unknown): entity is BaseEntityDto {
    if (typeof entity !== 'object' || entity === null) {
      return false;
    }

    const baseEntity = entity as Record<string, unknown>;

    return (
      typeof baseEntity['id'] === 'string' &&
      baseEntity['id'].length > 0 &&
      typeof baseEntity['createdAt'] === 'string' &&
      typeof baseEntity['updatedAt'] === 'string' &&
      this.isValidDateString(baseEntity['createdAt']) &&
      this.isValidDateString(baseEntity['updatedAt'])
    );
  }

  static isValidUuid(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  private static isValidDateString(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString() === dateString;
  }

  static isSameEntity(a: BaseEntityDto, b: BaseEntityDto): boolean {
    return a.id === b.id;
  }

  static compareByCreatedAt(a: BaseEntityDto, b: BaseEntityDto): number {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  }

  static compareByUpdatedAt(a: BaseEntityDto, b: BaseEntityDto): number {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  }

  static wasCreatedAfter(entity: BaseEntityDto, date: DateString): boolean {
    return new Date(entity.createdAt) > new Date(date);
  }

  static wasUpdatedAfter(entity: BaseEntityDto, date: DateString): boolean {
    return new Date(entity.updatedAt) > new Date(date);
  }

  static getAge(entity: BaseEntityDto): number {
    return Date.now() - new Date(entity.createdAt).getTime();
  }

  static getTimeSinceUpdate(entity: BaseEntityDto): number {
    return Date.now() - new Date(entity.updatedAt).getTime();
  }
}
