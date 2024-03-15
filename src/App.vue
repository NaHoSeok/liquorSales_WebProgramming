<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-btn icon @click.stop="bDrawer = !bDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-toolbar-title style="display: flex; align-items: center;">
        <router-link to="/"><img :src="require('@/assets/ice.png')" style="height: 30px;"></router-link>
        <b><router-link to="/" class="black--text no-underline">HS Liquor Store</router-link></b>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">홈</v-btn>
      <v-btn v-show="!authenticated" text to="/login" color="black">로그인</v-btn>
      <v-btn v-show="!authenticated" text to="/signup">회원가입</v-btn>
      <v-btn v-show="authenticated" @click.prevent="logout" color="red">로그아웃</v-btn>
    </v-app-bar>

    <v-navigation-drawer app temporary v-model="bDrawer">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-avatar>
              <img src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg">
            </v-list-item-avatar>
            <v-list-item-title class="title">{{ adminName }}</v-list-item-title>
            <v-list-item-title class="title" v-if="adminName === ''">로그인되지 않음</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list class="pt-3">
        <v-list-item v-for="item in items" :key="item.text" :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block v-show="!authenticated" text to="/login" style="background-color: rgb(58, 58, 255);">로그인</v-btn>
          <v-btn block v-show="authenticated" @click.prevent="logout" color="red">로그아웃</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      bDrawer: false,
      authenticated: sessionStorage.getItem('authenticated') === 'true' || false,
      adminName: "",
      items: [
        { text: '마이페이지', icon: 'mdi-account', to: '/Mypage' },
        { text: '장바구니', icon: 'mdi-cart', to: '/Cart' },
        { text: '진행중인 이벤트', icon: 'mdi-post', to: '/Event' },
      ],
    };
  },
  created() {
    this.checkAuthenticationStatus();
    this.adminName=localStorage.getItem('name');
    this.$bus.$on('login-success', (name) => {
      this.authenticated = true;
      console.log('이름',name);
      localStorage.setItem('name', name);
      this.adminName = name;
    });

    this.$bus.$on('logout-success', async () => {
      this.authenticated = false;
    });

  },

  computed: {
    shouldShowAuthButtons() {
      return !this.authenticated;
    },
  },
  methods: {
    async checkAuthenticationStatus() {
      try {
        const response = await this.$axios.get('http://localhost:8000/check-auth', {
          withCredentials: true,
        });

        if (response.data.authenticated) {
          // 서버에서 사용자가 인증되었다고 알려주면 UI를 업데이트합니다.
          this.authenticated = true;
          this.adminName = response.data.username;
          // 사용자의 이름을 서버에서 가져와서 adminName을 설정

        } else {
          // 인증되지 않았다면 UI를 업데이트합니다.
          this.authenticated = false;
          this.adminName = "";
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      }
    },

    async logout() {
      try {
        await this.$axios.post('http://localhost:8000/logout', {}, {
          withCredentials: true,
        });
        console.log('로그아웃 성공');
        alert('로그아웃 성공');
        // 로그아웃 성공 시 sessionStorage에서 상태를 업데이트합니다.
        sessionStorage.setItem('authenticated', 'false');
        this.authenticated = false;
        this.adminName = "";
        this.$router.push('/');
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    },
  },
};
</script>

<style scoped>
.no-underline {
  text-decoration: none;

}

.v-btn {
  font-weight: bold;
}

.title {
  text-align: center;
}
</style>