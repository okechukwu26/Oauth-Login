const passport = require("passport");
const LinkedIn = require("passport-linkedin-oauth2").Strategy;
const keys = require("../config/keys");
const User = require("../models/user");
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
passport.use(
  new LinkedIn(
    {
      callbackURL: "/auth/linkedin/redirect",
      clientID: keys.linkedin.clientID,
      clientSecret: keys.linkedin.clientSecret,
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile.photos[0].value);
      try {
        const currentUser = await User.findOne({ googleId: profile.id });
        if (currentUser) {
          done(null, currentUser);
        } else {
          const user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            thumbnail: profile.photos[0].value,
            username: profile.displayName,
          });
          const savedUser = await user.save();
          done(null, savedUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
