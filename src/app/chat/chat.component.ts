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
  channels=[];
  channelslist:string="";
  channelnotice:string="";
  currentchannel:string="";
  isinChannel= false;
  newChannel:string="";
  numusers:number=0;

  constructor(private socketService:SocketService) { }

  ngOnInit() {
    console.log(sessionStorage);
    this.socketService.initSocket();
    this.socketService.getMessage((m)=>{this.messages.push(m)});
    this.socketService.reqchannelList();
    this.socketService.getchannelList((msg)=>{this.channels = JSON.parse(msg)});
    this.socketService.notice((msg)=>{this.channelnotice = msg})
    this.socketService.joined((msg)=>{this.currentchannel = msg
      if(this.currentchannel != ""){
        this.isinChannel = true;
      } else {
        this.isinChannel = false;
      }
    });

  }

  join(){
     
    this.socketService.joinchannel(this.channelslist);
    this.socketService.reqnumusers(this.channelslist);
    this.socketService.getnumusers((res)=>{this.numusers = res});
    console.log("this.channelslist", this.channelslist, "this.numusers", this.numusers)
    
  }

  clearnotice(){
    this.channelnotice = "";
  }

  leavechannel(){
    this.socketService.leavechannel(this.currentchannel);
    this.socketService.reqnumusers(this.currentchannel);
    this.socketService.getnumusers((res)=>{this.numusers = res});
    this.channelslist = null;
    this.currentchannel = "";
    this.isinChannel = false;
    this.numusers = 0;
    this.channelnotice = ""
    this.messages = [];
  }
  
  createchannel(){
    console.log(this.createchannel)
    this.socketService.createChannel(this.newChannel);
    this.socketService.reqchannelList();
    this.socketService.getchannelList((msg)=>{this.channels = JSON.parse(msg)});
    this.newChannel = "";
    
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
