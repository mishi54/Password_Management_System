const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://mishi121006:DytUfZMXpeL2S6U0@pms.wsnlr.mongodb.net/?retryWrites=true&w=majority&appName=PMS");
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