import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketEditComponent } from './request-ticket-edit.component';

describe('RequestTicketEditComponent', () => {
  let component: RequestTicketEditComponent;
  let fixture: ComponentFixture<RequestTicketEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTicketEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTicketEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
