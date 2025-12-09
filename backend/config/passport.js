const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user.model");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_ID",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_SECRET",
    callbackURL: "/api/v1/users/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                user = await User.create({
                    username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
                    email: profile.emails[0].value,
                    password: "SocialLogin_" + Math.random().toString(36).slice(-8), // Dummy password
                    isSocial: true
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || "PLACEHOLDER_ID",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "PLACEHOLDER_SECRET",
    callbackURL: "/api/v1/users/github/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let email = profile.emails ? profile.emails[0].value : null;
            if (!email) {
                // Fallback if email is private, might need more logic
                email = `${profile.username}@github.placeholder.com`;
            }

            let user = await User.findOne({ email: email });

            if (!user) {
                user = await User.create({
                    username: profile.username,
                    email: email,
                    password: "SocialLogin_" + Math.random().toString(36).slice(-8),
                    isSocial: true
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

module.exports = passport;
