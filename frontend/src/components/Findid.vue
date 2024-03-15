<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="5">
                <v-card>
                    <v-card-title class="text-center">아이디 찾기</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="findId">
                            <v-text-field v-model="name" label="사용자 이름" required></v-text-field>
                            <v-text-field v-model="email" label="이메일" required></v-text-field>
                            <v-btn type="submit" color="primary" class="loginSize">아이디 찾기</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 추가: 아이디 찾기 결과를 나타내는 다이얼로그 -->
        <v-dialog v-model="dialog" persistent max-width="300px">
            <v-card>
                <v-card-title class="text-h5">검색된 사용자 ID:</v-card-title>
                <v-card-text>
                    <v-row v-if="foundId">
                    <v-card-title> <B>{{ foundId }}</B></v-card-title>
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
            email: '',
            foundId: '',
            dialog: false, // 다이얼로그 열림/닫힘 여부
        };
    },
    methods: {
        async findId() {
            try {
                const response = await this.$axios.post('http://localhost:8000/findid', {
                    name: this.name,
                    email: this.email,
                });

                this.foundId = response.data.id;
                console.log('찾아진 아이디:', this.foundId);

                // 다이얼로그 열기
                this.dialog = true;
            } catch (error) {
                alert('아이디 찾기 실패');
                console.error('아이디 찾기 실패:', error.response.data.message);
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