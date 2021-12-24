import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHomeTicketComponent } from './admin-home-ticket.component';

describe('AdminHomeTicketComponent', () => {
  let component: AdminHomeTicketComponent;
  let fixture: ComponentFixture<AdminHomeTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHomeTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHomeTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
