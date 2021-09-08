import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { toBase64String } from '@angular/compiler/src/output/source_map';


const SERVER_URL = "http://localhost:3000";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  private socket;
  messagecontent: string = "";
  messages: string[] = [];
  groups=[];
  groupslist:string="";
  groupnotice:string="";
  currentgroup:string="";
  isinGroup= false;
  newGroup:string="";
  numusers:number=0;

  constructor(private socketService:SocketService) { }

  ngOnInit() {
    this.socketService.initSocket();
    this.socketService.getMessage((m)=>{this.messages.push(m)});
    this.socketService.reqgroupList();
    this.socketService.getgroupList((msg)=>{this.groups = JSON.parse(msg)});
    this.socketService.notice((msg)=>{this.groupnotice = msg})
    this.socketService.joined((msg)=>{this.currentgroup = msg
      if(this.currentgroup != ""){
        this.isinGroup = true;
      } else {
        this.isinGroup = false;
      }
    });

  }

  join(){
    this.socketService.joingroup(this.groupslist);
    this.socketService.reqnumusers(this.groupslist);
    this.socketService.getnumusers((res)=>{this.numusers = res});
    
  }

  clearnotice(){
    this.groupnotice = "";
  }

  leavegroup(){
    this.socketService.leavegroup(this.currentgroup);
    this.socketService.reqnumusers(this.currentgroup);
    this.socketService.getnumusers((res)=>{this.numusers = res});
    this.groupslist = null;
    this.currentgroup = "";
    this.isinGroup = false;
    this.numusers = 0;
    this.groupnotice = ""
    this.messages = [];
  }
  
  creategroup(){
    console.log(this.creategroup)
    this.socketService.createGroup(this.newGroup);
    this.socketService.reqgroupList();
    this.socketService.getgroupList((msg)=>{this.groups = JSON.parse(msg)});
    this.newGroup = "";
    
  }

  chat(){
    if (this.messagecontent){
      console.log(this.messagecontent)
      this.socketService.sendMessage(this.messagecontent);
      this.messagecontent = null;
    } else {
      console.log('No Message')
    }
  }

}
