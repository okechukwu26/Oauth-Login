const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const keys = require("./keys");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (error) {}
});

passport.use(
  new FacebookStrategy(
    {
      callbackURL: "/auth/facebook/redirect",
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      profileFields: ["email", "name", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, last_name, first_name, id } = profile._json;
      const picture = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`;

      try {
        const currentUser = await User.findOne({ googleId: id });
        if (currentUser) {
          done(null, currentUser);
        } else {
          const user = new User({
            username: `${first_name} ${last_name}`,
            googleId: id,
            email,
            thumbnail: picture,
          });
          const savedUser = await user.save();
          done(null, savedUser);
        }
      } catch (error) {}
    }
  )
);
