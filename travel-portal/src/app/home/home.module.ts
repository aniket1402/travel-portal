import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RequestTicketComponent } from '../request-ticket/request-ticket.component';
import { RequestTicketConfirmationComponent } from '../request-ticket/request-ticket-confirmation.component';
import { RequestTicketEditComponent } from '../request-ticket/request-ticket-edit.component';
import { MyTicketsComponent } from '../request-ticket/my-tickets.component';
import { TicketDetailComponent } from '../request-ticket/ticket-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { SigninGuard } from '../signin/signin.guard';
import { ContactComponent } from '../contact/contact.component';
import { ChartsModule } from 'ng2-charts'
import { CoronaComponent } from '../corona/corona.component';


@NgModule({
  declarations: [
    RequestTicketComponent,
    RequestTicketConfirmationComponent,
    RequestTicketEditComponent,
    MyTicketsComponent,
    TicketDetailComponent,
    ContactComponent,
    CoronaComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: 'request-ticket', canActivate: [SigninGuard], component: RequestTicketComponent },
      { path: 'request-ticket-confirm/:id', canActivate: [SigninGuard], component: RequestTicketConfirmationComponent },
      { path: 'request-ticket-edit/:id', canActivate: [SigninGuard], component: RequestTicketEditComponent },
      { path: 'ticket-detail/:id', canActivate: [SigninGuard], component: TicketDetailComponent },
      { path: 'myTickets/:id', canActivate: [SigninGuard], component: MyTicketsComponent },
      { path: 'contact', canActivate: [SigninGuard], component: ContactComponent },
      { path: 'corona', canActivate: [SigninGuard], component: CoronaComponent },
    ]),
    NgxPaginationModule,
    OrderModule,
    ChartsModule,
  ]
})
export class HomeModule { }
