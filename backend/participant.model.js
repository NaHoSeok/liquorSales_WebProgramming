// MongoDB 모델 정의
const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({ // 이벤트 참여자 정보를 담은 스키마
    name: { type: String },
    age: { type: String },
    gender: { type: String },
    phoneNumber: { type: Number },
});

module.exports = mongoose.model('Participant', ParticipantSchema);