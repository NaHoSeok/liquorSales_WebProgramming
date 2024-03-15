<template>
  <v-container fluid>
    <v-card>
      <v-carousel cycle height="550" show-arrows-on-hover>

        <template v-slot:prev="{ on, attrs }">
          <v-btn color="success" v-bind="attrs" v-on="on">이전으로</v-btn>
        </template>

        <template v-slot:next="{ on, attrs }">
          <v-btn color="info" v-bind="attrs" v-on="on">다음으로</v-btn>
        </template>

        <!-- Whiskey 슬라이드 -->
        <v-carousel-item>
          <v-sheet color="transparent" height="100%" @click="goToSlide('Whiskey')">
            <v-img src="https://www.tastingtable.com/img/gallery/11-types-of-whiskey-explained/l-intro-1657456225.jpg" height="550"></v-img>
          </v-sheet>
        </v-carousel-item>

        <!-- Brandy 슬라이드 -->
        <v-carousel-item>
          <v-sheet color="transparent" height="100%" @click="goToSlide('Brandy')">
            <v-img src="https://prestigehaus.com/media/magefan_blog/best-budget-brandy-for-cooking-sipping-mixing-and-gifting.jpg" height="550"></v-img>
          </v-sheet>
        </v-carousel-item>

        <!-- Rum 슬라이드 -->
        <v-carousel-item>
          <v-sheet color="transparent" height="100%" @click="goToSlide('Rum')">
            <v-img src="https://www.omynara.com/wp-content/uploads/2018/12/RUM.jpg" height="550"></v-img>
          </v-sheet>
        </v-carousel-item>

        <!-- Vodka 슬라이드 -->
        <v-carousel-item>
          <v-sheet color="transparent" height="100%" @click="goToSlide('Vodka')">
            <v-img src="https://shopsk.com/cdn/shop/articles/Vodka-Mob.jpg?v=1685031048" height="550"></v-img>
          </v-sheet>
        </v-carousel-item>

      </v-carousel>
    </v-card>
    <v-row justify="center" class="mt-4">
        <v-col cols="12" md="8">
          <v-alert @click="goToEventPage" v-if="eventOccurred" type="success" outlined>{{ eventName }} !!클릭!!</v-alert>
        </v-col>
      </v-row>
  </v-container>
</template>


<script>
export default {
  data() {
    return {
      eventOccurred: false,
      eventName: '',
    };
  },
  mounted() {
    // 로그인 시 3초마다 triggerEvent 메서드 호출
    setInterval(() => {
      this.triggerEvent('이벤트가 발생했습니다.');
    }, 3000);
  },
  methods: {
    goToSlide(slide) {
      // 클릭한 슬라이드에 해당하는 경로로 이동
      this.$router.push(`/${slide.toLowerCase()}`);
    },
    triggerEvent(eventName) {
      this.eventOccurred = !this.eventOccurred;
      this.eventName = eventName;
    },
    goToEventPage() {
      // 이벤트 페이지로 이동
      this.$router.push('./event');
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100%;
}

.v-image__image {
  object-fit: cover;
}

.v-card {
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.v-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.my-6 {
  margin-top: 6rem;
  margin-bottom: 6rem;
}
</style>