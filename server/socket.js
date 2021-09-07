module.exports = {
    connect: function(io, PORT){
        var groups = ["group1", "group2", "group3", "group4"];
        var socketGroup = [];
        var socketGroupnum = [];

        const chat = io.of('/chat');

        chat.on('connection', (socket) => {
            socket.on('message', (message)=>{
                for (let i=0; i<socketGroup.length; i++){
                    if (socketGroup[i][0] == socket.id){
                        chat.to(socketGroup)[i][1].emit('message', message);
                    }
                }
            });
            socket.on('newgroup', (newgroup)=>{
                if (groups.indexOf(newgroup) == -1){
                    groups.push(newgroup);
                    chat.emit('grouplist', JSON.stringify(groups));
                }
            });

            socket.on('grouplist', (m)=>{
                chat.emit('grouplist', JSON.stringify(groups));
            })

            socket.on('numusers', (group)=>{
                var usercount = 0;
                for (let i=0; i<socketGroupnum.length; i++){
                    if(socketGroupnum[i][0] == group){
                        usercount = socketGroupnum[i][1];
                    }
                }
                chat.in(group).emit('numusers', usercount);
            });

            socket.on('joinGroup', (group)=>{
                if (groups.includes(group)){
                    socket.join(group, ()=>{
                        var ingroupSocketarray = false
                        for (let i=0; i<socketGroup.length; i++){
                            if (socketGroup[i][0]==socket.id){
                                socketGroupnum[i][1] = group;
                                ingroup = true;
                            }
                        }

                        if (ingroupSocketarray == false){
                            socketGroup.push([socket.id, group]);
                            var hasgroupnum = false;
                            for (let j=0; i<socketGroupnum.length; j++){
                                if (socketGroupnum[j][0]==group){
                                    socketGroupnum[j][1] = socketGroupnum[j][1] +1;
                                    hasgroupnum = true;
                                }
                            }
    
                            if (hasgroupnum == false){
                                socketGroupnum.push([group, 1]);
                            }
                        }
                        chat.in(group).emit("notice", "A new user has joined");
                        
                        
                    });
                    return chat.in(group).emit("joined", group);
                }
            });

            socket.on("leaveGroup", (group)=>{

                for (let i=0; i<socketGroup.length; i++){
                    if (socketGroup[i][0] == socket.id){
                        socketGroup.splice(i, 1);
                        socket.leave(group);
                        chat.to(group).emit("notice", "A user has left");
                    }
                }
                for (let j=0; i<socketGroupnum.length; j++){
                    if (socketGroupnum[j][0] == group){
                        socketGroupnum[j][1] = socketGroupnum[j][1] -1;
                        if (socketGroupnum[j][1]==0){
                            socketGroupnum.splice(j,1)
                        }
                    }
                }
            });

            socket.on('disconnect', ()=>{
                chat.emit('disconnect');
                for (let i=0; i<socketGroup.length; i++){
                    if (socketGroup[i][0] == socket.id){
                        socketGroup.splice(i, 1);
                    }
                }
                for (let j=0; i<socketGroupnum.length; j++){
                    if (socketGroupnum[j][0]==socket.group){
                        socketGroupnum[j][1] = socketGroupnum[j][1] -1;
                    }
                }
                console.log("Client disconnected");
            });

        });
    }
}