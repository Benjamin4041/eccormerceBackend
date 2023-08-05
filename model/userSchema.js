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
      required: true,
      unique: true,
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
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png?w=1060&t=st=1689683784~exp=1689684384~hmac=257cd0d92df499c94e425d0b6423b8ad81cc6168c07d05ab9bb9d8b9f77948c7"
    },
    address:{
      type:Array,
    }
  }, { timestamps: true });
  
const User = mongoose.model("user",userSchema)
module.exports =  User;