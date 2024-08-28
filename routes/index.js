var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var bcrypt =require('bcryptjs');
const { errorMonitor } = require('selenium-webdriver/bidi');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var addcategModel=require('../modules/addcategory');
var addpassModel=require('../modules/addpass');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem('usertoken');
  if (!userToken) {
    return res.redirect('/');
  }

  try {
    var decoded = jwt.verify(userToken, 'loginToken');
    req.user = decoded; // Store the decoded user information in the request object
    next();
  } catch (err) {
    return res.redirect('/');
  }
}
async function checkEmail(req, res, next) {
  var email = req.body.email;
  try {
    var checkexitemail = await userModule.findOne({ email: email }).exec();
    if (checkexitemail) {
      return res.render('signup', { title: 'Password Management System', msg: 'Email Already Exists' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}
async function checkName(req, res, next) {
  var username = req.body.name;
  try {
    var checkexitname = await userModule.findOne({ username: username }).exec();
    if (checkexitname) {
      return res.render('signup', { title: 'Password Management System', msg: 'Name Already Exists' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}
router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('username');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
    res.render('index', { title: 'Password Management System',msg:" " });
  }
 
});
router.post('/', async function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;

  try {
    const data = await userModule.findOne({ email: email }).exec();

    if (!data) {
      return res.render('index', { title: 'Password Management System', msg: "Invalid email or password" });
    } else {
      var userid = data._id;
      var getpass = data.password;
      if (bcrypt.compareSync(password, getpass)) {
        var token = jwt.sign({ userID: userid }, 'loginToken');
        localStorage.setItem('usertoken', token);
        localStorage.setItem('username', name);
        return res.redirect('/dashboard');
      } else {
        return res.render('index', { title: 'Password Management System', msg: "Invalid email or password" });
      }
    }
  } catch (err) {
    next(err);
  }
});

router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('username');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
  res.render('signup', { title: 'Password Management System', msg:'' });
  }
});
router.post('/signup', checkName, checkEmail, async function(req, res, next) {
  try {
    const username = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpass;

    if (password !== confirmpassword) {
      return res.render('signup', { title: 'Password Management System', msg: 'Password not matched!' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userdet = new userModule({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await userdet.save();
    return res.render('signup', { title: 'Signup Form', msg: 'Signup successfully!' });
  } catch (err) {
    console.error('Error:', err);
    return res.render('signup', { title: 'Signup Form', msg: 'An error occurred during signup.' });
  }
});


router.get('/logout', function(req, res, next) {
  localStorage.removeItem('usertoken');
  localStorage.removeItem('username');
  return res.redirect('/');
});
module.exports = router;
