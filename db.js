const mongoose=require("mongoose");

const Schema=mongoose.Schema;
const ObjectId=Schema.ObjectId;


const User=new Schema({
    email:{type:String,unique:true},
    firstName:String,
    lastName:String,
    password:String,
})


const Admin=new Schema({
    email:{type:String,unique:true},
    firstName:String,
    lastName:String,
    password:String,
})


const Course=new Schema({
    title:String,
    description:String,
    price:String,
    imageURL:String,
    creatorId:ObjectId
})


const Purchase = new Schema({
    courseId: { type: ObjectId, ref: 'courses' },
    userId: { type: ObjectId, ref: 'users' }
})

const UserModel=mongoose.model('users',User);
const AdminModel=mongoose.model('admins',Admin);
const CourseModel=mongoose.model('courses',Course);
const PurchasesModel=mongoose.model('purchases',Purchase);

module.exports={
    UserModel,
    AdminModel,
    CourseModel,
    PurchasesModel
}