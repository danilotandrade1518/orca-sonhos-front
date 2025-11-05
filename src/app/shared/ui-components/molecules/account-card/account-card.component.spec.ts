import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountCardComponent } from './account-card.component';
import { AccountDto, AccountType } from '@dtos/account';

describe('AccountCardComponent', () => {
  let component: AccountCardComponent;
  let fixture: ComponentFixture<AccountCardComponent>;

  const mockAccount: AccountDto = {
    id: '1',
    name: 'Conta Corrente',
    type: 'CHECKING_ACCOUNT' as AccountType,
    balance: 1500.0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('account', mockAccount);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display account name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.os-account-card__name');
    expect(nameElement?.textContent?.trim()).toBe('Conta Corrente');
  });

  it('should display account balance', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const balanceElement = compiled.querySelector('os-money-display');
    expect(balanceElement).toBeTruthy();
  });

  it('should emit edit event when edit button is clicked', () => {
    fixture.componentRef.setInput('actions', { edit: true, delete: false });
    fixture.detectChanges();

    spyOn(component.edit, 'emit');
    component.onEdit();

    expect(component.edit.emit).toHaveBeenCalledWith(mockAccount);
  });

  it('should emit delete event when delete button is clicked', () => {
    fixture.componentRef.setInput('actions', { edit: false, delete: true });
    fixture.detectChanges();

    spyOn(component.delete, 'emit');
    component.onDelete();

    expect(component.delete.emit).toHaveBeenCalledWith(mockAccount);
  });

  it('should not show actions when actions input is undefined', () => {
    fixture.componentRef.setInput('actions', undefined);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const actionsElement = compiled.querySelector('.os-account-card__actions');
    expect(actionsElement).toBeFalsy();
  });

  it('should show edit button when actions.edit is true', () => {
    fixture.componentRef.setInput('actions', { edit: true, delete: false });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const editButton = compiled.querySelector('os-button[variant="tertiary"]');
    expect(editButton).toBeTruthy();
  });

  it('should show delete button when actions.delete is true', () => {
    fixture.componentRef.setInput('actions', { edit: false, delete: true });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('os-button[variant="danger"]');
    expect(deleteButton).toBeTruthy();
  });

  it('should generate correct aria-label', () => {
    const ariaLabel = component.ariaLabelText();
    expect(ariaLabel).toContain('Conta Corrente');
    expect(ariaLabel).toContain('CHECKING_ACCOUNT');
    expect(ariaLabel).toContain('R$');
  });
});
