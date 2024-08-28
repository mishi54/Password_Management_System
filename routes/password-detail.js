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
      return res.redirect('/dashboard');
    } catch (err) {
      console.error('Error fetching password categories:', err);  // Improved error logging
    }
  });
  
  router.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await addpassModel.findByIdAndDelete(id);
        res.redirect('/password-detail'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
  });
  
  router.get('/edit/:id', checkLoginUser, async (req, res) => {
    const id = req.params.id;
    
    try {
      // Fetch all password categories
      const records = await addcategModel.find({});
      
      // Fetch the specific password details
      const data = await addpassModel.findById(id).exec();
      
      // Render the page with data
      res.render('editpassdet', {
        title: 'Password Management System',
        error: '',
        success: '',
        records: records, // Categories
        record: data, // Current record
        id: id
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  router.post('/edit/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { passwordCategory, passDetail, passName } = req.body;
  
      // Update the password details
      await addpassModel.findByIdAndUpdate(id, {
        addpasscateg: passwordCategory,
        addpassdetail: passDetail,
        addprojname: passName
      }, { new: true }); // { new: true } returns the updated document
  
      // Redirect after successful update
      res.redirect('/'); 
    } catch (error) {
      console.error('Error updating password detail:', error);
      res.status(500).send('Server Error'); 
    }
  });
  
  
  module.exports = router;
