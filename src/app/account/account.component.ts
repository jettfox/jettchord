import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private socketService:SocketService) { }
  isAdmin = false
  haveUsers = false
  haveGroups = false
  haveRoles = false
  users = []
  groups = []
  username = null
  roles = {group: "", users: []}
  ngOnInit(): void {
    this.socketService.initSocket();
    if(sessionStorage.length != 0){
      this.username = sessionStorage.getItem("username")
    }
    this.onLoad()
  }

  onLoad(){
    if (this.username !=null){
      this.socketService.reqIsAdmin(this.username);
      this.socketService.getIsAdmin(
        (res)=>{this.isAdmin = res
        if (this.isAdmin == true){
          
          this.socketService.reqUsers();
          this.socketService.getUsers((res)=>{this.users = res
            this.haveUsers = true})
          
          this.socketService.reqAllGroups();
          this.socketService.getAllGroups((res)=>{this.groups = res
            this.haveGroups = true})
          
          this.socketService.reqRoles();
          this.socketService.getRoles((res)=>{this.roles = res
            this.haveRoles = true})
        }})

    }
  }

  add(alluser, rolegroup){
    this.socketService.reqAddRole({user: alluser, group: rolegroup});
    this.socketService.reqRoles();
    this.socketService.getRoles((res)=>{this.roles = res
      this.haveRoles = true})

  }

}
