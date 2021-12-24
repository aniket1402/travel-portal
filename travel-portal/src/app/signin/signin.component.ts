import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SigninService } from './signin.service';
import { User } from './user';
import { UserDetails } from './userDetails';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css', '../../assets/css/index.css', '../../assets/css/indexUtil.css', '../../assets/css/font-awesome.css', '../../assets/css/alert.css', '../../assets/css/authError.css']
})
export class SigninComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  signInForm!: FormGroup;
  user = new User();
  errorMessage: string = '';
  sub!: Subscription;
  error: boolean = false;

  constructor(private fb: FormBuilder, private signInService: SigninService, private router: Router) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.signInForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      if (this.signInForm.get('username')?.value !== '' && !this.signInForm.get('username')?.valid) {
        this.signInForm.controls.username.setErrors({ invalidUsername: true });
      }
    });
  }

  login() {
    this.user.username = this.signInForm.get('username')?.value;
    this.user.password = this.signInForm.get('password')?.value;
    this.sub = this.signInService.userAuth(this.user)
      .subscribe((res: UserDetails) => {
        console.log(res);
        if (res === null) {
          this.error = true;
        } else {
          localStorage.setItem("user", JSON.stringify(res));
          localStorage.setItem("username", res.firstName);
          localStorage.setItem('userId', res.id.toString());
          this.router.navigate(['home']);
        }
      }, (err) => {
        this.error = true;
      });
  }

  closeError() {
    this.error = false;
  }

}
