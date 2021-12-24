import { TestBed } from '@angular/core/testing';

import { RequestTicketService } from './request-ticket.service';

describe('RequestTicketService', () => {
  let service: RequestTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
