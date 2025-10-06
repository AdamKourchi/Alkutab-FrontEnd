import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleLiveSessionComponent } from './circle-live-session.component';

describe('CircleLiveSessionComponent', () => {
  let component: CircleLiveSessionComponent;
  let fixture: ComponentFixture<CircleLiveSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleLiveSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleLiveSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
