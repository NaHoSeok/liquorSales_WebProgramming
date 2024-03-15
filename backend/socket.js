const SocketIO = require("socket.io");
const Participant = require('./participant.model');

module.exports = (server) => {
    const io = SocketIO(server, {
        path: "/socket.io",
        cors: {
            origin: 'http://localhost:8080',
            method: ["GET", "PUT", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('클라이언트가 연결되었습니다:', socket.id);

        // 클라이언트에서 이벤트 참여 요청을 받음
        socket.on('participateEvent', async (data) => {
            try {
                // 참여자 정보를 MongoDB에 저장
                const { name, age, gender, phoneNumber } = data;
                const participant = new Participant({
                    name,
                    age,
                    gender,
                    phoneNumber,
                });

                await participant.save();

                // 데이터베이스에 저장이 완료된 후에 이벤트 참여 완료 메시지 및 참여자 목록을 전송
                const participants = await Participant.find(); // 데이터베이스에서 모든 참여자 정보 가져오기
                socket.emit('eventComplete', { message: '이벤트 참여가 완료되었습니다.', participants });
            } catch (error) {
                console.error('이벤트 참여 중 오류 발생:', error);
                socket.emit('eventError', { message: '이벤트 참여에 실패했습니다.' });
            }
        });

        // 클라이언트 연결 해제 시 처리
        socket.on('disconnect', () => {
            console.log('클라이언트가 연결 해제되었습니다:', socket.id);
        });
    });
}