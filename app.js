const express = require('express')
const app = express()

app.listen(7777)


const userRouter = require('./routes/users')     //users.js 소환
const channelRouter = require('./routes/channels')     //channels소환


app.use("/", userRouter)
app.use("/channels", channelRouter)  //공통된 url 뽑아주기
//      /channels/~로 시작
