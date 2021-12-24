import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoronaService } from './corona.service';
import { countries } from '../shared/countries';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.css', '../../assets/css/style.css', '../../assets/css/ticket-form.css', '../../assets/css/font-awesome.css', '../../assets/css/bootstrap.min.css', '../../assets/css/bootstrap5.min.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class CoronaComponent implements OnInit {

  countries = countries;

  hasCountry = false;
  selectedCountry = '';
  displayGraph = false;
  travelsData!: string;
  travelsDataPretty!: string[];
  isActive = 0;

  recovered!: number;
  confirmed!: number;
  deaths!: number;

  username!: string;
  userId!: string;

  chartOptions = {
    responsive: true
  };
  chartData: any = [];
  chartLabels: any = [];
  size: number = window.innerWidth;

  constructor(private coronaService: CoronaService, private router: Router) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.username = localStorage.getItem("username") || '';
    this.userId = localStorage.getItem("userId") || '';
  }

  getCountry(event: Event) {
    this.hasCountry = true;
    this.selectedCountry = (event.target as HTMLInputElement).value;
    console.log(this.selectedCountry);
  }

  displayData(show: boolean) {
    this.displayGraph = show;
  }

  checkTravel() {
    this.coronaService.getTravelStats().subscribe(
      (data: any) => {
        let travelData = [];
        travelData = data.data;
        console.log(travelData.length);
        for (let i = 0; i < travelData.length; i++) {
          if (travelData[i].location === this.selectedCountry) {
            this.travelsData = travelData[i].data;
            break;
          }
        }
        this.travelsDataPretty = this.travelsData.split("\n");
        // this.travelsData = this.travelsData.replace("\n", "<br>");
        console.log(typeof this.travelsData);
      },
      (err: string) => console.log(err),
    )
  }

  onResize(event: { target: { innerWidth: any; }; }) {
    this.size = event.target.innerWidth;
  }

  checkStats() {
    this.checkTravel();
    this.coronaService.getCoronaStats().subscribe(
      (data: any) => {
        let coronaData = [];
        coronaData = data[this.selectedCountry];
        let requiredKeys = [];
        if (coronaData === undefined || coronaData === null || coronaData.length === 0) {
          this.displayData(false);
          this.isActive = 1;
        } else {
          let totalRecovered = [];
          let totalDeaths = [];
          let totalConfirmed = [];
          this.isActive = 0;
          let dataLength = coronaData.length;
          if (dataLength < 30) {
            dataLength = 30;
          }
          for (let i = dataLength - 30; i < coronaData.length; i++) {
            // console.log(coronaData[i]);
            requiredKeys.push(coronaData[i]["date"]);
            totalConfirmed.push(coronaData[i]["confirmed"]);
            totalDeaths.push(coronaData[i]["deaths"]);
            totalRecovered.push(coronaData[i]["recovered"]);
          }
          this.recovered = coronaData[dataLength - 1]["recovered"];
          this.confirmed = coronaData[dataLength - 1]["confirmed"];
          this.deaths = coronaData[dataLength - 1]["deaths"];
          this.chartData = [];
          this.chartData.push({ "data": totalDeaths, "label": 'Deaths' });
          this.chartData.push({ "data": totalRecovered, "label": 'Recoverd' });
          this.chartData.push({ "data": totalConfirmed, "label": 'Confirmed' });
          console.log(this.chartData);
          this.chartLabels = requiredKeys;
          this.displayData(true);
        }
      },
      (err: string) => console.log(err),
    );
  }

  scrollEvent = (event: any): void => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("header-scroll")!.style.backgroundColor = "black";
    } else {
      document.getElementById("header-scroll")!.style.backgroundColor = "rgba(250, 250, 250, 0.1)";
    }
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

}
