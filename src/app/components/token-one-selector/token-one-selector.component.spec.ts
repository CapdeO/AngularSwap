import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenOneSelectorComponent } from './token-one-selector.component';

describe('TokenOneSelectorComponent', () => {
  let component: TokenOneSelectorComponent;
  let fixture: ComponentFixture<TokenOneSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenOneSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenOneSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
