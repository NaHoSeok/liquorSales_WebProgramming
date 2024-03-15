<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" sm="8" md="5">
                        <v-card>
                            <v-card-title class="text-center">로그인</v-card-title>

                            <v-card-text>
                                <v-form @submit.prevent="login">
                                    <v-text-field v-model="username" label="사용자 ID" required></v-text-field>
                                    <v-text-field v-model="password" label="비밀번호" type="password" required></v-text-field>
                                    <v-btn type="submit" color="primary" class="loginSize">로그인</v-btn>
                                    <v-row>
                                        <router-link to="/signup">
                                            <v-btn text color="primary" class="small-button">회원가입</v-btn>
                                        </router-link>
                                        <v-spacer></v-spacer>
                                        <router-link to="/findid">
                                            <v-btn text color="primary" class="small-button">아이디 찾기</v-btn>
                                        </router-link>
                                        <router-link to="/findpw">
                                            <v-btn text color="primary" class="small-button">비밀번호 찾기</v-btn>
                                        </router-link>
                                    </v-row>
                                </v-form>
                            </v-card-text>
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
            username: '',
            password: '',
        };
    },
    methods: {
        async login() {
            const userData = {
                username: this.username,
                password: this.password,
            };
            console.log('Login data:', userData);  // 확인용 로그 추가

            try {
                const response = await this.$axios.post('http://localhost:8000/login', userData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log(response);
                const name  = response.data.user.name;
                this.$bus.$emit('login-success', name); // 사용자 이름을 이벤트 버스로 전달
                alert('로그인 성공');
                this.$router.push('/');
            } catch (error) {
                alert('로그인 실패');
                console.error('Login failed:', error.response.data.error);
            }
        },
    }
};
</script>

<style scoped>
.loginSize {
    width: 100%;
}

.small-button {
    font-size: 12px;
    margin-top: 20px;
}
</style>