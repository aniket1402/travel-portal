import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotComponent } from './forgot/forgot.component';
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { AdminComponent } from './admin/admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminHomeTicketComponent } from './admin-home/admin-home-ticket.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SignupConfirmationComponent } from './signup/signup-confirmation.component';
import { EditUserComponent } from './signup/edit-user.component';
import { OrderModule } from 'ngx-order-pipe';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninGuard } from './signin/signin.guard';
import { AdminGuard } from './admin/admin.guard';
import { ChartsModule } from 'ng2-charts'

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    ForgotComponent,
    HomeComponent,
    AdminComponent,
    AdminHomeComponent,
    AdminHomeTicketComponent,
    SignupConfirmationComponent,
    EditUserComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'signin', component: SigninComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'admin/home', canActivate: [AdminGuard], component: AdminHomeComponent },
      { path: 'admin/home/ticket', canActivate: [AdminGuard], component: AdminHomeTicketComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'signup/confirm/:id', component: SignupConfirmationComponent },
      { path: 'edit-user/:id', component: EditUserComponent },
      { path: 'forgot', component: ForgotComponent },
      { path: 'home', canActivate: [SigninGuard], component: HomeComponent },
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: '**', redirectTo: 'signin', pathMatch: 'full' }
    ], {
      scrollPositionRestoration: 'enabled'
    }),
    HomeModule,
    NgxPaginationModule,
    OrderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
