import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketDetail } from '../request-ticket/ticketDetail';
import { AdminHomeService } from './admin-home.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css', '../../assets/css/style.css', '../../assets/css/font-awesome.css', '../../assets/css/pagination.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css']
})
export class AdminHomeComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'priority', 'projectName', 'requestType', 'submittedDate', 'expenseBorneBy',
    'Name', 'travelCity', 'status'];
  dataSource!: MatTableDataSource<TicketDetail>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  errorMessage: string = '';
  sub!: Subscription;
  tickets: TicketDetail[] = [];
  unapprovedTickets: TicketDetail[] = [];
  submittedDates = new Array();

  page = 1;
  count = 0;
  pageSize = 5;

  constructor(private adminHomeService: AdminHomeService, private router: Router) {
    this.retrieveTickets();
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  retrieveTickets() {
    this.sub = this.adminHomeService.getTickets().subscribe(
      (tickets: TicketDetail[]) => {
        this.tickets = tickets;
        for (let i = 0; i < this.tickets.length; i++) {
          if (this.tickets[i].status !== 'APPROVED') {
            this.unapprovedTickets.push(this.tickets[i]);
          }
        }
        for (let i = 0; i < this.unapprovedTickets.length; i++) {
          let submittedDate = new Date(this.unapprovedTickets[i].submittedDate).toDateString() || new Date();
          this.submittedDates.push(submittedDate);
        }
      },
      (err: string) => this.errorMessage = err,
      () => {
        this.dataSource = new MatTableDataSource(this.unapprovedTickets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  scrollEvent = (event: any): void => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("header-scroll")!.style.backgroundColor = "black";
    } else {
      document.getElementById("header-scroll")!.style.backgroundColor = "rgba(250, 250, 250, 0.1)";
    }
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  getTicket(id: string) {
    console.log(id);
    localStorage.setItem("adminTicketID", id);
    const width = window.innerWidth;
    const height = window.innerHeight;
    var myWindow = window.open('admin/home/ticket', "myWindow", `width=${width},height=${height}`);
  }

  logout() {
    localStorage.removeItem("admin");
    this.router.navigate(['admin']);
  }
}