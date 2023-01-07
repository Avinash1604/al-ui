import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiIntegratorComponent } from './ai-integrator.component';

describe('AiIntegratorComponent', () => {
  let component: AiIntegratorComponent;
  let fixture: ComponentFixture<AiIntegratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiIntegratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiIntegratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
