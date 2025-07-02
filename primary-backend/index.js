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
  origin: 'http://localhost:3000',undefined, // Replace with your frontend origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true, // Important for sessions
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Session configuration with Prisma store
app.use(session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  secret: process.env.SESSION_SECRET ,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000, // Check for expired sessions every 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}));
app.set('trust proxy', 2);
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
