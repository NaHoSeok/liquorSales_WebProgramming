<template>
  <v-container>
    <v-card-title class="d-flex justify-center align-center">
      <h1>Brandy 구매 페이지</h1>
    </v-card-title>
    <v-select v-model="selectedFilter" :items="filters" label="정렬" @change="filterItems" style="width: 140px;"></v-select>
    <v-row>
      <v-col cols="4" v-for="(item, index) in items.slice(0, 9)" :key="item.product_id" class="mb-6">
        <v-card>
          <v-list-item>

            <v-list-item-content>
              <v-list-item-title><b>{{ index + 1 }}. {{ item.title }}</b></v-list-item-title>
              <br><br>
              <v-checkbox :key="item.product_id" v-model="item.selected" label="선택"
                @change="updateSelectedItems"></v-checkbox>
              <v-list-item-title><b>가격: {{ item.lprice }}</b></v-list-item-title>
              <br><br>
              <v-row justify="center" align="center" class="d-flex">
                <v-col cols="4" class="flex">
                  <v-btn small color="primary" @click="decrementQuantity(item)" :disabled="item.quantity <= 1">-</v-btn>
                </v-col>
                <v-col cols="2" class="flex">
                  <span>{{ item.quantity }}</span>
                </v-col>
                <v-col cols="4" class="flex">
                  <v-btn small color="primary" @click="incrementQuantity(item)">+</v-btn>
                </v-col>
              </v-row>
            </v-list-item-content>

            <v-list-item-avatar tile size="150" contain>
              <img :src="item.image">
            </v-list-item-avatar>
          </v-list-item>
          <v-btn color="primary" @click="addToCart(item)" :disabled="!item.selected">장바구니에 추가</v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>선택 항목</v-card-title>
      <v-card-text>
        <div v-for="item in selectedItems" :key="item.product_id">
          <!-- 선택 버튼 -->
          <v-checkbox v-model="item.selected" label="선택" @change="updateSelectedItems"></v-checkbox>

          <div>상품명: {{ item.title }}</div>
          <div>가격: {{ item.lprice }}</div>
          <div>수량: {{ item.quantity }}</div>
        </div>
        <div><b>총 가격: {{ totalPrice }}</b></div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="processPayment">결제하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      selectedFilter: '',
      filters: ['낮은 가격순', '높은 가격순'],
      selectedItems: [], // 처음에는 비워둠
      total: 0, // 처음에는 0으로 설정
    };
  },
  computed: {
    totalPrice() {
      // 선택된 상품들의 총 가격 계산
      return this.selectedItems.reduce((total, item) => total + item.lprice * item.quantity, 0);
    },
  },
  methods: {
    async addToCart(item) {
      try {
        const response = await this.$axios.get('http://localhost:8000/check-auth', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        if (response.data && response.data.authenticated !== undefined) {
          // 사용자가 로그인한 상태일 때의 처리
          const userId = response.data.userId;
          console.log('사용자가 인증되었습니다. 사용자 ID:', userId);

          // 상품 데이터 구성
          const products = {
            title: item.title,
            lprice: item.lprice,
            image: item.image,
            quantity: item.quantity,
          };

          console.log('장바구니에 추가:', products);
          // 장바구니 추가되면 선택버튼 or 장바구니 추가 버튼 비활성화
          item.selected = false;

          const cartResponse = await this.$axios.post('http://localhost:8000/cart', { products, userId }, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });

          console.log('장바구니 응답:', cartResponse.data);
          alert('장바구니에 추가되었습니다.');
        } else {
          // 사용자가 로그인되지 않은 경우 처리
          console.log('사용자가 로그인되지 않았습니다.');
          alert('로그인이 필요합니다.');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('상품 추가 중 오류 발생:', error);
        alert('로그인이 필요합니다.');
        this.$router.push('/login');
      }
    },

    incrementQuantity(item) {
      item.quantity++;
    },
    decrementQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      }
    },
    async search(query) {
      const clientId = 'kabKYZFQeXkX1x6McT2Q';
      const clientSecret = 'UJ32hWZWtc';

      try {
        const response = await this.$axios.get(
          `/v1/search/shop.json?query=${encodeURIComponent(query)}`,
          {
            headers: {
              'X-Naver-Client-Id': clientId,
              'X-Naver-Client-Secret': clientSecret,
            },
          }
        );

        // Log the entire response for debugging purposes
        console.log('API 응답:', response);

        this.items = response.data.items.map(item => ({ ...item, quantity: 1 }));
      } catch (error) {
        console.error(error);
      }
    },
    filterItems() {
      if (this.selectedFilter === '낮은 가격순') {
        this.items.sort((a, b) => a.lprice - b.lprice);
      } else if (this.selectedFilter === '높은 가격순') {
        this.items.sort((a, b) => b.lprice - a.lprice);
      }
    },
    updateSelectedItems() {
      // 선택 버튼을 누를 때마다 선택된 상품들을 업데이트
      this.selectedItems = this.items.filter(item => item.selected);
    },
    processPayment() {
      // 선택된 상품들의 결제 처리
      console.log('선택된 상품들의 결제가 완료되었습니다. 총 가격:', this.totalPrice);
      alert(this.totalPrice + '원 결제가 완료되었습니다.');
    },
  },
  created() {
    this.search('Brandy');
  },
};
</script>

<style scoped>
.item-content {
  flex-direction: column;
  align-items: center;
  /* 가운데 정렬을 위해 추가 */
}

/* 이미지 크기 조정 */
.v-list-item-avatar {
  width: 100%;
  margin: 0 auto;
  /* 가운데 정렬을 위해 추가 */
}

/* 버튼 행을 flex로 정렬 */
.d-flex {
  display: flex;
}

/* 각 버튼 컬럼을 flex로 설정 */
.flex {
  flex: 1;
}
</style>