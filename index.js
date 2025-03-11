const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const passport = require('passport');
const session = require('express-session');

require('dotenv').config();

const app = express();
app.use(cors({
    // origin: 'https://chater-v1.vercel.app',
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'] 
}));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);

mongoose.connect(process.env.URL_MONGOOSE, {
    serverSelectionTimeoutMS: 30000, // Perpanjang waktu timeout untuk koneksi ke server MongoDB (30 detik)
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('Database sudah terhubung!')
})
.catch((error) => {
    console.log(error)
})

app.use((req, res, next) => {
    res.setTimeout(20000, () => {
        res.status(408).send('Request timeout');
    });
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const roomRouter = require('./routers/roomRouter')
const userRouter = require('./routers/userRouter')

require('./utils/passport');

app.use('/auth', userRouter)
app.use('/room', roomRouter)

app.get('/test', (req, res) => [
    res.send('API - ON - SUCCESS')
])

server.listen(process.env.PORT, () => {
    console.log(`Aplikasi berjalan pada port ${process.env.PORT}`)
})