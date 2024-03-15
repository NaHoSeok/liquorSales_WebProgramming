<template>
    <v-container class="text-center mt-8">
        <v-card>
            <v-card-title class="headline">{{ eventInfo.eventName }}</v-card-title>
            <v-card-text>
                <p>{{ eventInfo.eventDescription }}</p>
                <p>
                    <strong>이벤트 기간:</strong> {{ eventInfo.eventPeriod }}
                </p>
                <p>
                    <strong>참여 방법:</strong>
                    <li>웹 페이지에서 "위스키 축제 참여 이벤트" 섹션을 찾습니다.</li>
                    <li>참여 버튼을 클릭하여 참여 폼을 작성합니다.</li>
                    <li>이름, 나이, 성별, 전화번호를 입력하고 참여합니다.</li>
                </p>
                <v-row justify="center">
                    <v-btn @click="showParticipationForm" color="primary">접수하기</v-btn>
                </v-row>
            </v-card-text>
        </v-card>

        <v-dialog v-model="participationFormVisible" max-width="500">
            <v-card>
                <v-card-title>이벤트 참여 폼</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="submitParticipationForm">
                        <v-text-field v-model="participant.name" label="이름" required outlined></v-text-field>
                        <v-text-field v-model="participant.age" label="나이" required outlined></v-text-field>
                        <v-text-field v-model="participant.gender" label="성별" required outlined></v-text-field>
                        <v-text-field v-model="participant.phoneNumber" label="휴대폰번호" required outlined></v-text-field>
                        <v-btn type="submit" color="primary" class="mt-4">참여하기</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- 참여자 목록을 테이블로 표시 -->
        <v-data-table :headers="tableHeaders" :items="participants" class="elevation-1">
            <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.age }}</td>
                <td>{{ props.item.gender }}</td>
                <td>{{ props.item.phoneNumber }}</td>
            </template>
        </v-data-table>

        <v-alert v-if="eventInfo.registrationCompleteMessage" type="success" outlined>
            {{ eventInfo.registrationCompleteMessage }}
        </v-alert>
    </v-container>
</template>
  
<script>
export default {
    data() {
        return {
            eventInfo: {
                eventName: '위스키 축제 참여 이벤트',
                eventDescription: '독특한 위스키 맛의 다양한 종류를 체험하고 싶은 분들을 대상으로 하는 이벤트입니다.',
                eventPeriod: '2023년 12월 01일부터 2024년 01월 06일까지',
                registrationCompleteMessage: '', // 이벤트 참여 완료 메시지
            },
            participationFormVisible: false,
            participant: {
                name: '',
                age: '',
                gender: '',
                phoneNumber: '',
            },
            participants: [], // 참여자 목록을 담을 배열
            tableHeaders: [
                { text: '이름', value: 'name' },
                { text: '나이', value: 'age' },
                { text: '성별', value: 'gender' },
                { text: '휴대폰번호', value: 'phoneNumber' },
            ],
        };
    },
    methods: {
        showParticipationForm() {
            this.participationFormVisible = true;
        },
        submitParticipationForm() {
            console.log('참여자 정보:', this.participant);

            // Socket.io를 사용하여 서버에 이벤트 참여 정보 전송
            this.$socket.emit('participateEvent', this.participant);

            // Socket.io를 사용하여 서버로부터 이벤트 참여 완료 메시지 및 참여자 목록 수신
            this.$socket.on('eventComplete', ({ message, participants }) => {
                // 이벤트 참여 완료 메시지를 변수에 저장하여 UI에 표시
                this.eventInfo.registrationCompleteMessage = message;

                // 참여자 목록을 업데이트
                this.participants = participants;
            });

            // 참여 폼 닫기
            this.participationFormVisible = false;
        },  
    },
};
</script>
  
<style>
.headline {
    font-size: 24px;
    font-weight: bold;
}
</style>