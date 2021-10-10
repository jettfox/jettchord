
var fs = require('fs');
const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;

const  chatSchema  =  new Schema(
    {
        groups:[
            {
                name: String,
                channels: [
                    {
                        name: String,
                        messages: [
                            {
                                user: String,
                                message: String
                            }
                        ]
                    }
                ]
            }
        ]
    }
);
const  userSchema  =  new Schema(
    {
        users:[
            {
                username: String,
                email: String,
                password: String,
                profile: String
            }
        ]
    }
);
const  rolesSchema  =  new Schema(
    {
        roles:[
            {
                user: String,
                group: String,
                role: String
            }
        ]
    }
);
module.exports = {
    connect: function(io, PORT){
        var channels = JSON.parse(fs.readFileSync('./data/channels.json', 'utf8')); 
        var socketChannel = [];
        var socketChannelnum = [];
        var messages = [];
        messages = JSON.parse(fs.readFileSync('./data/messages.json', 'utf8')); 
        
        const chat = io.of('/chat');
        
        chat.on('connection', (socket) => {
            console.log("client connected")
            socket.on('message', (message)=>{
                for (let i=0; i<socketChannel.length; i++){
                    if (socketChannel[i][0] == socket.id){
                        chat.to(socketChannel[i][1]).emit('message', message);
                        messages.push(message);
                        fs.writeFile('./data/messages.json', JSON.stringify(messages),'utf8', function(err){
                            if (err) throw err;
                        });
                    }
                }
            });
            socket.on('newchannel', (newchannel)=>{
                if (channels.indexOf(newchannel) == -1){
                    channels.push(newchannel);
                    fs.writeFile('./data/channels.json', JSON.stringify(channels),'utf8', function(err){
                        if (err) throw err;
                    });
                    chat.emit('channellist', JSON.stringify(channels));
                }
            });

            socket.on('channellist', (m)=>{
                chat.emit('channellist', JSON.stringify(channels));
            })

            socket.on('numusers', (channel)=>{
                var usercount = 0;
                for (let i=0; i<socketChannelnum.length; i++){
                    
                    if(socketChannelnum[i][0] == channel){
                        
                        usercount = socketChannelnum[i][1];
                    }
                }
                chat.in(channel).emit('numusers', usercount);
            });


            socket.on('allmessages', (channel)=>{
                var channelmessages = [];
                for (let i=0; i<messages.length; i++){
                    if (messages[i].channel == channel){
                        channelmessages.push(messages[i])
                    }
                }
                chat.in(channel).emit('allmessages', channelmessages);
            });

            socket.on('joinChannel', (channel)=>{

                if (channels.includes(channel)){
                    socket.join(channel)
                    var inchannelSocketarray = false
                    for (let i=0; i<socketChannel.length; i++){
                        if (socketChannel[i][0]==socket.id){
                            socketChannelnum[i][1] = channel;
                            inchannel = true;
                        }
                    }

                    if (inchannelSocketarray == false){
                        socketChannel.push([socket.id, channel]);
                        var haschannelnum = false;
                        for (let j=0; j<socketChannelnum.length; j++){
                            if (socketChannelnum[j][0]==channel){
                                socketChannelnum[j][1] = socketChannelnum[j][1] +1;
                                haschannelnum = true;
                            }
                        }

                        if (haschannelnum == false){
                            socketChannelnum.push([channel, 1]);
                        }
                    }
                    chat.in(channel).emit("notice", "A new user has joined");
                    return chat.in(channel).emit("joined", channel);
                }
            });

            socket.on("leaveChannel", (channel)=>{

                for (let i=0; i<socketChannel.length; i++){
                    if (socketChannel[i][0] == socket.id){
                        socketChannel.splice(i, 1);
                        socket.leave(channel);
                        chat.to(channel).emit("notice", "A user has left");
                    }
                }
                for (let j=0; j<socketChannelnum.length; j++){
                    if (socketChannelnum[j][0] == channel){
                        socketChannelnum[j][1] = socketChannelnum[j][1] -1;
                        if (socketChannelnum[j][1]==0){
                            socketChannelnum.splice(j,1)
                        }
                    }
                }
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