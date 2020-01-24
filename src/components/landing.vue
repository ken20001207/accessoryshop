<template>
  <div style="text-align: center">

    <!-- 首頁橫幅 -->
    <el-image class="banner" src="/images/cover.PNG" style="width: 100%"></el-image>

    <!-- 主打商品區塊 -->
    <div>
      <p style="margin-top: 60px; margin-bottom: 30px">主打商品</p>
      <el-row>
        <itemcard
          v-for="item in flagClassItems"
          :key="item.id"
          :item="item"
          @click.native="$router.push('/itempage/' + item.id)"
        ></itemcard>
      </el-row>
    </div>

    <!-- 廣告圖片區塊 -->
    <el-row type="flex" justify="center">
      <el-image src="/images/cover2.PNG" class="adimg"></el-image>
    </el-row>
  </div>
</template>

<script>
import config from "../config.js";
import axios from "axios";
import itemcard from "./itemcard.vue";
export default {
  name: "landing",
  components: { itemcard },
  data() {
    return {
      flagclass: 0,
      flagClassItems: []
    };
  },
  created() {
    const vm = this;
    // 取得當前主打商品類別
    axios({ method: "get", url: config.host + "/flagclass" })
      .then(res => {
        this.flagclass = res.data;
        // 取得主打類別的商品
        axios({
          method: "get",
          url: config.host + "/itemsbyclass/" + this.flagclass
        })
          .then(res => {
            this.flagClassItems = JSON.parse("[" + res.data + "]");
          })
          .catch(function(error) {
            vm.$notify.error({
              title: "發生錯誤",
              message:
                "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error,
              position: "bottom-right"
            });
          });
      })
      .catch(function(error) {
        vm.$notify.error({
          title: "發生錯誤",
          message: "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error,
          position: "bottom-right"
        });
      });
  }
};
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .banner {
    margin-top: 80px;
  }
  .adimg {
    width: 100%;
    margin-top: 60px;
  }
}

@media only screen and (min-width: 600px) {
  .adimg {
    width: 80%;
  }
}
</style>