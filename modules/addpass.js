const mongoose = require('mongoose');
mongoose.connect("//add ur own mongo name&pass url");
const mongoosePaginate = require('mongoose-paginate-v2');
// var conn =mongoose.Collection;
var addpass =new mongoose.Schema({
    addpasscateg: {type:String, 
        required: true,
        index: {
            unique: true,        
        }},
        addprojname: {type:String, 
            required: true,
        },
        addpassdetail: {type:String, 
            required: true,
        },
    date:{
        type: Date, 
        default: Date.now }
});
addpass.plugin(mongoosePaginate);
var addpassModel = mongoose.model('addpassdet', addpass);
module.exports=addpassModel;
