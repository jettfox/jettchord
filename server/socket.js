//Models
const  Chat  = require("./models/Chat");
const  Channel  = require("./models/Channel");
const  Group  = require("./models/Group");
const  Role  = require("./models/Role");
const  User  = require("./models/User");

//Connections
const  connectChannel  = require("./connections/ChannelConnection");
const  connectGroup  = require("./connections/ChannelConnection");
const  connectRole  = require("./connections/ChannelConnection");
const  connectUser  = require("./connections/ChannelConnection");
const  connectChat  = require("./connections/ChannelConnection");

fs = require('fs');


module.exports = {
    connect: function(io, PORT){
        var groupName = "Group1"
        var channels = [];
        var messages = [];
        var socketChannel = [];
        var socketChannelnum = [];
        var isOnline = []
        
        
        const chat = io.of('/chat');
        
        chat.on('connection', (socket) => {
            console.log("client connected")
            socket.on('message', (message)=>{
                for (let i=0; i<isOnline.length; i++){
                    if (isOnline[i].id == socket.id){
                        connectChat.then(db  =>  {
                            let  chatMessage  =  new Chat({ user: message.user, message: message.message, channel: message.channel, group: "Group1"});
                            chatMessage.save();
                            socket.to(JSON.stringify({ name: chatMessage.channel, group: chatMessage.group })).emit('message', chatMessage);
                        });
                    }
                }
            });
            socket.on('newchannel', (newchannel)=>{
                connectChannel.then(db  =>  {
                    let  chatChannel  =  new Channel({ name: newchannel.name, group: "Group1"});
                    chatChannel.save();
                });
                connectChannel.then(db  =>  {
                    Channel.find({ 'group': groupName }).then(res  =>  {
                        chat.emit('channellist', res);
                })});
            });

            socket.on('channellist', (m)=>{
                connectChannel.then(db  =>  {
                    Channel.find({ 'group': groupName }).then(res  =>  {
                        channels = res
                        chat.emit('channellist', res);
                })});
                
            })

            
            socket.on('allmessages', (channel)=>{
                connectChat.then(db  =>  {
                    Chat.find({  'channel': channel.name, 'group': channel.group }).then(res  =>  {
                        chat.to(JSON.stringify({ name: channel.name, group: channel.group })).emit('allmessages', res);
                })});
            });

            socket.on('joinChannel', (channel)=>{
                connectChannel.then(db  =>  {
                    Channel.find({ 'name': channel.name, 'group': channel.group }).then(res  =>  {
                        isOnline.push({id: socket.id, channel: { name: res[0].name, group: res[0].group }})
                        socket.join(JSON.stringify({ name: res[0].name, group: res[0].group }))
                        var usercount = 0;
                        for (let i=0; i<isOnline.length; i++){
                            if (isOnline[i].channel.name == channel.name && isOnline[i].channel.group == channel.group){
                                usercount +=1
                            }
                        }
                        chat.to(JSON.stringify({ name: channel.name, group: channel.group })).emit('numusers', usercount);
                        
                        chat.in(JSON.stringify({ name: channel.name, group: channel.group })).emit("notice", "A new user has joined");
                        return socket.emit('joined',{ name: channel.name, group: channel.group });
                })});
                
            });

            socket.on("leaveChannel", (channel)=>{
                for (let i=0; i<isOnline.length; i++){
                    if (isOnline[i].id == socket.id){
                        isOnline.splice(i, 1);
                        socket.leave(JSON.stringify({ name: channel.name, group: channel.group }));
                        chat.to(JSON.stringify({ name: channel.name, group: channel.group })).emit("notice", "A user has left");
                    }
                }
                var usercount = 0;
                for (let i=0; i<isOnline.length; i++){
                    if (isOnline[i].channel.name == channel.name && isOnline[i].channel.group == channel.group){
                        usercount +=1
                    }
                }
                chat.to(JSON.stringify({ name: channel.name, group: channel.group })).emit('numusers', usercount);
            });


            socket.on('numusers', (channel)=>{
               // console.log(isOnline)
                var usercount = 0;
                for (let i=0; i<isOnline.length; i++){
                    if (isOnline[i].channel.name == channel.name && isOnline[i].channel.group == channel.group){
                        usercount +=1
                    }
                }
                chat.to(JSON.stringify({ name: channel.name, group: channel.group })).emit('numusers', usercount);
            });

            socket.on("disconnect", ()=>{
                //chat.emit('disconnect');
                for (let i=0; i<socketChannel.length; i++){
                    if (socketChannel[i][0] == socket.id){
                        socketChannel.splice(i, 1);
                    }
                }
                for (let j=0; j<socketChannelnum.length; j++){
                    if (socketChannelnum[j][0]==socket.channel){
                        socketChannelnum[j][1] = socketChannelnum[j][1] -1;
                    }
                }
                console.log("Client disconnected");
            });

        });
    }
}