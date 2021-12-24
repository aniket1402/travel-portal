import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { countries } from '../shared/countries';
import { states } from '../shared/states';
import { SignupService } from './signup.service';
import { User } from './user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './signup.component.html',
  styleUrls: ['./edit-user.component.css', '../../assets/css/index.css', '../../assets/css/indexUtil.css', '../../assets/css/alert.css', '../../assets/css/authError.css']
})
export class EditUserComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  signUpForm!: FormGroup;
  user = new User();
  errorMessage: string = '';
  sub!: Subscription;
  error: boolean = false;
  userId!: string;

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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private signUpService: SignupService, private router: Router) {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {

    this.getUser();

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

  getUser() {
    this.sub = this.signUpService.getUser(parseInt(this.userId)).subscribe({
      next: (user: any) => {
        this.user = user;
        this.displayUser();
      },
      error: err => this.errorMessage = err
    });
  }

  displayUser(): void {
    if (this.signUpForm) {
      this.signUpForm.reset();
    }

    // Update the data on the form
    this.signUpForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      businessUnit: this.user.businessUnit,
      title: this.user.title,
      email: this.user.email,
      telephone: this.user.telephone,
      address1: this.user.address1,
      address2: this.user.address2,
      city: this.user.city,
      state: this.user.state,
      zip: this.user.zip,
      country: this.user.country,
    });
  }

  signup() {
    if (this.signUpForm.valid) {
      const u = { ...this.user, ...this.signUpForm.value };
      console.log(u);

      this.sub = this.signUpService.updateUserById(this.userId, u)
        .subscribe((res: any) => {
          console.log(res);
          this.router.navigate([`signup/confirm/${res.id}`])
        }, (err) => {
          this.error = true;
        });
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  closeError() {
    this.error = false;
  }

}
