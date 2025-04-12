const mongoose = require("mongoose")
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  time: {
    type: Date,
    default: null, // Use null if no date is set
  },
  mode:{
    type:String,
    enum:["Online","Offline"],
    default:"Offline"
  }
},{timestamps:true});

module.exports = mongoose.model("Appointments", bookingSchema);
