import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserMessage } from './contact';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', '../../assets/css/ticket-form.css', '../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.css', '../../assets/css/style.css', '../../assets/css/error.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class ContactComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  username!: string;
  userId!: string;
  contactForm!: FormGroup;
  msg = new UserMessage();
  size: number = window.innerWidth;

  constructor(private fb: FormBuilder, private contactService: ContactService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.username = localStorage.getItem("username") || '';
    this.userId = localStorage.getItem("userId") || '';

    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      subject: '',
      message: ['', [Validators.required]]
    })
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.contactForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      if (this.contactForm.get('email')?.value !== '' && !this.contactForm.get('email')?.valid) {
        this.contactForm.controls.email.setErrors({ invalidEmail: true });
      }
    });
  }

  sendMessage() {
    this.msg.name = this.contactForm.get('name')?.value;
    this.msg.email = this.contactForm.get('email')?.value;
    this.msg.subject = this.contactForm.get('subject')?.value;
    this.msg.message = this.contactForm.get('message')?.value;
    this.contactService.sendMesage(this.msg)
      .subscribe((res: any) => {
        console.log(res);
      }, (err: any) => {
        console.log(err);
      });
    this.contactForm.reset();
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

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

}
