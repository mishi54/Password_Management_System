const mongoose = require('mongoose');
mongoose.connect("//add ur own mongo name&pass url");
// var conn =mongoose.Collection;
var addcateg =new mongoose.Schema({
    addpasscateg: {type:String, 
        required: true,
        index: {
            unique: true,        
        }},
    date:{
        type: Date, 
        default: Date.now }
});

var addcategModel = mongoose.model('addcateg', addcateg);
module.exports=addcategModel;
