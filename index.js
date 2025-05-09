const express = require('express')

const app = express()
const cors=require('cors')
app.use(cors({
  origin: 'http://localhost:5173'
}))

const dotenv=require('dotenv')
dotenv.config();

const mongoose = require("mongoose");

app.use(express.json())

const {userRouter}=require("./routes/user.js")
const {adminRouter}=require("./routes/admin.js")
const {courseRouter}=require("./routes/course.js")


app.use("/user",userRouter)
app.use("/courses",courseRouter)
app.use("/admin",adminRouter)


async function main(){
  await mongoose.connect(process.env.MONGO_URL)
  console.log("connected to db")
  
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
}
main()
