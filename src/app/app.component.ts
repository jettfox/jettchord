import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jettchord';
  loggedIn = false;
  username = ""
  ngOnInit(): void {
    if(sessionStorage.length != 0){
      this.username = sessionStorage.getItem("username")
      this.loggedIn = true
    }
  }

  logout() {
    sessionStorage.removeItem("username");
    this.loggedIn = false;
  }
}
