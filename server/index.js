const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const server = require('http').createServer(app)

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err) => {
    if (err) throw err;
    console.log('MongoDB connection established!');
});

app.use(express.json());
app.use(cors())

//////////////////////////////////////////////////////////

app.use("/home", require("./routes/homeRouter"))

app.use("/users", require("./routes/userRouter"))

app.use("/chat", require("./routes/chatRouter"))

app.use("/images", require("./routes/imageRouter"))

app.get('/', (req, res) => {
    res.send('Server api')
})
////////////////////////////////////////////////////////////////////////////////////////////////

const io = require('socket.io')(server);

io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({ conversationRec, senderName, text }) => {
        io.emit('receive-message', { conversationRec, senderName, senderId: id, text })
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is on port ${PORT}`))