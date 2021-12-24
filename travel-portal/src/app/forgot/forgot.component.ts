import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ForgotService } from './forgot.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css', '../../assets/css/index.css', '../../assets/css/indexUtil.css', '../../assets/css/font-awesome.css', '../../assets/css/alert.css', '../../assets/css/authError.css']
})
export class ForgotComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  forgotForm!: FormGroup;
  username: string = '';
  errorMessage: string = '';
  sub!: Subscription;
  error: boolean = false;

  constructor(private fb: FormBuilder, private forgotService: ForgotService, private router: Router) { }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      username: ['', [Validators.required]],
    })
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.forgotForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      if (this.forgotForm.get('username')?.value !== '' && !this.forgotForm.get('username')?.valid) {
        console.log('yaha');
        this.forgotForm.controls.username.setErrors({ invalidUsername: true });
      }
    });
  }

  submit() {
    this.username = this.forgotForm.get('username')?.value;
    this.sub = this.forgotService.userAuth(this.username)
      .subscribe((res: any) => {
        console.log(res);
        if (res === null) {
          this.error = true;
        } else {
          this.router.navigate(['signin']);
        }
      }, (err) => {
        this.error = true;
      });

  }

  closeError() {
    this.error = false;
  }

}
