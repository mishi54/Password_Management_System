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

router.get('/',checkLoginUser, function(req, res, next) {
    return res.render('addnewcategory', { title: 'Add name of Password Category',error:'' ,success:'' });
  });
  router.post('/', checkLoginUser, [check('categname').isLength({ min: 1 }).withMessage('Category name is required')], async function(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('addnewcategory', { title: 'Add name of Password Category', error: errors.mapped(), success: '' });
      } else {
        var categ = req.body.categname;
        const addcategx = new addcategModel({
          addpasscateg: categ,
        });
  
        await addcategx.save();
        return res.render('addnewcategory', { title: 'Add name of Password Category', error: '', success: 'Added successfully' });
      }
    } catch (err) {
      console.error('Error:', err);
      return res.render('addnewcategory', { title: 'Add name of Password Category', error: 'An error occurred while saving the category.', success: '' });
    }
  });
  module.exports = router;