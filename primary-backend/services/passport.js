import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        provider: true,
        isVerified: true
      }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return done(null, false, { message: 'No user found with this email' });
      }

      // Check if user signed up with Google
      if (user.provider === 'google' && !user.password) {
        return done(null, false, { 
          message: 'This account was created with Google. Please sign in with Google.' 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/v1/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await prisma.user.findUnique({
        where: { googleId: profile.id }
      });

      if (user) {
        return done(null, user);
      }

      // Check if user exists with same email
      const existingUser = await prisma.user.findUnique({
        where: { email: profile.emails[0].value }
      });

      if (existingUser) {
        // Link Google account to existing user
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleId: profile.id,
            avatar: profile.photos[0]?.value || existingUser.avatar,
            name: existingUser.name || profile.displayName
          }
        });
        return done(null, user);
      }

      // Create new user
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0]?.value,
          provider: 'google',
          isVerified: true // Google accounts are pre-verified
        }
      });

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

export default passport;