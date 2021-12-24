import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { countries } from '../shared/countries';
import { states } from '../shared/states';
import { SignupService } from './signup.service';
import { User } from './user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../../assets/css/index.css', '../../assets/css/indexUtil.css', '../../assets/css/alert.css', '../../assets/css/authError.css']
})
export class SignupComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  signUpForm!: FormGroup;
  user = new User();
  errorMessage: string = '';
  sub!: Subscription;
  error: boolean = false;

  countries = countries;
  states = states;
  titles = [
    "Associate",
    "Associate Lead",
    "Associate Lead, Technology",
    "Associate Staff Engineer",
    "Associate Technical Lead",
    "Junior Associate",
    "Project Manager",
    "Senior Associate",
    "Senior Engineer",
    "Senior Software Engineer",
    "Software Developer",
    "Software Engineer",
    "Staff Engineer",
    "Technical Lead",
    "Trainee",
  ]

  constructor(private fb: FormBuilder, private signUpService: SignupService, private router: Router) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required]],
      businessUnit: ['', [Validators.required]],
      title: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telephone: ['', [Validators.required, Validators.maxLength(15)]],
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['', [Validators.required]],
    })
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.signUpForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      if (this.signUpForm.get('firstName')?.value !== '' && this.signUpForm.get('firstName')?.value.length >= 3 && !this.signUpForm.get('firstName')?.valid) {
        this.signUpForm.controls.firstName.setErrors({ invalidFirstName: true });
      }
      if (this.signUpForm.get('lastName')?.value !== '' && !this.signUpForm.get('lastName')?.valid) {
        this.signUpForm.controls.lastName.setErrors({ invalidLastName: true });
      }
      if (this.signUpForm.get('email')?.value !== '' && !this.signUpForm.get('email')?.valid) {
        this.signUpForm.controls.email.setErrors({ invalidEmail: true });
      }
    });
  }

  signup() {
    this.user.firstName = this.signUpForm.get('firstName')?.value;
    this.user.lastName = this.signUpForm.get('lastName')?.value;
    this.user.businessUnit = this.signUpForm.get('businessUnit')?.value;
    this.user.title = this.signUpForm.get('title')?.value;
    this.user.email = this.signUpForm.get('email')?.value;
    this.user.telephone = this.signUpForm.get('telephone')?.value;
    this.user.address1 = this.signUpForm.get('address1')?.value;
    this.user.address2 = this.signUpForm.get('address2')?.value;
    this.user.city = this.signUpForm.get('city')?.value;
    this.user.state = this.signUpForm.get('state')?.value;
    this.user.zip = this.signUpForm.get('zip')?.value;
    this.user.country = this.signUpForm.get('country')?.value;
    console.log(this.user);
    this.sub = this.signUpService.createUser(this.user)
      .subscribe((res: any) => {
        if (res === null) {
          this.error = true;
          window.scrollTo(0, 0);
        } else {
          this.router.navigate(['signup/confirm', res.id]);
        }
      }, (err) => {
        this.error = true;
      });
  }

  closeError() {
    this.error = false;
  }

}
