import { Injectable } from '@angular/core';

import { io, Socket } from 'socket.io-client'
import { nextTick } from 'q';

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;


  constructor() { }

  initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  joingroup(se1group): void {
    this.socket.emit("joinGroup", se1group);
  }

  leavegroup(se1group): void {
    this.socket.emit("leaveGroup", se1group);
  }

  joined(next): void {
    this.socket.on("joined", res=>next(res));
  }

  createGroup(newgroup){
    this.socket.emit('newgroup', newgroup);
  }

  reqnumusers(se1group){
    console.log("reqnumusers", se1group)
    this.socket.emit('numusers', se1group);
  }

  getnumusers(next){
    console.log("getnumusers", next)
    this.socket.on('numusers', res=>next(res));
  }

  reqgroupList(){
    this.socket.emit('grouplist', 'list please');
  }

  getgroupList(next){
    this.socket.on('grouplist', res=>next(res));
  }

  notice(next){
    this.socket.on('notice', res=>next(res));
  }

  sendMessage(message: string): void {
    console.log('message', message)
    this.socket.emit('message', message);
  }

  getMessage(next){
    this.socket.on('message', (message)=>next(message));
  }
}
