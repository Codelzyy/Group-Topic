// const User = require('../models/User');
// const GooglePlusTokenStrategy = require('passport-google-plus-token');
// const passport = require('passport');
// const googleStrategy = new GooglePlusTokenStrategy(
//    {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//    },
//    async (accessToken, refreshToken, profile, done) => {
//       try {
//          const user = await User.findOne({ 'google.id': profile.id });
//          if (!user) {
//             const newUser = await User.create({
//                email: profile.emails[0].value,
//                name: profile.displayName,
//                googleId: profile.id,
//             });
//             return done(null, newUser);
//          }
//          return done(null, user);
//       } catch (e) {
//          return done(e, false);
//       }
//    }
// );
// passport.use(googleStrategy);
// const authGoogle = passport.authenticate('google-plus-token', { session: false });
// module.exports = authGoogle;
