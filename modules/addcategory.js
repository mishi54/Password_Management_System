const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://mishi121006:DytUfZMXpeL2S6U0@pms.wsnlr.mongodb.net/?retryWrites=true&w=majority&appName=PMS");
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