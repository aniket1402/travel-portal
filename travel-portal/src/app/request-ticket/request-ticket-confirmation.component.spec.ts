import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketConfirmationComponent } from './request-ticket-confirmation.component';

describe('RequestTicketConfirmationComponent', () => {
  let component: RequestTicketConfirmationComponent;
  let fixture: ComponentFixture<RequestTicketConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTicketConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTicketConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
