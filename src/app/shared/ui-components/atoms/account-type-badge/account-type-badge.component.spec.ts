import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountTypeBadgeComponent } from './account-type-badge.component';
import { AccountType } from '@dtos/account';

describe('AccountTypeBadgeComponent', () => {
  let component: AccountTypeBadgeComponent;
  let fixture: ComponentFixture<AccountTypeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTypeBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountTypeBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('type', 'CHECKING_ACCOUNT' as AccountType);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('iconName computed', () => {
    it('should return correct icon for CHECKING_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'CHECKING_ACCOUNT');
      fixture.detectChanges();
      expect(component.iconName()).toBe('account_balance');
    });

    it('should return correct icon for SAVINGS_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'SAVINGS_ACCOUNT');
      fixture.detectChanges();
      expect(component.iconName()).toBe('savings');
    });

    it('should return correct icon for PHYSICAL_WALLET', () => {
      fixture.componentRef.setInput('type', 'PHYSICAL_WALLET');
      fixture.detectChanges();
      expect(component.iconName()).toBe('account_balance_wallet');
    });

    it('should return correct icon for DIGITAL_WALLET', () => {
      fixture.componentRef.setInput('type', 'DIGITAL_WALLET');
      fixture.detectChanges();
      expect(component.iconName()).toBe('wallet');
    });

    it('should return correct icon for INVESTMENT_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'INVESTMENT_ACCOUNT');
      fixture.detectChanges();
      expect(component.iconName()).toBe('trending_up');
    });

    it('should return correct icon for OTHER', () => {
      fixture.componentRef.setInput('type', 'OTHER');
      fixture.detectChanges();
      expect(component.iconName()).toBe('credit_card');
    });
  });

  describe('badgeVariant computed', () => {
    it('should return primary variant for CHECKING_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'CHECKING_ACCOUNT');
      fixture.detectChanges();
      expect(component.badgeVariant()).toBe('primary');
    });

    it('should return success variant for SAVINGS_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'SAVINGS_ACCOUNT');
      fixture.detectChanges();
      expect(component.badgeVariant()).toBe('success');
    });

    it('should return warning variant for PHYSICAL_WALLET', () => {
      fixture.componentRef.setInput('type', 'PHYSICAL_WALLET');
      fixture.detectChanges();
      expect(component.badgeVariant()).toBe('warning');
    });

    it('should return secondary variant for DIGITAL_WALLET', () => {
      fixture.componentRef.setInput('type', 'DIGITAL_WALLET');
      fixture.detectChanges();
      expect(component.badgeVariant()).toBe('secondary');
    });

    it('should return info variant for INVESTMENT_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'INVESTMENT_ACCOUNT');
      fixture.detectChanges();
      expect(component.badgeVariant()).toBe('info');
    });

    it('should return default variant for OTHER', () => {
      fixture.componentRef.setInput('type', 'OTHER');
      fixture.detectChanges();
      expect(component.badgeVariant()).toBe('default');
    });
  });

  describe('ariaLabelText computed', () => {
    it('should return correct label for CHECKING_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'CHECKING_ACCOUNT');
      fixture.detectChanges();
      expect(component.ariaLabelText()).toBe('Tipo de conta: Conta Corrente');
    });

    it('should return correct label for SAVINGS_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'SAVINGS_ACCOUNT');
      fixture.detectChanges();
      expect(component.ariaLabelText()).toBe('Tipo de conta: Conta Poupança');
    });

    it('should return correct label for PHYSICAL_WALLET', () => {
      fixture.componentRef.setInput('type', 'PHYSICAL_WALLET');
      fixture.detectChanges();
      expect(component.ariaLabelText()).toBe('Tipo de conta: Carteira Física');
    });

    it('should return correct label for DIGITAL_WALLET', () => {
      fixture.componentRef.setInput('type', 'DIGITAL_WALLET');
      fixture.detectChanges();
      expect(component.ariaLabelText()).toBe('Tipo de conta: Carteira Digital');
    });

    it('should return correct label for INVESTMENT_ACCOUNT', () => {
      fixture.componentRef.setInput('type', 'INVESTMENT_ACCOUNT');
      fixture.detectChanges();
      expect(component.ariaLabelText()).toBe('Tipo de conta: Conta de Investimento');
    });

    it('should return correct label for OTHER', () => {
      fixture.componentRef.setInput('type', 'OTHER');
      fixture.detectChanges();
      expect(component.ariaLabelText()).toBe('Tipo de conta: Outro tipo de conta');
    });
  });
});
