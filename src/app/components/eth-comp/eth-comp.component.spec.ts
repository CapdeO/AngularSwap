import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthCompComponent } from './eth-comp.component';

describe('EthCompComponent', () => {
  let component: EthCompComponent;
  let fixture: ComponentFixture<EthCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
