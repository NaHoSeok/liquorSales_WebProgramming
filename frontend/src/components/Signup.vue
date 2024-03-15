<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" sm="8" md="6">
                        <v-card>
                            <v-card-title class="text-center">회원가입</v-card-title>
                            <v-form class="container">
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="userInfo.name" label="Name"
                                            placeholder="Name"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="userInfo.id" label="ID" placeholder="ID"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="userInfo.password" label="비밀번호" placeholder="비밀번호"
                                            type="password"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="userInfo.confirmPassword" label="비밀번호 확인"
                                            placeholder="비밀번호 확인" type="password"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="userInfo.phoneNumber" label="휴대폰 번호"
                                            placeholder="전화번호(010xxxxxxxx)"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="userInfo.email" label="e-mail"
                                            placeholder="e-mail"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-btn class="joinbtn" @click="handleJoin" style="border-radius: 20px;">회원가입</v-btn>
                                    </v-col>
                                </v-row>
                                <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
                                    {{ snackbar.text }}

                                    <template v-slot:action="{ attrs }">
                                        <v-btn
                                            text
                                            v-bind="attrs"
                                            @click="snackbarclose()"
                                        >
                                            Close
                                        </v-btn>
                                    </template>
                                </v-snackbar>
                            </v-form>

                            <!-- 추가된 부분: 만 19세 이상 확인 다이얼로그 -->
                            <v-dialog v-model="showAgeConfirmation" persistent max-width="300">
                                <v-card>
                                    <v-card-title class="text-h6">만 19세 이상이신가요?</v-card-title>
                                    <v-card-actions class="justify-center">
                                        <v-btn @click="confirmAge(true)" class="confirm-btn">네</v-btn>
                                        <v-btn @click="confirmAge(false)" class="confirm-btn">아니오</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
  
<script>
export default {
    data() {
        return {
            allAgree: false,
            agreements: {
                personal: false,
                personalInfo: false,
                emailMarketing: false,
                smsMarketing: false,
            },
            userInfo: {
                name: '',
                id: '',
                password: '',
                confirmPassword: '',
                phoneNumber: '',
                email: '',
            },
            snackbar: { 
                show: false,
                text: '회원가입 성공!',
                color: 'success',
                timeout: 5000,  // 5초 동안 보여준 후 자동으로 사라짐
            },
            showAgeConfirmation: false,
        };
    },
    methods: {
        async handleJoin() {
            // 여기에서 입력된 정보를 서버로 전송
            try {
                // 추가: 만 19세 이상 확인 다이얼로그 표시
                this.showAgeConfirmation = true;
            } catch (error) {
                console.error(error);
                // 여기에서 오류 처리를 할 수 있습니다.
            }
        },

        confirmAge(isOver18) {
            if (isOver18) {
                // 만 18세 이상이면 서버로 회원가입 정보 전송
                this.sendSignUpData();
                this.showAgeConfirmation = false;
                // v-card 닫기
            } else {
                // 만 18세 미만이면 처리 (예: 경고 메시지 표시)
                console.log('만 19세 미만입니다.');
                // 처리 후 다시 초기화
                this.showAgeConfirmation = false;
            }
        },
        snackbarclose(){
            this.snackbar.show = false;
            this.$router.push('/login');
        },
        async sendSignUpData() {
            try {
                // 클라이언트에서 회원가입 정보를 추출
                const { name, id, password, phoneNumber, email } = this.userInfo;

                // 서버로 회원가입 정보를 전송
                const response = await this.$axios.post('http://localhost:8000/signup', {
                    name,
                    id,
                    password,
                    phoneNumber,
                    email,
                });
                this.showSnackbar('회원가입 성공!', 'success');
                console.log(response.data.message); // 성공 메시지 출력

                
            } catch (error) {
                console.error(error);
            }
        },
        showSnackbar(text, color) {
            this.snackbar.text = text;
            this.snackbar.color = color;
            this.snackbar.show = true;
        },
    }
};
</script>
  
<style scoped>
.joinbtn {
    width: 100%;
    border-radius: 20px;
}
</style>