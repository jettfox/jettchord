import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jettchord';
  loggedIn = false;
  ngOnInit(): void {
    if(sessionStorage.length != 0){
      this.loggedIn = true
    }
  }

  logout() {
    sessionStorage.removeItem("username");
    console.log(sessionStorage);
    this.loggedIn = false;
  }
}
