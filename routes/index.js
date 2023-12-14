var express = require('express');
var router = express.Router();
const paymentMod = require('../model/payment');

const User = require("../model/userMod");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const payment = require('../model/payment');
passport.use(new LocalStrategy(User.authenticate()));

require('nodemailer');
const {sendmail}=require('../utils/sendmail');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/", async function (req, res, next) {
  try {
    await User.register(
      { username: req.body.username, email: req.body.email, city: req.body.city },
      req.body.password
    );
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});


router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res, next) { }
);

router.get('/profile', function (req, res, next) {
  res.render('profile', { title: 'Express' });
});


router.get('/forget', function (req, res, next) {
  res.render('forget', { title: 'Express' });
});


router.get('/payment', function (req, res, next) {
  res.render('payment', { title: 'Express' });
});


router.post('/payment', function (req, res, next) {
  payment.create(req.body).then(() => res.redirect('/payment')).catch((err) => res.send(err));
});


router.get('/deskbord', function (req, res, next) {
  res.render('deskbord', { title: 'Express' });
});

router.get('/account', function (req, res, next) {
  res.render('account', { title: 'Express' });
});



router.get('/delete/:id', async function (req, res, next) {
  try {
    await paymentMod.findByIdAndDelete(req.params.id);
    res.redirect('/history');
  } catch (error) {
    res.send(error);
  }
});


router.get('/update/:id', async function (req, res, next) {
  try {
    const payment=await paymentMod.findById(req.params.id);
    res.render('update',{payment});
  } catch (error) {
    res.send(error);
  }
});


router.post('/update/:id', async function (req, res, next) {
  try {
    const payment=await paymentMod.findByIdAndUpdate(req.params.id,req.body);
    res.redirect('/history');
  } catch (error) {
    res.send(error);
  }
});


router.get('/sendmail',function (req,res,next) {
  res.render('sendmail');
})
 

router.get('/history', async function (req, res, next) {
  try {
    const payment = await paymentMod.find();
    res.render('history', { payment });
  } catch (error) {
    res.send(error);
  }
});





router.get("/signout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/login");
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}




router.post('/forget', async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res.send("User not found! <a href='/forget'>Try Again</a>.");

    await user.setPassword(req.body.newpassword);
    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.send(error);
  }

});

router.post("/send-mail", async function (req, res, next) {
  try {
      const user = await User.findOne({ email: req.body.email });
      if (!user)
          return res.send("User Not Found! <a href='/forget'>Try Again</a>");
      sendmail(user.email, user, res, req);
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});


router.post("/forget/:id", async function (req, res, next) {
  try {
      const user = await User.findById(req.params.id);
      if (!user)
          return res.send("User not found! <a href='/forget'>Try Again</a>.");

      if (user.token == req.body.token) {
          user.token = -1;
          await user.setPassword(req.body.newpassword);
          await user.save();
          res.redirect("/login");
      } else {
          user.token = -1;
          await user.save();
          res.send("Invalid Token! <a href='/forget'>Try Again<a/>");
      }
  } catch (error) {
      res.send(error);
  }
});




module.exports = router;
