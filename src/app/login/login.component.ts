import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import{HttpClient, HttpErrorResponse} from '@angular/common/http';​

interface User {
  username:string;
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
  
  constructor(private http: HttpClient, private router: Router) { }

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
                this.router.navigateByUrl('/').then(() => {
                  window.location.reload();
                });
        }},
        (err: HttpErrorResponse) => {
        console.log(err.error);
        });
  }

  

  forgot(){
    alert("well, sucks to be you")
  }

}