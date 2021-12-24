import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestTicketService } from './request-ticket.service';
import { Ticket } from './ticket';
import { saveAs } from 'file-saver';
import { Comment } from './comment';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css', '../../assets/css/ticket-form.css', '../../assets/css/style.css', '../../assets/css/track.css', '../../assets/css/font-awesome.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class TicketDetailComponent implements OnInit {

  ticket = new Ticket();
  errorMessage: string = '';
  sub!: Subscription;
  ticketId!: string;
  startDate!: string;
  endDate!: string;
  username!: string;
  userId!: string;
  comment = new Comment();
  comments!: Comment[];
  uploadedFiles: Array<File> = [];
  employeeFiles: Array<File> = [];
  file!: File;
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
        const status = this.ticket.status;
        if (status === 'IN PROCESS') {
          document.getElementById("process")?.classList.add("active");
        } else if (status === 'APPROVED') {
          document.getElementById("process")?.classList.add("active");
          document.getElementById("approve")?.classList.add("active");
        } else if (status === 'RESUBMITTED') {
          document.getElementById("process")?.classList.remove("active");
          document.getElementById("approve")?.classList.remove("active");
          document.getElementById("resubmit")!.innerHTML = 'Re-Submitted';
        }
      },
      error: err => this.errorMessage = err
    });

    this.requestTicketService.getFiles(this.ticketId).subscribe({
      next: (data) => {
        this.uploadedFiles = data;
        console.log(this.uploadedFiles);
      },
      error: err => this.errorMessage = err
    })

    this.requestTicketService.getEmployeeFiles(this.ticketId).subscribe({
      next: (data) => {
        this.employeeFiles = data;
        console.log(this.employeeFiles);
      },
      error: err => this.errorMessage = err
    })

    this.requestTicketService.getComments(this.ticketId).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
        console.log(this.comments);
      },
      error: err => this.errorMessage = err
    })
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

  printTicket() {
    window.print();
  }

  editTicket() {
    this.router.navigate(['request-ticket-edit', this.ticketId]);
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    if (!this.file) {
      window.alert("Choose some file!");
      return;
    }
    var formData = new FormData();
    formData.append('file', this.file);
    this.requestTicketService.uploadFile(formData, this.ticketId).subscribe({
      next: (file: File) => {
        window.location.reload();
      },
      error: err => this.errorMessage = err
    })
  }

  deleteFile(file: any) {
    this.requestTicketService.deleteFile(file.id).subscribe({
      next: (file: any) => {
        window.location.reload();
      },
      error: err => this.errorMessage = err
    })
  }

  downloadFile(fileD: any) {
    const byteString = atob(fileD.fileByte);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const file = new Blob([int8Array], { type: fileD.type });
    saveAs(file, fileD.name);
  }

  returnToHome() {
    this.router.navigate(['home']);
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

}
