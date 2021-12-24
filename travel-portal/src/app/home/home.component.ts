import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../assets/css/style.css', '../../assets/css/font-awesome.css', '../../assets/css/gallery.css', '../../assets/css/bootstrap.min.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class HomeComponent implements OnInit {

  username!: string;
  userId!: string;
  size: number = window.innerWidth;

  constructor(private router: Router) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.username = localStorage.getItem("username") || '';
    this.userId = localStorage.getItem("userId") || '';
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

}
