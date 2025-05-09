const express = require('express')
const app = express();
const { Router } = express
const userRouter = Router()
const bodyParser = require('body-parser')

const jwt = require("jsonwebtoken")
const { JWT_USER_SECRET } = require("../config");


const bcrypt = require("bcrypt")
const { z } = require("zod")

const { UserModel, PurchasesModel } = require("../db.js")
const { auth } = require("../middleware/userMw.js")

app.use(express.json());

userRouter.post('/signup', async function (req, res) {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    //console.log(email, firstName, lastName, password)

    const requiredBody = z.object({
        email: z.string().min(3).max(100),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100),
        password: z.string().min(3).max(30)
    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        })
        return
    }

    const hashedpassword = await bcrypt.hash(password, 5)

    try {
        await UserModel.create({
            email,
            password: hashedpassword,
            firstName,
            lastName
        });

        res.json({ message: "You are signed up" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
userRouter.post('/signin', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
    });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (user && passwordMatch) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_USER_SECRET)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credits"
        })
    }
})




userRouter.get('/purchases', auth,async function (req, res) {
    try {
        const courses = await PurchasesModel.find({userId:req.userId})
        res.json({ courses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


module.exports = { userRouter }