const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const io = require('socket.io')(5001);
require('dotenv').config();

const app = express();

////////////////////////////////////////////////////////////////////////////////////////////////

io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({ conversationRec, senderName, text }) => {
        io.emit('receive-message', { conversationRec, senderName, senderId: id, text })
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////

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

app.use("/home", require("./routes/homeRouter"))

app.use("/users", require("./routes/userRouter"))

app.use("/chat", require("./routes/chatRouter"))

app.use("/images", require("./routes/imageRouter"))
//////////////////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is on port ${PORT}`))