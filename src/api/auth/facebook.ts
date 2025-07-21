import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { db } from '../firebase';
import 'dotenv/config';
import type { Request, Response, NextFunction } from "express";
import express from 'express';
import session from 'express-session';

const facebookAuthRoute = express.Router();

// Passport session setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

// Configure the Facebook strategy for use by Passport.
passport.use(new FacebookStrategy({
  clientID: process.env['FACEBOOK_APP_ID'] || '',
  clientSecret: process.env['FACEBOOK_APP_SECRET'] || '',
  callbackURL: process.env['FACEBOOK_CALLBACK_URL'] || '',
  profileFields: ['id', 'displayName', 'emails'],
  enableProof: true
}, async (accessToken, refreshToken, profile, done) => {
  // Add accessToken to profile
  (profile as any).accessToken = accessToken;

  // Save or update user data in Firestore
  try {
    const userData: Record<string, any> = {
      name: profile.displayName,
      email: profile.emails ? profile.emails[0].value : null,
      accessToken,
      updatedAt: new Date()
    };
    if (refreshToken !== undefined) {
      userData['refreshToken'] = refreshToken;
    }
    await db.collection('users').doc(profile.id).set(userData, { merge: true });
  } catch (err) {
    console.error("Error saving to Firebase:", err);
  }

  return done(null, profile);
}));

// Middleware to initialize Passport
const passportMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  return new Promise<void>((resolve) => {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, () => {
        resolve();
      });
    });
  }).then(() => next());
};

// Apply passport middleware
facebookAuthRoute.use('*', passportMiddleware);

// Add express-session middleware before passport
facebookAuthRoute.use(session({
  secret: process.env['SESSION_SECRET'] || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Route to start Facebook authentication
facebookAuthRoute.get('/', async (req: Request, res: Response) => {
  return new Promise<Response>((resolve) => {
    return passport.authenticate('facebook', {
      scope: ['email', 'pages_manage_posts', 'pages_read_engagement', 'pages_show_list']
    })(req, res, () => {
      // This is needed because Passport redirects using res.redirect which doesn't work with Hono
      // The response is already sent by Passport
      resolve(res);
    });
  });
});

// Callback URL after authentication
facebookAuthRoute.get('/callback', async (req: Request, res: Response) => {
  return new Promise<Response>((resolve) => {
    passport.authenticate('facebook', { failureRedirect: '/' })(req, res, (pssprt: any) => {
      console.log('Facebook authentication successful:', pssprt);
      // res.status(200).type('text/plain').send('Facebook login success! Your data has been stored in Firebase.');
      res.status(200).redirect('/auth-success'); // Redirect to a success page
      resolve(res);
    });
  });
});

export default facebookAuthRoute;
