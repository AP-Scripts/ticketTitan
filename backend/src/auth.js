const passport = require('passport')
const DiscordStrategy = require('passport-discord').Strategy
const session = require('express-session')
require('dotenv').config()

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_URL,
      scope: ['identify', 'guilds'],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile)
    }
  )
)

const setupAuth = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/login', passport.authenticate('discord'))
  app.get(
    '/callback',
    passport.authenticate('discord', {
      failureRedirect: '/',
      successRedirect: '/',
    })
  )

  app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'))
  })

  app.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not logged in' })
    }
    res.json(req.user)
  })

  // Protect API routes
  app.use('/api', (req, res, next) => {
    if (req.isAuthenticated()) return next()
    return res.status(403).json({ error: 'Unauthorized' })
  })
}

module.exports = setupAuth
