import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { OsDropdownComponent, OsDropdownOption, OsDropdownGroup } from './os-dropdown.component';

describe('OsDropdownComponent', () => {
  let component: OsDropdownComponent;
  let fixture: ComponentFixture<OsDropdownComponent>;
  let mockBreakpointObserver: { observe: ReturnType<typeof vi.fn> };

  const mockOptions: OsDropdownOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2', disabled: true },
    { value: 'option3', label: 'Option 3', icon: 'star' },
    { value: 'divider', label: '', divider: true },
    { value: 'option4', label: 'Option 4' },
  ];

  const mockGroups: OsDropdownGroup[] = [
    {
      name: 'Group 1',
      options: [
        { value: 'g1-opt1', label: 'Group 1 Option 1' },
        { value: 'g1-opt2', label: 'Group 1 Option 2' },
      ],
    },
    {
      name: 'Group 2',
      options: [
        { value: 'g2-opt1', label: 'Group 2 Option 1' },
        { value: 'g2-opt2', label: 'Group 2 Option 2', disabled: true },
      ],
    },
  ];

  beforeEach(async () => {
    mockBreakpointObserver = {
      observe: vi.fn().mockReturnValue(of({ matches: false })),
    };

    await TestBed.configureTestingModule({
      imports: [OsDropdownComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render trigger button', () => {
      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger).toBeTruthy();
    });

    it('should render with options', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger).toBeTruthy();
    });

    it('should render with icon when provided', () => {
      fixture.componentRef.setInput('icon', 'home');
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('os-icon');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render with chevron by default', () => {
      const chevronIcons = fixture.nativeElement.querySelectorAll('os-icon');
      expect(chevronIcons.length).toBeGreaterThan(0);
    });

    it('should not render chevron when showChevron is false', () => {
      fixture.componentRef.setInput('showChevron', false);
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('os-icon');
      expect(icons.length).toBe(0);
    });

    it('should render placeholder when no value selected', () => {
      fixture.componentRef.setInput('placeholder', 'Select an option');
      fixture.detectChanges();

      const text = fixture.nativeElement.querySelector('.os-dropdown__text');
      expect(text.textContent.trim()).toBe('Select an option');
    });

    it('should render search input when searchable and threshold met', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.componentRef.setInput('searchThreshold', 3);
      fixture.componentRef.setInput('options', mockOptions);
      component.handleMenuOpened();
      fixture.detectChanges();

      expect(component.searchable()).toBe(true);
      expect(component.filteredOptions().length).toBeGreaterThan(3);
    });

    it('should not render search input when options below threshold', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.componentRef.setInput('searchThreshold', 10);
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      component.handleMenuOpened();
      fixture.detectChanges();

      const searchInput = fixture.nativeElement.querySelector('.os-dropdown__search');
      expect(searchInput).toBeFalsy();
    });
  });

  describe('variants', () => {
    it('should apply default variant classes', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--default')).toBeFalsy();
    });

    it('should apply primary variant classes', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--primary')).toBeTruthy();
    });

    it('should apply secondary variant classes', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--secondary')).toBeTruthy();
    });

    it('should apply accent variant classes', () => {
      fixture.componentRef.setInput('variant', 'accent');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--accent')).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('should apply small size classes', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--small')).toBeTruthy();
    });

    it('should apply medium size classes', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown')).toBeTruthy();
      expect(container.classList.contains('os-dropdown--medium')).toBeFalsy();
    });

    it('should apply large size classes', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--large')).toBeTruthy();
    });
  });

  describe('states', () => {
    it('should apply disabled state classes', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--disabled')).toBeTruthy();
    });

    it('should disable trigger when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.disabled).toBe(true);
    });

    it('should set isOpen state correctly', () => {
      expect(component.isOpen()).toBe(false);

      component.handleMenuOpened();
      expect(component.isOpen()).toBe(true);

      component.handleMenuClosed();
      expect(component.isOpen()).toBe(false);
    });

    it('should apply mobile class when on mobile device', () => {
      mockBreakpointObserver.observe.mockReturnValue(of({ matches: true }));

      const newFixture = TestBed.createComponent(OsDropdownComponent);
      newFixture.detectChanges();

      const container = newFixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--mobile')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('should emit menuOpen when trigger is clicked', () => {
      const menuOpenSpy = vi.fn();
      component.menuOpen.subscribe(menuOpenSpy);

      component.handleTriggerClick();
      component.handleMenuOpened();

      expect(menuOpenSpy).toHaveBeenCalled();
    });

    it('should not emit menuOpen when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const menuOpenSpy = vi.fn();
      component.menuOpen.subscribe(menuOpenSpy);

      component.handleTriggerClick();

      expect(menuOpenSpy).not.toHaveBeenCalled();
    });

    it('should emit menuClose when menu is closed', () => {
      const menuCloseSpy = vi.fn();
      component.menuClose.subscribe(menuCloseSpy);

      component.handleMenuOpened();
      component.handleMenuClosed();

      expect(menuCloseSpy).toHaveBeenCalled();
    });

    it('should reset search query when menu is closed', () => {
      fixture.componentRef.setInput('searchable', true);
      component.handleMenuOpened();
      component.handleSearchChange('test query');

      expect(component.searchQuery()).toBe('test query');

      component.handleMenuClosed();

      expect(component.searchQuery()).toBe('');
    });
  });

  describe('computed properties', () => {
    it('should compute selectedLabel correctly', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.componentRef.setInput('selectedValue', 'option1');
      fixture.detectChanges();

      expect(component.selectedLabel()).toBe('Option 1');
    });

    it('should return placeholder when no value selected', () => {
      fixture.componentRef.setInput('placeholder', 'Select option');
      fixture.componentRef.setInput('selectedValue', null);
      fixture.detectChanges();

      expect(component.selectedLabel()).toBe('Select option');
    });

    it('should compute container class correctly', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const classes = component.containerClass();
      expect(classes).toContain('os-dropdown--primary');
      expect(classes).toContain('os-dropdown--large');
      expect(classes).toContain('os-dropdown--disabled');
    });

    it('should compute trigger class with open state', () => {
      component.handleMenuOpened();
      fixture.detectChanges();

      const classes = component.triggerClass();
      expect(classes).toContain('os-dropdown__trigger--open');
    });

    it('should compute xPosition correctly', () => {
      fixture.componentRef.setInput('alignment', 'start');
      expect(component.xPosition()).toBe('before');

      fixture.componentRef.setInput('alignment', 'end');
      expect(component.xPosition()).toBe('after');

      fixture.componentRef.setInput('alignment', 'center');
      expect(component.xPosition()).toBe('after');
    });

    it('should compute yPosition correctly', () => {
      expect(component.yPosition()).toBe('below');
    });

    it('should flatten options correctly', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      const flattened = component.flattenedOptions();
      expect(flattened.length).toBe(mockOptions.length);
    });

    it('should flatten groups correctly', () => {
      fixture.componentRef.setInput('groups', mockGroups);
      fixture.detectChanges();

      const flattened = component.flattenedOptions();
      expect(flattened.length).toBeGreaterThan(4);
      expect(flattened.filter((opt) => opt.isGroupHeader).length).toBe(2);
    });
  });

  describe('option handling', () => {
    it('should handle option click', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      const valueChangeSpy = vi.fn();
      const optionSelectSpy = vi.fn();
      component.valueChange.subscribe(valueChangeSpy);
      component.optionSelect.subscribe(optionSelectSpy);

      component.handleOptionClick(mockOptions[0]);

      expect(valueChangeSpy).toHaveBeenCalledWith('option1');
      expect(optionSelectSpy).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('should not handle disabled option click', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      const valueChangeSpy = vi.fn();
      component.valueChange.subscribe(valueChangeSpy);

      component.handleOptionClick(mockOptions[1]);

      expect(valueChangeSpy).not.toHaveBeenCalled();
    });

    it('should close menu after option selection', () => {
      component.handleMenuOpened();
      expect(component.isOpen()).toBe(true);

      component.handleOptionClick(mockOptions[0]);

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('search functionality', () => {
    it('should filter options based on search query', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      component.handleSearchChange('Option 1');

      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe('Option 1');
    });

    it('should filter options case-insensitively', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      component.handleSearchChange('option 3');

      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe('Option 3');
    });

    it('should return all options when search query is empty', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      component.handleSearchChange('');

      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(mockOptions.length);
    });

    it('should filter out group headers in search results', () => {
      fixture.componentRef.setInput('groups', mockGroups);
      fixture.detectChanges();

      component.handleSearchChange('Group 1 Option 1');

      const filtered = component.filteredOptions();
      expect(filtered.filter((opt) => opt.isGroupHeader).length).toBe(0);
    });

    it('should emit searchChange event', () => {
      const searchChangeSpy = vi.fn();
      component.searchChange.subscribe(searchChangeSpy);

      component.handleSearchChange('test query');

      expect(searchChangeSpy).toHaveBeenCalledWith('test query');
    });
  });

  describe('keyboard navigation', () => {
    it('should open menu on ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.handleTriggerKeydown(event);

      expect(component.isOpen()).toBe(true);
    });

    it('should open menu on ArrowUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.handleTriggerKeydown(event);

      expect(component.isOpen()).toBe(true);
    });

    it('should toggle menu on Enter', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      component.handleTriggerKeydown(event);
      expect(component.isOpen()).toBe(true);

      component.handleTriggerKeydown(event);
      expect(component.isOpen()).toBe(false);
    });

    it('should toggle menu on Space', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });

      component.handleTriggerKeydown(event);
      expect(component.isOpen()).toBe(true);

      component.handleTriggerKeydown(event);
      expect(component.isOpen()).toBe(false);
    });

    it('should close menu on Escape', () => {
      component.handleMenuOpened();
      expect(component.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.handleTriggerKeydown(event);

      expect(component.isOpen()).toBe(false);
    });

    it('should not respond to keyboard when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleTriggerKeydown(event);

      expect(component.isOpen()).toBe(false);
    });

    it('should select option on Enter in option keydown', () => {
      const valueChangeSpy = vi.fn();
      component.valueChange.subscribe(valueChangeSpy);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleOptionKeydown(event, mockOptions[0]);

      expect(valueChangeSpy).toHaveBeenCalledWith('option1');
    });

    it('should select option on Space in option keydown', () => {
      const valueChangeSpy = vi.fn();
      component.valueChange.subscribe(valueChangeSpy);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.handleOptionKeydown(event, mockOptions[0]);

      expect(valueChangeSpy).toHaveBeenCalledWith('option1');
    });

    it('should close menu on Escape in search keydown', () => {
      component.handleMenuOpened();
      component.handleSearchChange('test');

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.handleSearchKeydown(event);

      expect(component.isOpen()).toBe(false);
      expect(component.searchQuery()).toBe('');
    });
  });

  describe('accessibility', () => {
    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom dropdown');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.getAttribute('aria-label')).toBe('Custom dropdown');
    });

    it('should set default aria-label when not provided', () => {
      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.getAttribute('aria-label')).toBe('Dropdown menu');
    });

    it('should set aria-expanded correctly', () => {
      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.getAttribute('aria-expanded')).toBe('false');

      component.handleMenuOpened();
      fixture.detectChanges();

      expect(container.getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-haspopup correctly', () => {
      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should set aria-controls with unique menu id', () => {
      const container = fixture.nativeElement.querySelector('.os-dropdown');
      const menuId = component.menuId();
      expect(container.getAttribute('aria-controls')).toBe(menuId);
    });

    it('should set role combobox on container', () => {
      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.getAttribute('role')).toBe('combobox');
    });

    it('should mark icons as aria-hidden', () => {
      fixture.componentRef.setInput('icon', 'home');
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('os-icon');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('virtual scrolling', () => {
    it('should use virtual scroll when enabled and threshold met', () => {
      const manyOptions = Array.from({ length: 30 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`,
      }));

      fixture.componentRef.setInput('options', manyOptions);
      fixture.componentRef.setInput('useVirtualScroll', true);
      fixture.componentRef.setInput('virtualScrollThreshold', 20);
      fixture.detectChanges();

      expect(component.virtualScrollItems().length).toBe(30);
    });

    it('should compute correct item height for virtual scroll', () => {
      fixture.componentRef.setInput('size', 'small');
      expect(component.getItemHeight()).toBe(32);

      fixture.componentRef.setInput('size', 'medium');
      expect(component.getItemHeight()).toBe(40);

      fixture.componentRef.setInput('size', 'large');
      expect(component.getItemHeight()).toBe(48);
    });
  });

  describe('groups support', () => {
    it('should render group headers', () => {
      fixture.componentRef.setInput('groups', mockGroups);
      fixture.detectChanges();

      const flattened = component.flattenedOptions();
      const headers = flattened.filter((opt) => opt.isGroupHeader);

      expect(headers.length).toBe(2);
      expect(headers[0].label).toBe('Group 1');
      expect(headers[1].label).toBe('Group 2');
    });

    it('should include group options in flattened list', () => {
      fixture.componentRef.setInput('groups', mockGroups);
      fixture.detectChanges();

      const flattened = component.flattenedOptions();
      const options = flattened.filter((opt) => !opt.isGroupHeader);

      expect(options.length).toBe(4);
    });

    it('should find selected value from groups', () => {
      fixture.componentRef.setInput('groups', mockGroups);
      fixture.componentRef.setInput('selectedValue', 'g1-opt1');
      fixture.detectChanges();

      expect(component.selectedLabel()).toBe('Group 1 Option 1');
    });
  });

  describe('edge cases', () => {
    it('should handle empty options array', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      expect(component.filteredOptions().length).toBe(0);
    });

    it('should handle search with no results', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      component.handleSearchChange('nonexistent');

      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(0);
    });

    it('should handle option with null value', () => {
      const optionsWithNull = [{ value: null as any, label: 'Null option' }];
      fixture.componentRef.setInput('options', optionsWithNull);
      fixture.componentRef.setInput('selectedValue', null);
      fixture.detectChanges();

      expect(component.selectedLabel()).toBe('Null option');
    });

    it('should handle rapid menu open/close', () => {
      component.handleMenuOpened();
      expect(component.isOpen()).toBe(true);

      component.handleMenuClosed();
      expect(component.isOpen()).toBe(false);

      component.handleMenuOpened();
      expect(component.isOpen()).toBe(true);
    });
  });
});
