<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                <h1>마이페이지</h1>
            </v-col>
        </v-row>
        <br>

        <!-- 비밀번호 변경 다이얼로그 -->
        <v-card>
            <v-card-title>비밀번호 변경</v-card-title>
            <v-card-text>
                <p>회원님의 기존 비밀번호를 입력하고 신규 비밀번호를 작성해주세요.</p>
                <v-btn @click="passwordDialog = true" color="primary">비밀번호 변경</v-btn>
            </v-card-text>
        </v-card>
        <v-dialog v-model="passwordDialog" max-width="500">
            <v-card>
                <v-card-title>비밀번호 변경</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="changePassword">
                        <v-text-field v-model="password.oldPassword" label="현재 비밀번호" type="password"></v-text-field>
                        <v-text-field v-model="password.newPassword" label="새로운 비밀번호" type="password"></v-text-field>
                        <v-text-field v-model="password.confirmPassword" label="비밀번호 확인" type="password"></v-text-field>
                        <v-btn type="submit" color="primary">비밀번호 변경</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <br>

        <!-- 개인정보 수정 다이얼로그 -->

        <v-card>
            <v-card-title>개인정보 수정</v-card-title>
            <v-card-text>
                <p>회원님의 성명, e-mail, 전화번호를 수정할 수 있습니다.</p>
                <v-btn @click="profileDialog = true" color="primary">개인정보 수정</v-btn>
            </v-card-text>
        </v-card>
        <v-dialog v-model="profileDialog" max-width="500">
            <v-card>
                <v-card-title>개인정보 수정</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="updateProfile">
                        <v-text-field v-model="user.name" label="이름"></v-text-field>
                        <v-text-field v-model="user.email" label="이메일"></v-text-field>
                        <v-text-field v-model="user.phone" label="전화번호"></v-text-field>
                        <v-btn type="submit" color="primary">정보 수정</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <br>
        <!-- 회원 탈퇴 섹션 -->
        <v-card>
            <v-card-title>회원 탈퇴</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="deleteAccount">
                    <p>회원 탈퇴를 하시면 계정이 영구적으로 삭제됩니다. 이 작업은 취소할 수 없습니다.</p>
                    <v-btn type="submit" color="red">회원 탈퇴</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>
  
<script>
export default {
    data() {
        return {
            passwordDialog: false,
            profileDialog: false,
            password: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            user: {
                name: null,
                email: null,
                phone: null,
            },
        };
    },
    methods: {
        async changePassword() {
            try {
                const response = await this.$axios.put('http://localhost:8000/updatepw', this.password, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log(response);
                alert('비밀번호가 변경되었습니다.');
                this.passwordDialog = false; // 다이얼로그 닫기
            } catch (e) {
                console.log(e);
                alert('비밀번호 변경에 실패했습니다.');
            }
        },
        async updateProfile() {
            // 값을 무조건 넣게하기
            try {
                const response = await this.$axios.put('http://localhost:8000/updateuser', this.user, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log(response);
                alert('개인정보가 수정되었습니다.');
                this.profileDialog = false; // 다이얼로그 닫기
            } catch (e) {
                console.log(e);
                alert('개인정보 수정에 실패했습니다.');
            }
        },
        async deleteAccount() {
            try {
                // 로컬 스토리지에서 사용자 정보를 제거합니다.
                const response = await this.$axios.delete('http://localhost:8000/deleteuser', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log(response);
                const res = await this.$axios.post('http://localhost:8000/logout', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log(res);
                this.$bus.$emit('logout-success');

                alert('회원 탈퇴가 완료되었습니다.');

                this.$router.push('/');
            } catch (e) {
                console.log(e);
                alert('회원 탈퇴에 실패했습니다.');
            }
        },
    },
};
</script>