const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true
    },
    role: {
      type: String,
    //   enum: ['user', 'admin', 'editor'], // Specify the allowed values for the role field
      default: 'user',
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      select:false
    },
    phoneNumber:{
        type:String,
        required:true
    },
    orders:{
        type:Array,
    },
    cart:{
        type:Array
    },
    image:{
        type:String,
        default:""
    }
  }, { timestamps: true });
  
const User = mongoose.model("user",userSchema)
module.exports =  User;