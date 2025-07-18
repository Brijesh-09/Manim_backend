import express from 'express';
import cors from 'cors';
import videoRoutes from './routes/video.js';
import authRoutes from './routes/auth.js';
import session from 'express-session';
import flash from 'express-flash';
import passport from './services/passport.js'
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import pkg from '@prisma/client';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const app = express ();
const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: { origin: "*" }, // change to your frontend domain in prod
});

app.use(cors({
  origin: 'https://promanim.vercel.app', // ✅ Only this
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// Session configuration with Prisma store
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,            // ✅ required for HTTPS
    sameSite: "none",        // ✅ allow cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }
  )
}));



app.set('trust proxy', 1);
app.set('io', io);
// Flash messages
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/video', videoRoutes);

app.get('/test', (req,res) => {
    res.json({message: "Hello from the backend!"})
})

io.on('connection', (socket) => {
  console.log('🚀 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('👋 Client disconnected:', socket.id);
  });
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
