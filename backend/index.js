const http = require('http');   // socket.io 서버를 올리기 위해 필요
const express = require('express');
const cors = require('cors');
const app = express();      //express app 생성
const webSocket = require('./socket.js');

// const userController = require('./user.controller.js');


app.use(express.json());  //json 형식 파싱하기
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true, // Access-Control-Allow-Credentials 헤더를 true로 설정
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
}
)); //cors 적용

const dbconfig = require("./db.js");
const mongoose = require('mongoose');
//데이터베이스 연결 및 상태 로깅
mongoose.connect(dbconfig.url, { useNewUrlParser:true})
.then( () => {
    console.log("정상적으로 MongoDB 서버에 연결되었습니다.");
}).catch( err => {
    console.log("MongoDB에 연결되지 않았습니다.", err);
});

require('./passport-session')(app);
require('./route.js')(app);


var port = process.env.PORT || 8000;  //서버 포트(port) 설정

//클라이언트로부터 요청 듣기
const server = app.listen(port, () => {
    console.log(port, '번 포트에서 서버 실행 중 ..')
});
webSocket(server); // ws와 http 포트 공유

