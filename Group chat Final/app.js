const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const path = require('path');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const http = require('http');
dotenv.config();

const app = express();

const User = require('./models/users');
const Message = require('./models/messages');
const Group = require('./models/groups');
const GroupUser = require('./models/groupUsers');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');

const port = process.env.PORT;

const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
        origin: '*',
    }
});

app.use(bodyparser.json({ extended: false }));
app.use(cors({origin: '*',}));

const sequelize = require('./util/database');

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Group);
Group.belongsToMany(User, { through: GroupUser });

GroupUser.belongsTo(Group);

Group.hasMany(Message);
Message.belongsTo(Group);

app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, `views/${req.url}`));
});

sequelize.sync({})
.then(() => {
    server.listen(3000, () => {
        console.log('server is listening')})
    }).catch((err) => {
        console.log(err);
    });

io.on('connection', socket =>{
    console.log("user connected");
    socket.on("send-message", async (msg)=>{
        console.log(msg);
        const messages = await Message.findAll({
            where :{  groupId: msg.groupId   },
            include: [{ model: User, attributes: ['name'] }],
           });
        let message = messages[messages.length-1];
        //console.log(message);
        io.emit("receive-message", message)
    })
})

app.use((req, res, next) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});