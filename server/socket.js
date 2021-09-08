module.exports = {
    connect: function(io, PORT){
        var channels = ["channel1", "channel2", "channel3", "channel4"];
        var socketChannel = [];
        var socketChannelnum = [];
        
        const chat = io.of('/chat');
        
        chat.on('connection', (socket) => {
            console.log("client connected")
            socket.on('message', (message)=>{
                for (let i=0; i<socketChannel.length; i++){
                    console.log('server', socketChannel[i][0])
                    if (socketChannel[i][0] == socket.id){
                        chat.to(socketChannel[i][1]).emit('message', message);
                    }
                }
            });
            socket.on('newchannel', (newchannel)=>{
                if (channels.indexOf(newchannel) == -1){
                    channels.push(newchannel);
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