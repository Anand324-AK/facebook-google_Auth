const express = require("express");
const app = express();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const googleStrategy = require("passport-google-oauth20");
const expressSession = require("express-session");
const userRoute = require("./routes/user");
const dotenv = require("dotenv");
dotenv.config();
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      callbackURL: "http://localhost:3100/google/auth"
      
    },
    (accessToken, refreshToken, profile, cb) => {
      cb(null, {});
    }
  )
);


passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3100/fb/auth",
      profileFields: ["emails", "displayName", "name", "picture"]
    },
    (accessToken, refreshToken, profile, cb) => {
      cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.use(
  expressSession({
    secret: "Anand",
    resave: true,
    saveUninitialized: true
  })
);

//routes
app.use(
  "/login/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.use(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.use("/failed/login", (req, res, next) => {
  res.send("login failed");
});

app.use(
  "/google/auth",
  passport.authenticate("google", { failureRedirect: "/failed/login" }),
  (req, res, next) => {
    console.log(req.user, req.isAuthenticated());
    console.log(req.user.id);
    res
      .status(200)
      .json({
        message: "user logged in successfully"       
      
      });
  }
);

app.use(
  "/fb/auth",
  passport.authenticate("facebook", { failureRedirect: "/failed/login" }),
  (req, res, next) => {
    console.log(req.user, req.isAuthenticated());
    console.log(req.user.id);
    res
      .status(200)
      .json({
        message: "user logged in successfully",        
        name: req.user
      });
  }
);

// app.use('/',(req,res,next)=>{
//     res.send(res.user? req.user: "not logged in with fb acount")
// })

app.listen(3100);
