import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStreamComponent } from './manage-stream.component';

describe('ManageStreamComponent', () => {
  let component: ManageStreamComponent;
  let fixture: ComponentFixture<ManageStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
