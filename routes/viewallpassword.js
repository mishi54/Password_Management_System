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
router.get('/', checkLoginUser, async (req, res, next) => {
    try {
      const perPage = 5; // Number of records per page
      const page = parseInt(req.query.page, 10) || 1; // Current page number
      const skip = (perPage * page) - perPage;
      const records = await addpassModel.find({})
        .skip(skip)
        .limit(perPage)
        .exec();
      const count = await addpassModel.countDocuments({});
      res.render('viewallpassword', {
        title: 'Add details of Password Category',
        records: records,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    } catch (err) {
      console.error('Error fetching password categories:', err);
      res.render('viewallpassword', {
        title: 'Add details of Password Category',
        records: [],
        error: 'An error occurred while fetching the categories.'
      });
    }
  });
  
  router.get('/:page', checkLoginUser, async (req, res, next) => {
    try {
      // Define pagination parameters
      const perPage = 5; // Number of records per page
      const page = parseInt(req.params.page) || 1; // Current page number
  
      // Calculate the number of records to skip based on the page number
      const skip = (perPage * page) - perPage;
  
      // Fetch records with pagination
      const records = await addpassModel.find({})
        .skip(skip)
        .limit(perPage)
        .exec();
  
      // Count total number of records
      const count = await addpassModel.countDocuments({});
  
      // Render the view with pagination data
      res.render('viewallpassword', {
        title: 'Add details of Password Category',
        records: records,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    } catch (err) {
      console.error('Error fetching password categories:', err);
      res.render('viewallpassword', {
        title: 'Add details of Password Category',
        records: [],
        error: 'An error occurred while fetching the categories.'
      });
    }
  });
  

  module.exports = router;