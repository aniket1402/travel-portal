import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestTicketService } from './request-ticket.service';
import { TicketDetail } from './ticketDetail';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css', '../../assets/css/style.css', '../../assets/css/font-awesome.css', '../../assets/css/pagination.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class MyTicketsComponent implements OnInit {

  errorMessage: string = '';
  sub!: Subscription;
  tickets: TicketDetail[] = [];
  username!: string;
  submittedDates = new Array();
  userId!: string;

  page = 1;
  count = 0;
  pageSize = 5;
  size: number = window.innerWidth;

  constructor(private requestTicketService: RequestTicketService, private router: Router) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.username = localStorage.getItem("username") || '';
    this.userId = localStorage.getItem("userId") || '';
    this.retrieveTickets();
  }

  retrieveTickets() {
    const userId = JSON.parse(localStorage.getItem("user")!).id;
    this.sub = this.requestTicketService.getTicketsByUserId(userId).subscribe({
      next: (tickets: TicketDetail[]) => {
        this.tickets = tickets;
        for (let i = 0; i < tickets.length; i++) {
          let submittedDate = new Date(tickets[i].submittedDate).toDateString();
          console.log(submittedDate);
          this.submittedDates.push(submittedDate);
        }
        console.log(this.tickets);
      },
      error: (err: string) => this.errorMessage = err
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

  handlePageChange(event: number): void {
    this.page = event;
  }

  getTicket(id: string) {
    console.log(id);
    const width = window.innerWidth;
    const height = window.innerHeight;
    var myWindow = window.open(`ticket-detail/${id}`, "myWindow", `width=${width},height=${height}`);
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

}
