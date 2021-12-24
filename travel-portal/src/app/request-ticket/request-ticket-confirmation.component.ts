import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestTicketService } from './request-ticket.service';
import { Ticket } from './ticket';

@Component({
  selector: 'app-request-ticket-confirmation',
  templateUrl: './request-ticket-confirmation.component.html',
  styleUrls: ['./request-ticket-confirmation.component.css', '../../assets/css/ticket-form.css', '../../assets/css/style.css', '../../assets/css/font-awesome.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class RequestTicketConfirmationComponent implements OnInit {

  ticket = new Ticket();
  errorMessage: string = '';
  sub!: Subscription;
  ticketId!: string;
  startDate!: string;
  endDate!: string;
  username!: string;
  userId!: string;
  size: number = window.innerWidth;

  constructor(private route: ActivatedRoute, private requestTicketService: RequestTicketService, private router: Router) {
    this.ticketId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scrollEvent, true);

    this.username = localStorage.getItem("username") || '';
    this.userId = localStorage.getItem("userId") || '';
    this.sub = this.requestTicketService.requestTickectById(parseInt(this.ticketId)).subscribe({
      next: (ticket: any) => {
        this.ticket = ticket;
        this.startDate = new Date(this.ticket.startDate).toDateString();
        this.endDate = new Date(this.ticket.endDate).toDateString();
        console.log(new Date(this.ticket.startDate).toDateString());
      },
      error: err => this.errorMessage = err
    });
  }

  scrollEvent = (event: any): void => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("header-scroll")!.style.backgroundColor = "black";
    } else {
      document.getElementById("header-scroll")!.style.backgroundColor = "rgba(250, 250, 250, 0.1)";
    }
  }

  printTicket() {
    window.print();
  }

  editTicket() {
    this.router.navigate(['request-ticket-edit', this.ticketId]);
  }

  returnToHome() {
    this.router.navigate(['home']);
  }

  onResize(event: { target: { innerWidth: any; }; }) {
    this.size = event.target.innerWidth;
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

}
