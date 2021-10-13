//Models
const  Chat  = require("./models/Chat");
const  Channel  = require("./models/Channel");
const  Group  = require("./models/Group");
const  Role  = require("./models/Role");
const  User  = require("./models/User");

//Connections
const  connectDB  = require("./connections/JettChordConnection");
const { exists } = require("./models/Chat");

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

            //This prefills the data if it is empty
            connectDB.then(db  =>  {
                User.find({}).then(res  =>  {
                    if (res.length == 0){
                        let  group1  =  new Group({ name: "Group1"});
                        group1.save();
                        let  group2  =  new Group({ name: "Group2"});
                        group2.save();
                        let  group3  =  new Group({ name: "Group3"});
                        group3.save();
                        let  group4  =  new Group({ name: "Group4"});
                        group4.save();

                        let  user1  =  new User({username: "Jett", email: "jett@email.com", password: "1234", profile: "none"});
                        user1.save();
                        let  user2  =  new User({username: "John", email: "john@email.com", password: "1234", profile: "none"});
                        user2.save();
                        let  user3  =  new User({username: "Dave", email: "dave@email.com", password: "1234", profile: "none"});
                        user3.save();
                        let  user4  =  new User({username: "Fred", email: "fred@email.com", password: "1234", profile: "none"});
                        user4.save();

                        let  role1  =  new Role({user: "Jett", group: "Group1", role: "user"});
                        role1.save();
                        let  role2  =  new Role({user: "Jett", group: "Group2", role: "user"});
                        role2.save();
                        let  role3  =  new Role({user: "Jett", group: "All", role: "admin"});
                        role3.save();
                        let  role4  =  new Role({user: "John", group: "Group1", role: "user"});
                        role4.save();
                        let  role5  =  new Role({user: "Dave", group: "Group4", role: "user"});
                        role5.save();
                    }
                })
            })

            socket.on('message', (message)=>{
                connectDB.then(db  =>  {
                            
                    let  chatMessage  =  new Chat({ user: message.user, message: message.message, channel: message.channel, group: message.group});
                    chatMessage.save();
                    socket.to(JSON.stringify({ name: chatMessage.channel, group: chatMessage.group })).emit('message', chatMessage);
                });
                connectDB.then(db  =>  {
                    Chat.find({  'channel': message.channel, 'group': message.group }).then(res  =>  {
                        chat.to(JSON.stringify({ name: message.name, group: message.group })).emit('allmessages', res);
                })});
            });


            socket.on('newchannel', (newchannel)=>{
                var exists = false
                connectDB.then(db  =>  {
                    Channel.find({ 'name': newchannel.name }).then(res  =>  {
                        if (res.length != 0){
                            exists = true
                        } else {
                            exists = false
                        }
                })});
                if (exists == false){
                    connectDB.then(db  =>  {
                        let  chatChannel  =  new Channel({ name: newchannel.name, group: newchannel.group});
                        chatChannel.save();
                    });
                    connectDB.then(db  =>  {
                        Channel.find({ 'group': newchannel.group }).then(res  =>  {
                            chat.emit('channellist', res);
                    })});
                }
                
            });

            socket.on('addRole', (role)=>{
                connectDB.then(db  =>  {
                    let  newRole  =  new Role({user: role.user, group: role.group, role: "user"});
                    newRole.save();
                }); 
            });

            socket.on('isAdmin', (username)=>{
                connectDB.then(db  =>  {
                    Role.find({ 'user': username, 'role': 'admin' }).then(res  =>  {
                        if (res.length == 1){
                            socket.join("admin")
                            chat.to("admin").emit('isAdmin', true);
                        } else {
                            chat.emit('isAdmin', false);
                        }
                })});
            })

            socket.on('channellist', (group)=>{
                connectDB.then(db  =>  {
                    Channel.find({ 'group': group }).then(res  =>  {
                        chat.emit('channellist', res);
                })});
                
            })

            socket.on('users', (msg)=>{
                users = []
                connectDB.then(db  =>  {
                    User.find({}).then(res  =>  {
                        for (i in res){
                            users.push(res[i].username)
                        }
                        chat.emit('users', users);
                })});
                
            })

            socket.on('rolesList', (msg)=>{
                var groupList = []
                connectDB.then(db  =>  {
                    Group.find({}).then(res  =>  {
                        for (i in res){
                            groupList.push({group: res[i].name, users: []})
                        }
                    })
                    Role.find({}).then(res  =>  {
                        for (i in groupList){
                            if (groupList[i].group != "All"){
                                for (j in res){
                                    if (res[j].group == groupList[i].group){
                                        
                                        groupList[i].users.push(res[j].user)
                                    }
                                }
                            }
                        }
                        chat.emit('rolesList', groupList);
                })});
                
            })
            socket.on('allGroups', (msg)=>{
                connectDB.then(db  =>  {
                    Group.find({}).then(res  =>  {
                        chat.emit('allGroups', res);
                })});
                
            })

            socket.on('grouplist', (username)=>{
                grouplist = []
                connectDB.then(db  =>  {
                    Role.find({user: username}).then(res  =>  {
                        for (num in res){
                            if (res[num].group != "All"){
                                grouplist.push(res[num].group)
                            }
                        }
                        chat.emit('grouplist', grouplist);
                })});
                
            })

            socket.on('joinGroup', (group)=>{
                connectDB.then(db  =>  {
                    Channel.find({'group': group}).then(res  =>  {
                        chat.emit('channellist', res);
                    })
                })
            })

            
            socket.on('allmessages', (channel)=>{
                connectDB.then(db  =>  {
                    Chat.find({  'channel': channel.name, 'group': channel.group }).then(res  =>  {
                        chat.to(JSON.stringify({ name: channel.name, group: channel.group })).emit('allmessages', res);
                })});
            });

            socket.on('joinChannel', (channel)=>{
                connectDB.then(db  =>  {
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

            socket.on('login', (user)=>{
                connectDB.then(db  =>  {
                    User.find({'email': user.email, 'password': user.password}).then(res  =>  {
                        if (res.length == 1){
                            socket.emit('login', {username: res[0].username, valid: "true"});
                        } else {
                            socket.emit('login', {username: "none", valid: "false"});
                        }
                        
                    })
                });
            });


            socket.on('numusers', (channel)=>{
                var usercount = 0;
                for (let i=0; i<isOnline.length; i++){
                    if (isOnline[i].channel.name == channel.name && isOnline[i].channel.group == channel.group){
                        usercount +=1
                    }
                }
                chat.to(JSON.stringify({ name: channel.name, group: channel.group })).emit('numusers', usercount);
            });

            socket.on("disconnect", ()=>{
                for (let i=0; i<isOnline.length; i++){
                    if (isOnline[i].id == socket.id){
                        
                        socket.leave(JSON.stringify({ name: isOnline[i].channel.name, group: isOnline[i].channel.group }));
                        chat.to(JSON.stringify({ name: isOnline[i].channel.name, group: isOnline[i].channel.group })).emit("notice", "A user has left");
                        isOnline.splice(i, 1);
                    }
                }
                console.log("Client disconnected");
            });

        });
    }
}