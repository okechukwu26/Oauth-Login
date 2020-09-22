const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user");
//serialize the cookie to be stored in the browser
passport.serializeUser((user, done) => {
  done(null, user.id);
});
//deserialize the cookie to get back the user data
passport.deserializeUser(async (id, done) => {
  const deserializedUser = await User.findById(id);
  done(null, deserializedUser);
});
//google strategy
passport.use(
  new GoogleStrategy(
    {
      //option for google strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    //getting the user info from google
    async (accesToken, refreshToken, profile, done) => {
      console.log(profile);
      //callback fucntion passport
      try {
        //checking if the user exists
        const currentUser = await User.findOne({ googleId: profile.id });
        if (currentUser) {
          done(null, currentUser);
          return console.log(`user is ${currentUser}`);
        }
        //creating a new user
        const user = new User({
          username: profile.displayName,
          googleId: profile.id,
          thumbnail: profile._json.picture,
          email: profile._json.email,
        });
        const savedUser = await user.save();
        console.log(savedUser);
        done(null, savedUser);
      } catch (error) {
        console.log(error);
      }
    }
  )
);
