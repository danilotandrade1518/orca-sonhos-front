import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';

export type OsDataTableSize = 'small' | 'medium' | 'large';
export type OsDataTableVariant = 'default' | 'striped' | 'bordered';

export interface OsDataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export type OsDataTableRow = Record<string, unknown>;

export interface OsDataTableAction {
  key: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'warn';
}

@Component({
  selector: 'os-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    OsButtonComponent,
    OsIconComponent,
  ],
  template: `
    <div class="os-data-table" [class]="dataTableClasses()">
      @if (title()) {
      <div class="os-data-table__header">
        <h3 class="os-data-table__title">{{ title() }}</h3>
        @if (showActions() && actions().length > 0) {
        <div class="os-data-table__actions">
          @for (action of actions(); track action.key) {
          <os-button
            [variant]="getButtonVariant(action.color)"
            [size]="getButtonSize()"
            [icon]="action.icon || ''"
            (buttonClick)="onActionClick(action)"
            [attr.aria-label]="action.label"
          >
            {{ action.label }}
          </os-button>
          }
        </div>
        }
      </div>
      }

      <div class="os-data-table__content">
        <table mat-table [dataSource]="data()" matSort class="os-data-table__table">
          @for (column of columns(); track column.key) {
          <ng-container [matColumnDef]="column.key">
            <th
              mat-header-cell
              *matHeaderCellDef
              [class]="headerCellClass(column)"
              [style.width]="column.width || 'auto'"
              [style.text-align]="column.align || 'left'"
              [mat-sort-header]="column.sortable ? column.key : ''"
            >
              {{ column.label }}
            </th>
            <td
              mat-cell
              *matCellDef="let row"
              [class]="cellClass(column)"
              [style.text-align]="column.align || 'left'"
            >
              {{ getCellValue(row, column.key) }}
            </td>
          </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns()"
            [class]="rowClass(row)"
            (click)="onRowClick(row)"
          ></tr>
        </table>

        @if (showNoData() && data().length === 0) {
        <div class="os-data-table__no-data">
          <os-icon name="inbox" size="lg" />
          <p>{{ noDataText() }}</p>
        </div>
        }
      </div>

      @if (showPagination() && data().length > 0) {
      <mat-paginator
        [length]="totalItems()"
        [pageSize]="pageSize()"
        [pageIndex]="pageIndex()"
        [pageSizeOptions]="pageSizeOptions()"
        [showFirstLastButtons]="showFirstLastButtons()"
        (page)="onPageChange($event)"
        class="os-data-table__paginator"
      ></mat-paginator>
      }
    </div>
  `,
  styleUrl: './os-data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-data-table-host',
  },
})
export class OsDataTableComponent {
  data = input<OsDataTableRow[]>([]);
  columns = input<OsDataTableColumn[]>([]);
  title = input<string>('');
  actions = input<OsDataTableAction[]>([]);
  size = input<OsDataTableSize>('medium');
  variant = input<OsDataTableVariant>('default');
  sortable = input<boolean>(true);
  sortActive = input<string>('');
  sortDirection = input<'asc' | 'desc'>('asc');
  showActions = input<boolean>(true);
  showPagination = input<boolean>(true);
  showNoData = input<boolean>(true);
  noDataText = input<string>('Nenhum dado encontrado');
  pageSize = input<number>(10);
  pageIndex = input<number>(0);
  totalItems = input<number>(0);
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);
  showFirstLastButtons = input<boolean>(true);

  rowClick = output<OsDataTableRow>();
  actionClick = output<OsDataTableAction>();
  sortChange = output<Sort>();
  pageChange = output<PageEvent>();

  protected sort = true;

  displayedColumns = computed(() => this.columns().map((col) => col.key));
  
  protected getButtonVariant = (color?: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'tertiary' | 'danger'> = {
      primary: 'primary',
      secondary: 'secondary',
      warn: 'danger',
    };
    return colorMap[color || 'primary'] || 'primary';
  };

  protected getButtonSize = () => {
    const sizeMap: Record<OsDataTableSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  };

  dataTableClasses = () => {
    const classes = ['os-data-table'];

    if (this.size() !== 'medium') {
      classes.push(`os-data-table--${this.size()}`);
    }

    if (this.variant() !== 'default') {
      classes.push(`os-data-table--${this.variant()}`);
    }

    return classes.join(' ');
  };

  headerCellClass = (column: OsDataTableColumn) => {
    const classes = ['os-data-table__header-cell'];

    if (column.sortable) {
      classes.push('os-data-table__header-cell--sortable');
    }

    return classes.join(' ');
  };

  cellClass = (column: OsDataTableColumn) => {
    const classes = ['os-data-table__cell'];

    if (column.align) {
      classes.push(`os-data-table__cell--${column.align}`);
    }

    return classes.join(' ');
  };

  rowClass = (row: OsDataTableRow) => {
    const classes = ['os-data-table__row'];

    if (this.variant() === 'striped') {
      const index = this.data().indexOf(row);
      if (index % 2 === 1) {
        classes.push('os-data-table__row--striped');
      }
    }

    return classes.join(' ');
  };

  getCellValue = (row: OsDataTableRow, key: string) => {
    return row[key] || '';
  };

  onRowClick(row: OsDataTableRow): void {
    this.rowClick.emit(row);
  }

  onActionClick(action: OsDataTableAction): void {
    this.actionClick.emit(action);
  }

  onSortChange(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
