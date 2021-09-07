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

  initSoceket(): void {
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
    this.socket.emit('numusers', se1group);
  }

  getnumusers(next){
    this.socket.emit('numusers', res=>next(res));
  }

  reqroom(){
    this.socket.emit('roomlist', 'list please');
  }

  getroom(next){
    this.socket.emit('roomlist', res=>next(res));
  }

  notice(next){
    this.socket.emit('notice', res=>next(res));
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  getMessage(next){
    this.socket.emit('message', (message)=>next(message));
  }
}
