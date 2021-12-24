import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Admin } from './admin';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../../assets/css/index.css', '../../assets/css/indexUtil.css', '../../assets/css/font-awesome.css', '../../assets/css/alert.css', '../../assets/css/authError.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  signInForm!: FormGroup;
  admin = new Admin();
  errorMessage: string = '';
  sub!: Subscription;
  error: boolean = false;

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.signInForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      if (this.signInForm.get('username')?.value !== '' && !this.signInForm.get('username')?.valid) {
        this.signInForm.controls.username.setErrors({ invalidUsername: true });
      }
    });
  }

  login() {
    this.admin.username = this.signInForm.get('username')?.value;
    this.admin.password = this.signInForm.get('password')?.value;
    this.sub = this.adminService.adminAuth(this.admin)
      .subscribe((res: Admin) => {
        console.log(res);
        if (res === null) {
          this.error = true;
        } else {
          localStorage.setItem("admin", JSON.stringify(res));
          this.router.navigate(['admin/home']);
        }
      }, (err) => {
        this.error = true;
      });
  }

  closeError() {
    this.error = false;
  }

}
