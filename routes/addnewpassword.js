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

router.get('/', checkLoginUser, async function(req, res, next) {
    try {
      const data = await addcategModel.find({});
      return res.render('addnewpassword', { title: 'Add details of Password Category', records: data });
    } catch (err) {
      console.error('Error:', err);
      return res.render('addnewpassword', { title: 'Add details of Password Category', error: 'An error occurred while fetching the categories.' });
    }
  });
  router.post('/', checkLoginUser, async function(req, res, next) {
    try {
      const passctg = req.body.passwordCategory;
      const details = req.body.passDetail;
      const projname=req.body.passName; 
  
      const passdet = new addpassModel({
        addpasscateg: passctg,
        addpassdetail: details,
        addprojname:projname,
      });
  
      await passdet.save();
  
      const data = await addpassModel.find({}); // Fetch all records after saving the new one
  
      return res.render('addnewpassword', { 
        title: 'Add details of Password Category', 
        records: data, 
        success: "Inserted successfully" 
      });
    } catch (err) {
      console.error('Error:', err);
      return res.render('addnewpassword', { 
        title: 'Add details of Password Category', 
        records: [], 
        error: 'An error occurred while fetching the categories.',
        success: '' 
      });
    }
  });
  module.exports = router;