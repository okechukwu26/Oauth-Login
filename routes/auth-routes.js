const router = require("express").Router();
const passport = require("passport");

//login route
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

//logoout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
//google route login in
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
//facebook route login
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
//facebook callback route URI
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
  })
);
//callback route URI
router.get(
  "/google/redirect",
  passport.authenticate("google"),

  (req, res) => {
    res.redirect("/profile/");
  }
);
//linkedin route

router.get(
  "/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  })
);
//linkedin callback uri
router.get(
  "/linkedin/redirect",
  passport.authenticate("linkedin", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
  })
);

module.exports = router;
