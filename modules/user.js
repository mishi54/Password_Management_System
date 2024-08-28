const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://mishi121006:DytUfZMXpeL2S6U0@pms.wsnlr.mongodb.net/?retryWrites=true&w=majority&appName=PMS");
// var conn =mongoose.Collection;
var userSchema =new mongoose.Schema({
    username: {type:String, 
        required: true,
        index: {
            unique: true,        
        }},

	email: {
        type:String, 
        required: true,
        index: {
            unique: true, 
        },},
    password: {
        type:String, 
        required: true
    },
    date:{
        type: Date, 
        default: Date.now }
});

var userModel = mongoose.model('users', userSchema);
module.exports=userModel;