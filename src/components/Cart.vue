<template>
    <div>
        <v-container>
            <v-row class="text-center">
                <v-col cols="12">
                    <h1>장바구니 페이지</h1>
                </v-col>
            </v-row>
        </v-container>

        <!-- 모두 선택 버튼 -->
        <v-container>
            <v-row class="text-right">
                <v-col cols="2">
                    <v-btn @click="selectAllItems()" color="primary">
                        {{ cartItems.every(item => item.selected) ? '모두 해제' : '모두 선택' }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
            <v-list>
                <v-list-item-group v-if="cartItems.length > 0">
                    <v-list-item v-for="(item, index) in cartItems" :key="index">
                        <v-row class="cart-item" align="center">
                            <v-btn @click="toggleSelection(index)" :color="item.selected ? 'info' : 'primary'">
                                {{ item.selected ? '선택 해제' : '선택' }}
                            </v-btn>
                            <v-col cols="2">
                                <v-img :src="item.image" alt="상품 이미지" class="img"></v-img>
                            </v-col>
                            <v-col cols="4">
                                <v-list-item-content>
                                    <b><v-list-item-title>{{ item.title }}</v-list-item-title></b>
                                    <v-list-item-title>가격: {{ item.lprice }}원</v-list-item-title>
                                    <v-list-item-title> 수량: {{ item.quantity }}</v-list-item-title>
                                </v-list-item-content>
                            </v-col>
                            <v-col cols="3">
                                <v-btn @click="updateProductQuantity(item._id, item.quantity-1)" color="primary"
                                    :disabled="item.quantity <= 1">-</v-btn>
                                <v-btn @click="updateProductQuantity(item._id, item.quantity+1)" color="primary">+</v-btn>
                            </v-col>
                            <v-col cols="1">
                                <v-btn @click="deleteItem(index)" color="error">삭제</v-btn>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item v-else>
                    <v-list-item-content>장바구니에 상품이 없습니다.</v-list-item-content>
                </v-list-item>
            </v-list>

            <!-- 선택한 상품 결제하기 버튼 -->
            <v-row v-if="selectedItems.length > 0">
                <v-col class="text-center" cols="12">
                    <p>Total Price: {{ calculateTotalPrice }}원</p>
                    <v-btn @click="checkout" color="success">선택한 상품 결제하기</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            cartItems: [],
        };
    },
    computed: {
        selectedItems() {
            return this.cartItems.filter(item => item.selected);
        },
        calculateTotalPrice() {
            return this.selectedItems.reduce((total, item) => {
                return total + item.lprice * item.quantity;
            }, 0);
        },
    },
    methods: {
        async loadProductList() {
            try {
                const response = await this.$axios.get('http://localhost:8000/products', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                this.cartItems = response.data.products;
            } catch (error) {
                console.error('상품 목록을 가져오는 중 오류 발생:', error);
            }
        },
        toggleSelection(index) {
            this.$set(this.cartItems, index, {
                ...this.cartItems[index],
                selected: !this.cartItems[index].selected,
            });
        },
        // 클라이언트에서의 상품 수량 업데이트 함수
        async updateProductQuantity(productId, newQuantity) {
        // 서버에 요청을 보내기 전에 먼저 UI에서 값을 업데이트
        const index = this.cartItems.findIndex(item => item._id === productId);
        if (index !== -1) {
            this.$set(this.cartItems, index, {
                ...this.cartItems[index],
                quantity: newQuantity,
            });
        }

        try {
            // 서버에 상품 수량 업데이트 요청 보내기
            const response = await this.$axios.put(
                'http://localhost:8000/products/update',
                {
                    productId: productId,
                    quantity: newQuantity,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            console.log(response.data); // 서버에서의 응답을 출력하거나 처리합니다.
        } catch (error) {
            console.error('상품 수량 업데이트 중 오류 발생:', error);
        }
    },
        selectAllItems() {
            // 모든 상품이 선택되어 있다면 모든 상품 선택 해제
            if (this.cartItems.every(item => item.selected)) {
                this.cartItems.forEach(item => {
                    this.$set(item, 'selected', false);
                });
                return;
            }
            // 모든 상품을 선택하는 로직
            this.cartItems.forEach(item => {
                this.$set(item, 'selected', true);
            });
        },
        async deleteItem(index) {
            try {
                const productId = this.cartItems[index]._id;

                // UI에서 즉시 삭제
                this.cartItems.splice(index, 1);
                alert('상품이 삭제되었습니다.');

                const response = await this.$axios.delete('http://localhost:8000/products/delete', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    data: { productId },
                });
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
            }
        },
        checkout() {
            alert('선택한 상품을 결제합니다.');
        },
    },
    created() {
        this.loadProductList();
    },
};
</script>

<style scoped>
.cart-item {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 8px;
    padding: 8px;
}

.cart-item v-btn {
    margin-left: auto;
}

.img {
    width: 130px;
    height: 130px;
}
</style>