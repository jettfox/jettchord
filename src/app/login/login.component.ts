import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import{HttpClient, HttpErrorResponse} from '@angular/common/http';​

interface User {
  username:string;
  email:string;
  age:string;
  birthdate:string;
  valid:boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  url:string = 'http://localhost:3000/api/auth';
  email:string = "";
  password:string = "";
  formData = {};
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  Submit() { 
    this.formData = {
        email: this.email,
        password: this.password
    }
    this.http.post<User>(this.url, this.formData).subscribe(
        res  => {
            if(typeof(Storage) !== 'undefined') {
                sessionStorage.setItem("username", res.username);
                sessionStorage.setItem("birthdate", res.birthdate);
                sessionStorage.setItem("email", res.email);
                sessionStorage.setItem("age", res.age);
                console.log(sessionStorage);
        }},
        (err: HttpErrorResponse) => {
        console.log(err.error);
        });
  }

  logout() {
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("birthdate");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("age");
      console.log(sessionStorage);
  }

  forgot(){
    alert("well, sucks to be you")
  }

}