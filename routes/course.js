const express = require('express')
const app =express()
const { Router } = express
const courseRouter = Router()

app.use(express.json())
const {auth} =require("../middleware/userMw.js")

const { PurchasesModel ,CourseModel } = require("../db.js")

courseRouter.post('/purchase', auth, async function (req, res) {
    const {courseId}=req.body
    const userId = req.userId


    try {
        await PurchasesModel.create({
            userId,
            courseId
        })
        res.json({ message: "You added course" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }

 })
courseRouter.get('/preview',async function (req, res) { 

    try {
        const course= await CourseModel.find({})
        res.json({ course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})


module.exports = { courseRouter }