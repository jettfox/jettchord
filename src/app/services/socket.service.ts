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

  reqGroupList(username){
    this.socket.emit('grouplist', username);
  }

  getGroupList(next){
    this.socket.on('grouplist', res=>next(res));
  }

  reqIsAdmin(username){
    this.socket.emit('isAdmin', username);
  }

  getIsAdmin(next){
    this.socket.on('isAdmin', res=>next(res));
  }

  joingroup(group): void {
    this.socket.emit("joinGroup", group);
  }

  reqRoles(): void {
    this.socket.emit('rolesList','give me the roles');
  }

  getRoles(next): void {
    this.socket.on('rolesList',res=>next(res));
  }

  reqUsers(): void {
    this.socket.emit('users','give me the users');
  }

  getUsers(next): void {
    this.socket.on('users',res=>next(res));
  }

  reqAllGroups(): void {
    this.socket.emit('allGroups','give me the users');
  }

  getAllGroups(next): void {
    this.socket.on('allGroups',res=>next(res));
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
    this.socket.emit('numusers', se1channel);
  }

  getnumusers(next){
    this.socket.on('numusers', res=>next(res));
  }

  reqchannelList(group){
    this.socket.emit('channellist', group);
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

  reqAllMessages(channel){
    this.socket.emit('allmessages', channel);
  }

  getAllMessages(next){
    this.socket.on('allmessages', (res:[])=>next(res));
  }

  login(user): void {
    this.socket.emit('login', user);
  }

  confirm(next){
    this.socket.on('login', (res)=>next(res));
  }


}
