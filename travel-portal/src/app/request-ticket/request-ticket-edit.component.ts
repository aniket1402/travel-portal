import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { cities } from '../shared/cities';
import { RequestTicketService } from './request-ticket.service';
import { Ticket } from './ticket';

@Component({
  selector: 'app-request-ticket-edit',
  templateUrl: './request-ticket-edit.component.html',
  styleUrls: ['./request-ticket-edit.component.css', '../../assets/css/style.css', '../../assets/css/ticket-form.css', '../../assets/css/font-awesome.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css', '../../assets/css/error.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class RequestTicketEditComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  ticket = new Ticket();
  errorMessage: string = '';
  sub!: Subscription;
  ticketId!: string;
  startDate!: string;
  endDate!: string;
  ticketForm!: FormGroup;
  cities = cities;
  size: number = window.innerWidth;
  error: boolean = false;
  username!: string;
  isUpperBnd!: string;
  userId!: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private requestTicketService: RequestTicketService, private router: Router) {
    this.ticketId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);

    this.username = localStorage.getItem("username") || '';
    this.userId = localStorage.getItem("userId") || '';
    this.getTicket();

    this.ticketForm = this.fb.group({
      from: '',
      to: '',
      departureDate: ['', [Validators.required]],
      returnDate: ['', [Validators.required]],
      priority: '',
      passportNumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
      projectName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      expenseBy: ['', Validators.required],
      approverName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      expectedDuration: ['', [Validators.maxLength(100)]],
      isUpperBound: '',
      upperBoundAmt: ['', [Validators.maxLength(500)]],
      additionalDetails: ['', [Validators.maxLength(1000)]],
    })
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.ticketForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(500)
    ).subscribe(value => {
      const currentDate = new Date();
      let cDay = currentDate.getDate().toString();
      if (parseInt(cDay) < 10) {
        cDay = '0' + cDay;
      }
      let cMonth = (currentDate.getMonth() + 1).toString();
      if (parseInt(cMonth) < 10) {
        cMonth = '0' + cMonth;
      }
      const cYear = currentDate.getFullYear();
      const today = cYear + '-' + cMonth + '-' + cDay;
      var d1 = Date.parse(today);
      var d2 = Date.parse(this.ticketForm.get('returnDate')?.value);
      var d3 = Date.parse(this.ticketForm.get('departureDate')?.value);
      const diffTime = Math.abs(d2 - d3);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if ((d1 > d2) || (this.ticketForm.get('returnDate')?.value < this.ticketForm.get('departureDate')?.value)) {
        this.ticketForm.controls.returnDate.setErrors({ invalidReturnDate: true });
      }
      if (d1 > d3) {
        this.ticketForm.controls.departureDate.setErrors({ invalidDepartureDate: true });
      }
      if (diffDays < 7) {
        this.ticketForm.controls.returnDate.setErrors({ invalidDiffDate: true });
      }
    });
  }

  scrollEvent = (event: any): void => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("header-scroll")!.style.backgroundColor = "black";
    } else {
      document.getElementById("header-scroll")!.style.backgroundColor = "rgba(250, 250, 250, 0.1)";
    }
  }

  onResize(event: { target: { innerWidth: any; }; }) {
    this.size = event.target.innerWidth;
  }

  getTicket(): void {
    this.sub = this.requestTicketService.requestTickectById(parseInt(this.ticketId)).subscribe({
      next: (ticket: any) => {
        this.ticket = ticket;
        this.displayTicket();
      },
      error: err => this.errorMessage = err
    });
  }

  displayTicket(): void {
    if (this.ticketForm) {
      this.ticketForm.reset();
    }

    if (this.ticket.upperBoundOnAmt === 'No') {
      this.isUpperBnd = 'No';
    } else {
      this.isUpperBnd = 'Yes';
    }

    // Update the data on the form
    this.ticketForm.patchValue({
      from: this.ticket.locationCity,
      to: this.ticket.travelCity,
      departureDate: this.formatDate(this.ticket.startDate),
      returnDate: this.formatDate(this.ticket.endDate),
      priority: this.ticket.priority,
      passportNumber: this.ticket.passportNumber,
      projectName: this.ticket.projectName,
      expenseBy: this.ticket.expenseBorneBy,
      approverName: this.ticket.travelApproverName,
      expectedDuration: this.ticket.expectedDuration,
      isUpperBound: this.isUpperBnd,
      upperBoundAmt: this.ticket.upperBoundOnAmt,
      additionalDetails: this.ticket.additionalDetails,
    });
    let requestType = this.ticket.requestType;
    switch (requestType) {
      case 'Travel Ticket':
        requestType = 'travel-ticket';
        break;
      case 'Hotel Stay':
        requestType = 'hotel-stay';
        break;
      case 'Visa':
        requestType = 'visa';
        break;
      case 'Work Permit':
        requestType = 'work-permit';
        break;
    }
    document.getElementById(requestType)?.classList.add('active');
  }

  formatDate(date: Date): string {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  setRequestType(requestType: string) {
    this.ticket.requestType = requestType;
  }

  requestTicket() {

    if (this.ticketForm.valid) {
      if (this.ticket.status === 'APPROVED') {
        this.ticket.status = 'RE-SUBMITTED'
      }
      this.ticket.submittedDate = new Date();
      const t = { ...this.ticket, ...this.ticketForm.value };

      this.sub = this.requestTicketService.updateTicketById(this.ticketId, t)
        .subscribe((res: any) => {
          console.log(res);
          this.router.navigate([`request-ticket-confirm/${res.id}`])
        }, (err) => {
          this.error = true;
        });
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.ticketForm.reset();
    this.router.navigate([`request-ticket-confirm/${this.ticketId}`]);
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

}
