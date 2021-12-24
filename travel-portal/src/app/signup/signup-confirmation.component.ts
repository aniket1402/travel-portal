import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../signup/user';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup-confirmation',
  templateUrl: './signup-confirmation.component.html',
  styleUrls: ['./signup-confirmation.component.css', '../../assets/css/ticket-form.css', '../../assets/css/style.css', '../../assets/css/font-awesome.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css']
})
export class SignupConfirmationComponent implements OnInit {

  userId!: string;
  sub!: Subscription;
  user = new User();
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private signupService: SignupService, private router: Router) {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.sub = this.signupService.getUser(parseInt(this.userId)).subscribe({
      next: (user: any) => {
        this.user = user;
      },
      error: err => this.errorMessage = err
    });
  }

  printUser() {
    window.print();
  }

  editUser() {
    this.router.navigate(['edit-user', this.userId]);
  }

  returnToLogIn() {
    this.router.navigate(['signin']);
  }

}
