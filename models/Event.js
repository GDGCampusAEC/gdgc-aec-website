import mongoose from "mongoose"

const eventSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    longDescription:{
        type:String,
        required:true
    },
    poster:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    }
}, { timestamps: true })

const Event=mongoose.models.Event || mongoose.model('Event',eventSchema);

export default Event;