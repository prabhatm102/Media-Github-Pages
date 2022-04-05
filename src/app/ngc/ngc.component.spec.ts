import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NGCComponent } from './ngc.component';

describe('NGCComponent', () => {
  let component: NGCComponent;
  let fixture: ComponentFixture<NGCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NGCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NGCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
