import { TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;
    const initialState = component.isSidebarOpen;
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBe(!initialState);
  });
});
