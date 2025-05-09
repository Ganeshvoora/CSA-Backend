const express = require('express')
const app=express()
const { Router } = express
const adminRouter = Router()



const jwt = require("jsonwebtoken")
const {JWT_ADMIN_SECRET} = require("../config");


const bcrypt = require("bcrypt")
const { z } = require("zod")

const { AdminModel,CourseModel,PurchasesModel } = require("../db.js")
const {auth} =require("../middleware/adminMw.js")


app.use(express.json())


adminRouter.post('/signup', async function (req, res) {
    const requiredBody = z.object({
        email: z.string().min(3).max(100),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100),
        password: z.string().min(3).max(30)
    })

   

    // const parsedData = requiredBody.parse(req.body)
    const parsedDataWithSuccess = requiredBody.safeParse(req.body)

    if (!parsedDataWithSuccess) {
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        })
        return
    }

    const {email,password,firstName,lastName} = req.body;

    const hashedpassword = await bcrypt.hash(password, 5)

    try {
        await AdminModel.create({
            email,
            password: hashedpassword,
            firstName,
            lastName
        });

        res.json({ message: "You are signed up" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error",error: err });
    }
})
adminRouter.post('/signin', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const admin = await AdminModel.findOne({
        email: email
    });
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (admin && passwordMatch) {
        const token = jwt.sign({
            id: admin._id.toString()
        }, JWT_ADMIN_SECRET)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credits"
        })
    }
})



adminRouter.post('/course',auth,async function (req, res) {
    const {title, description, price, imageURL}=req.body
    const creatorId=req.adminId


    try {
        await CourseModel.create({
            title,
            description,
            price,
            imageURL,
            creatorId
        })
        res.json({ message: "You added course" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" ,error:err});
    }

    
 })
adminRouter.put('/course',auth,async function (req, res) { 
    const creatorId=req.adminId
    const {title, description, price, imageURL,courseId}=req.body


    try {
        await CourseModel.updateOne({
            _id:courseId,
            creatorId
        },{
            title,
            description,
            price,
            imageURL,
            creatorId
        })
        res.json({ message: "You updated course" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error",error: err });
    }
})
adminRouter.get('/course/bulk', auth,async function (req, res) {
    try {
        courses=await CourseModel.find({
            creatorId:req.adminId
        })
        res.json({ message: "You added course" ,courses});
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" ,error:err});
    }
 })



module.exports = { adminRouter }