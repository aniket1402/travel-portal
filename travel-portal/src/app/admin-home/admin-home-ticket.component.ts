import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { RequestTicketService } from '../request-ticket/request-ticket.service';
import { Ticket } from '../request-ticket/ticket';
import { AdminHomeService } from './admin-home.service';
import { Comment } from './comment';
import { saveAs } from 'file-saver';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-admin-home-ticket',
  templateUrl: './admin-home-ticket.component.html',
  styleUrls: ['./admin-home-ticket.component.css', '../../assets/css/ticket-form.css', '../../assets/css/style.css', '../../assets/css/track.css', '../../assets/css/font-awesome.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css', '../../assets/css/error.css']
})
export class AdminHomeTicketComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  ticket = new Ticket();
  errorMessage: string = '';
  sub!: Subscription;
  ticketID!: string;
  startDate!: string;
  endDate!: string;
  addCommentForm!: FormGroup;
  comment = new Comment();
  comments!: Comment[];
  file!: File;
  uploadedFiles: Array<File> = [];
  employeeFiles: Array<File> = [];

  constructor(private fb: FormBuilder, private adminHomeService: AdminHomeService, private requestTicketService: RequestTicketService, private router: Router) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);

    this.ticketID = localStorage.getItem("adminTicketID") || '';

    this.sub = this.requestTicketService.requestTickectById(parseInt(this.ticketID)).subscribe({
      next: (ticket: any) => {
        this.ticket = ticket;
        console.log(this.ticket.startDate);
        this.startDate = new Date(this.ticket.startDate).toDateString();
        this.endDate = new Date(this.ticket.endDate).toDateString();
        console.log(new Date(this.ticket.startDate).toDateString());
        // this.username = localStorage.getItem('username') || '';
        // this.blogs = blogs;
        // this.filteredBlogs = this.blogs;
        const status = this.ticket.status;
        if (status === 'IN PROCESS') {
          document.getElementById("process")?.classList.add("active");
        } else if (status === 'APPROVED') {
          document.getElementById("process")?.classList.add("active");
          document.getElementById("approve")?.classList.add("active");
        } else if (status === 'RE-SUBMITTED') {
          document.getElementById("process")?.classList.remove("active");
          document.getElementById("approve")?.classList.remove("active");
          document.getElementById("resubmit")!.innerHTML = 'Re-Submitted';
        }
      },
      error: err => this.errorMessage = err
    });

    this.adminHomeService.getFiles(this.ticketID).subscribe({
      next: (data) => {
        this.uploadedFiles = data;
        console.log(this.uploadedFiles);
      }
    })

    this.adminHomeService.getEmployeeFiles(this.ticketID).subscribe({
      next: (data) => {
        this.employeeFiles = data;
        console.log(this.employeeFiles);
      }
    })

    this.adminHomeService.getComments(this.ticketID).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
      },
      error: err => this.errorMessage = err
    })

    this.addCommentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    })
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.addCommentForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      if (this.addCommentForm.get('email')?.value !== '' && !this.addCommentForm.get('email')?.valid) {
        this.addCommentForm.controls.email.setErrors({ invalidEmail: true });
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

  changeStatus(status: string): void {
    if (this.ticket.status === status) {
      window.alert('Ticket status is already: ' + status);
      return;
    }
    this.ticket.status = status;
    this.adminHomeService.updateTicket(this.ticketID, this.ticket).subscribe({
      next: (ticket: any) => {
        this.ticket = ticket;
        window.alert('Status is changed to ' + status);
        window.location.reload();
      },
      error: err => this.errorMessage = err
    })
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
    this.adminHomeService.uploadFile(formData, this.ticketID).subscribe({
      next: (file: File) => {
        window.location.reload();
      },
      error: err => this.errorMessage = err
    })
  }

  deleteFile(file: any) {
    this.adminHomeService.deleteFile(file.id).subscribe({
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

  formatDate(date: string): string {
    let a = date.split('.');
    let d = a[0].split('T');
    return d[0] + ", " + d[1];
  }

  postComment() {
    this.comment.name = this.addCommentForm.get('name')?.value;
    this.comment.email = this.addCommentForm.get('email')?.value;
    var d = new Date();
    this.comment.date = d.toLocaleString().split(',')[0];
    this.comment.message = this.addCommentForm.get('message')?.value;
    this.comment.ticketId = this.ticketID;
    this.adminHomeService.postComment(this.comment)
      .subscribe((res: any) => {
        console.log(res);
        location.reload();
      });
  }

  returnToHome() {
    this.router.navigate(['admin/home']);
  }

  logout() {
    localStorage.removeItem("admin");
    this.router.navigate(['admin']);
  }

}
