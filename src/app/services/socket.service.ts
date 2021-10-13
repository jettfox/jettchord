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

  //initialiser
  initSocket(): void {
    this.socket = io(SERVER_URL);
  }
  //request the group list
  reqGroupList(username){
    this.socket.emit('grouplist', username);
  }

  //get the group list
  getGroupList(next){
    this.socket.on('grouplist', res=>next(res));
  }

  //request whether the user is an admin
  reqIsAdmin(username){
    this.socket.emit('isAdmin', username);
  }

  //get the admin results
  getIsAdmin(next){
    this.socket.on('isAdmin', res=>next(res));
  }

  //join a group
  joingroup(group): void {
    this.socket.emit("joinGroup", group);
  }

  //request all of the roles
  reqRoles(): void {
    this.socket.emit('rolesList','give me the roles');
  }

  //add a role
  reqAddRole(role){
    this.socket.emit('addRole', role);
  }

  //get all of the roles
  getRoles(next): void {
    this.socket.on('rolesList',res=>next(res));
  }

  //request all users
  reqUsers(): void {
    this.socket.emit('users','give me the users');
  }

  //get all of the users
  getUsers(next): void {
    this.socket.on('users',res=>next(res));
  }

  //request all groups
  reqAllGroups(): void {
    this.socket.emit('allGroups','give me the users');
  }

  //get all of the groups
  getAllGroups(next): void {
    this.socket.on('allGroups',res=>next(res));
  }

  //join a channel
  joinchannel(se1channel): void {
    this.socket.emit("joinChannel", se1channel);
  }

  //leave a channel
  leavechannel(se1channel): void {
    this.socket.emit("leaveChannel", se1channel);
  }

  //get joined results
  joined(next): void {
    this.socket.on("joined", res=>next(res));
  }

  //create a channel
  createChannel(newchannel){
    this.socket.emit('newchannel', newchannel);
  }

  //request the number of users in a channel
  reqnumusers(se1channel){
    this.socket.emit('numusers', se1channel);
  }

  //get the number of users in a channel
  getnumusers(next){
    this.socket.on('numusers', res=>next(res));
  }

  //request the channel
  reqchannelList(group){
    this.socket.emit('channellist', group);
  }

  //get the channel
  getchannelList(next){
    this.socket.on('channellist', res=>next(res));
  }

  //get the notice
  notice(next){
    this.socket.on('notice', res=>next(res));
  }

  //send the message
  sendMessage(message): void {
    this.socket.emit('message', message);
  }

  //get new messages
  getMessage(next){
    this.socket.on('message', (message)=>next(message));
  }

  //request all messages
  reqAllMessages(channel){
    this.socket.emit('allmessages', channel);
  }

  //get all messages
  getAllMessages(next){
    this.socket.on('allmessages', (res:[])=>next(res));
  }

  //logs in user
  login(user): void {
    this.socket.emit('login', user);
  }

  //gets log in response
  confirm(next){
    this.socket.on('login', (res)=>next(res));
  }


}
