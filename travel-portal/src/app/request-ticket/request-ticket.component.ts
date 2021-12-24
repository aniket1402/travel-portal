import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RequestTicketService } from './request-ticket.service';
import { Ticket } from './ticket';
import { cities } from '../shared/cities';

@Component({
  selector: 'app-request-ticket',
  templateUrl: './request-ticket.component.html',
  styleUrls: ['./request-ticket.component.css', '../../assets/css/style.css', '../../assets/css/ticket-form.css', '../../assets/css/font-awesome.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css', '../../assets/css/error.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class RequestTicketComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  ticketForm!: FormGroup;
  cities = cities;
  ticket = new Ticket();
  sub!: Subscription;
  error: boolean = false;
  username!: string;
  userId!: string;
  size: number = window.innerWidth;

  constructor(private fb: FormBuilder, private requestTicketService: RequestTicketService, private router: Router) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);

    console.log(cities);

    this.username = localStorage.getItem("username") || '';
    this.userId = localStorage.getItem("userId") || '';

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

    this.ticketForm.patchValue({
      from: 'Delhi',
      to: 'Mumbai',
      priority: 'Normal',
      expenseBy: 'Company',
      isUpperBound: 'No',
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

  setRequestType(requestType: string) {
    this.ticketForm.reset();
    this.ticketForm.patchValue({
      from: 'Delhi',
      to: 'Mumbai',
      priority: 'Normal',
      expenseBy: 'Company',
      isUpperBound: 'No',
    })
    this.ticket.requestType = requestType;
  }

  requestTicket() {
    if (this.ticket.requestType === '') {
      this.ticket.requestType = 'Travel Ticket';
    }
    this.ticket.locationCity = this.ticketForm.get('from')?.value;
    this.ticket.travelCity = this.ticketForm.get('to')?.value;
    this.ticket.startDate = this.ticketForm.get('departureDate')?.value
    this.ticket.endDate = this.ticketForm.get('returnDate')?.value;
    this.ticket.priority = this.ticketForm.get('priority')?.value;
    if (this.ticket.priority === '') {
      this.ticket.priority = 'Normal';
    }
    this.ticket.passportNumber = this.ticketForm.get('passportNumber')?.value;
    this.ticket.projectName = this.ticketForm.get('projectName')?.value;
    this.ticket.expenseBorneBy = this.ticketForm.get('expenseBy')?.value;
    this.ticket.travelApproverName = this.ticketForm.get('approverName')?.value;
    var date = new Date();
    console.log(date);
    this.ticket.submittedDate = date;
    this.ticket.expectedDuration = this.ticketForm.get('expectedDuration')?.value;
    if (this.ticket.expectedDuration === '' || this.ticket.expectedDuration === null) {
      this.ticket.expectedDuration = '-';
    }
    this.ticket.upperBoundOnAmt = this.ticketForm.get('upperBoundAmt')?.value;
    if (this.ticket.upperBoundOnAmt === '' || this.ticket.upperBoundOnAmt === null) {
      this.ticket.upperBoundOnAmt = 'No';
    }
    this.ticket.additionalDetails = this.ticketForm.get('additionalDetails')?.value;
    if (this.ticket.additionalDetails === '' || this.ticket.additionalDetails === null) {
      this.ticket.additionalDetails = 'No'
    }
    this.ticket.user = JSON.parse(localStorage.getItem('user')!);
    console.log(this.ticket);

    this.sub = this.requestTicketService.requestTicket(this.ticket)
      .subscribe((res: any) => {
        console.log(res);
        this.router.navigate([`request-ticket-confirm/${res.id}`])
      }, (err) => {
        this.error = true;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

}
