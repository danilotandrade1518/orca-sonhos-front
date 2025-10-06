import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CreditCardsPageComponent } from './credit-cards-page.component';

describe('CreditCardsPageComponent', () => {
  let component: CreditCardsPageComponent;
  let fixture: ComponentFixture<CreditCardsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardsPageComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.page-header h1');
    expect(title?.textContent).toContain('Cartões de Crédito');
  });
});
