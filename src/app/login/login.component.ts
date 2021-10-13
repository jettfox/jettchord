import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import{HttpClient, HttpErrorResponse} from '@angular/common/http';​
import * as e from 'cors';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  email = "";
  password = "";
  formData = {};
  user = {username:"", valid: ""};
  private socket;
  constructor(private http: HttpClient, private router: Router, private socketService:SocketService) { }

  ngOnInit(): void {
    
    
  }

  Submit() { 
    if (this.email != "" && this.password != ""){
      this.socketService.initSocket();
      this.socketService.login({email: this.email, password: this.password});
      console.log(this.user)
      
      this.socketService.confirm(
        (res)=>{this.user = res
            if (this.user.valid == "true"){
          
              if(typeof(Storage) !== 'undefined') {
                sessionStorage.setItem("username", this.user.username);
                this.router.navigateByUrl('/').then(() => {
                  window.location.reload();
                });
              }
            } else if(this.user.valid == "false") {
              alert("Wrong Details")
              this.email = "";
              this.password = "";
            }
        }
      );
      console.log(this.user)
      
        
    } else {
      console.log("no details")
    }
    
  }
  forgot(){
    alert("well, sucks to be you")
  }

}