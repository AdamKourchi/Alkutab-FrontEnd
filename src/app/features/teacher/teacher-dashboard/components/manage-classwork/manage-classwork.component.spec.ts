import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClassworkComponent } from './manage-classwork.component';

describe('ManageClassworkComponent', () => {
  let component: ManageClassworkComponent;
  let fixture: ComponentFixture<ManageClassworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClassworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClassworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
