import { Injectable } from '@angular/core';

import { io, Socket } from 'socket.io-client'
import { nextTick } from 'q';

const SERVER_URL = 'http://localhost:3000/chat';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;


  constructor() { }

  initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  joinchannel(se1channel): void {
    this.socket.emit("joinChannel", se1channel);
  }

  leavechannel(se1channel): void {
    this.socket.emit("leaveChannel", se1channel);
  }

  joined(next): void {
    this.socket.on("joined", res=>next(res));
  }

  createChannel(newchannel){
    this.socket.emit('newchannel', newchannel);
  }

  reqnumusers(se1channel){
    console.log("reqnumusers", se1channel)
    this.socket.emit('numusers', se1channel);
  }

  getnumusers(next){
    console.log("getnumusers", next)
    this.socket.on('numusers', res=>next(res));
  }

  reqchannelList(){
    this.socket.emit('channellist', 'list please');
  }

  getchannelList(next){
    this.socket.on('channellist', res=>next(res));
  }

  notice(next){
    this.socket.on('notice', res=>next(res));
  }

  sendMessage(message): void {
    this.socket.emit('message', message);
  }

  getMessage(next){
    this.socket.on('message', (message)=>next(message));
  }
}
