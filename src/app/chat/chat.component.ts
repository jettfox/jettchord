import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { toBase64String } from '@angular/compiler/src/output/source_map';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  private socket;
  messagecontent: string = "";
  group = ""
  messages = [];
  channels=[];
  groups = [];
  channelslist = {name:"", group:this.group};
  channelnotice:string="";
  currentchannel= {name:"", group:this.group};
  isinChannel= false;
  newChannel = {name:"", group:this.group};
  numusers:number=0;
  allMessages = [];

  constructor(private socketService:SocketService) { }

  ngOnInit() {
    this.channelslist.group = this.group
    this.currentchannel.group = this.group
    this.newChannel.group = this.group
    this.socketService.initSocket();
    this.socketService.reqGroupList(sessionStorage.getItem("username"))
    this.socketService.getGroupList((res)=>{this.groups = res});
    this.socketService.reqchannelList(this.group);
    this.socketService.getchannelList((msg)=>{this.channels = msg});
    this.socketService.reqAllMessages(this.channelslist);
    this.socketService.getAllMessages((msg)=>{this.allMessages = msg});
    this.socketService.notice((msg)=>{this.channelnotice = msg})
    this.socketService.joined((msg)=>{this.currentchannel = msg
      if(this.currentchannel != {name:"", group:this.group}){
        this.isinChannel = true;
      } else {
        this.isinChannel = false;
      }
    });

  }

  join(channel){
    this.channelslist = channel
    this.channelslist.group = this.group
    this.socketService.joinchannel(this.channelslist);
    this.socketService.reqAllMessages(this.channelslist);
    this.socketService.getAllMessages((msg)=>{this.allMessages = msg});
    this.isinChannel= true;
    this.socketService.reqnumusers(this.channelslist);
    this.socketService.getnumusers((res)=>{this.numusers = res});
  }

  joingroup(group){
    this.group = group;
    this.channelslist.group = this.group
    this.currentchannel.group = this.group
    this.newChannel.group = this.group
    
    this.socketService.joingroup(group);
    this.socketService.reqchannelList(this.group);
  }

  clearnotice(){
    this.channelnotice = "";
  }

  leavechannel(){
    this.channelslist.group = this.group
    this.currentchannel.group = this.group
    this.newChannel.group = this.group
    this.socketService.leavechannel(this.currentchannel);
    this.socketService.reqAllMessages(this.channelslist);
    this.socketService.getAllMessages((msg)=>{this.allMessages = msg});
    this.socketService.reqnumusers(this.currentchannel);
    this.socketService.getnumusers((res)=>{this.numusers = res});
    this.channelslist = {name:"", group:this.group};
    this.currentchannel= {name:"", group:this.group};
    this.isinChannel = false;
    this.numusers = 0;
    this.channelnotice = ""
    this.messages = [];
    this.allMessages = []
  }
  
  createchannel(){
    this.channelslist.group = this.group
    this.currentchannel.group = this.group
    this.newChannel.group = this.group
    this.socketService.createChannel(this.newChannel);
    this.socketService.reqchannelList(this.group);
    this.socketService.getchannelList((msg)=>{this.channels = msg});
    this.newChannel = {name:"", group:this.group};
    
    
  }

  chat(){
    if (this.messagecontent){
      this.socketService.sendMessage({ "message": this.messagecontent, "user": sessionStorage.getItem("username"), "channel": this.currentchannel.name, "group": this.group});
      this.socketService.getMessage((m)=>{this.messages.push(m)});
      this.messagecontent = null;
    } else {
      console.log('No Message')
    }
    this.socketService.reqAllMessages(this.channelslist);
    this.socketService.getAllMessages((msg)=>{this.allMessages = msg});
  }

}
