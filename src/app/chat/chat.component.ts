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
  messages = [];
  channels=[];
  channelslist = {name:"", group:"Group1"};
  channelnotice:string="";
  currentchannel= {name:"", group:"Group1"};
  isinChannel= false;
  newChannel = {name:"", group:"Group1"};
  numusers:number=0;
  allMessages = [];

  constructor(private socketService:SocketService) { }

  ngOnInit() {
    this.socketService.initSocket();
    this.socketService.getMessage((m)=>{this.messages.push(m)});
    console.log("new messages", this.messages)
    this.socketService.reqchannelList();
    this.socketService.getchannelList((msg)=>{this.channels = msg});
    this.socketService.reqAllMessages(this.channelslist);
    console.log(this.channelslist)
    this.socketService.getAllMessages((msg)=>{this.allMessages = msg});
    console.log(this.allMessages)
    this.socketService.notice((msg)=>{this.channelnotice = msg})
    this.socketService.joined((msg)=>{this.currentchannel = msg
      if(this.currentchannel != {name:"", group:"Group1"}){
        console.log("true")
        this.isinChannel = true;
      } else {
        this.isinChannel = false;
        console.log("false")
      }
    });
    console.log("current channel",this.currentchannel)

  }

  join(channel){
    this.channelslist = channel
    this.socketService.joinchannel(this.channelslist);
    this.socketService.reqAllMessages(this.channelslist);
    this.socketService.getAllMessages((msg)=>{this.allMessages = msg});
    this.socketService.reqnumusers(this.channelslist);
    this.socketService.getnumusers((res)=>{this.numusers = res});
  }

  clearnotice(){
    this.channelnotice = "";
  }

  leavechannel(){
    this.socketService.leavechannel(this.currentchannel);
    this.socketService.reqAllMessages(this.channelslist);
    this.socketService.getAllMessages((msg)=>{this.allMessages = msg});
    this.socketService.reqnumusers(this.currentchannel);
    this.socketService.getnumusers((res)=>{this.numusers = res});
    this.channelslist = {name:"", group:"Group1"};
    this.currentchannel= {name:"", group:"Group1"};
    this.isinChannel = false;
    this.numusers = 0;
    this.channelnotice = ""
    this.messages = [];
    this.allMessages = []
  }
  
  createchannel(){
    console.log("channel list", this.channelslist)
    this.socketService.createChannel(this.newChannel);
    this.socketService.reqchannelList();
    this.socketService.getchannelList((msg)=>{this.channels = msg});
    this.newChannel = {name:"", group:"Group1"};
    
    
  }

  chat(){
    if (this.messagecontent){
  
      this.socketService.sendMessage({ "message": this.messagecontent, "user": sessionStorage.getItem("username"), "channel": this.currentchannel.name});
      this.socketService.getMessage((m)=>{this.messages.push(m)});
      console.log("new messages", this.messages)
      this.messagecontent = null;
    } else {
      console.log('No Message')
    }
    this.socketService.reqAllMessages(this.channelslist);
    console.log(this.channelslist)
    this.socketService.getAllMessages((msg)=>{this.allMessages = msg});
    console.log(this.allMessages)
  }

}
