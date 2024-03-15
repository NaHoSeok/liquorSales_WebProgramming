<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="5">
                <v-card>
                    <v-card-title class="text-center">비밀번호 찾기</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="findPassword">
                            <v-text-field v-model="name" label="사용자 이름" required></v-text-field>
                            <v-text-field v-model="username" label="ID" required></v-text-field>
                            <v-text-field v-model="phone" label="휴대폰 번호" required></v-text-field>
                            <v-btn type="submit" color="primary" class="loginSize">비밀번호 찾기</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 추가: 비밀번호 찾기 결과를 나타내는 다이얼로그 -->
        <v-dialog v-model="dialog" persistent max-width="300px">
            <v-card>
                <v-card-title class="text-h5">{{ name }}님의 Password:</v-card-title>
                <v-card-text>
                    <v-row v-if="foundPassword">
                        <v-card-title><B>{{ foundPassword }}</B></v-card-title>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="closeDialog">닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            username: '',
            phone: '',
            foundPassword: '',
            dialog: false, // 다이얼로그 열림/닫힘 여부
        };
    },
    methods: {
        async findPassword() {
            try {
                const response = await this.$axios.post('http://localhost:8000/findpw', {
                    name: this.name,
                    username: this.username,
                    phone: this.phone,
                });

                this.foundPassword = response.data.password;
                console.log('찾은 비밀번호:', this.foundPassword);

                // 다이얼로그 열기
                this.dialog = true;
            } catch (error) {
                alert('비밀번호 찾기 실패');
                console.error('비밀번호 찾기 실패:', error.response.data.message);
            }
        },
        closeDialog() {
            // 다이얼로그 닫기
            this.dialog = false;
        },
    },
};
</script>

<style scoped>
.loginSize {
    width: 100%;
}
</style>