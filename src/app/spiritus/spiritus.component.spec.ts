import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpiritusComponent } from './spiritus.component';

describe('SpiritusComponent', () => {
  let component: SpiritusComponent;
  let fixture: ComponentFixture<SpiritusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpiritusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpiritusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
