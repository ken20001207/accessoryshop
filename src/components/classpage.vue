<template>
  <div style="text-align: center">
    <!-- 橫幅 -->
    <el-image src="/images/cover.PNG" style="width: 100%"></el-image>

    <!-- 商品區塊 -->
    <div>
      <p style="margin-top: 60px; margin-bottom: 30px">{{ this.class.name}}</p>
      <el-row type="flex" justify="center">
        <itemcard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @click.native="$router.push('/itempage/' + item.id)"
        ></itemcard>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config.js";
import itemcard from "./itemcard.vue";
export default {
  name: "classpage",
  components: { itemcard },
  data() {
    return {
      class: {},
      items: []
    };
  },
  created() {
    // 取得當前頁面顯示的類別
    axios({
      method: "get",
      url: host + "/class/" + this.$route.params.classid
    })
      .then(res => {
        this.class = res.data;
        // 取得該類別的商品
        axios({
          method: "get",
          url: host + "/itemsbyclass/" + this.class.id
        })
          .then(res => {
            this.items = JSON.parse("[" + res.data + "]");
          })
          .catch(function(error) {
            this.$notify.error({
              title: "發生錯誤",
              message:
                "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error
            });
          });
      })
      .catch(function(error) {
        this.$notify.error({
          title: "發生錯誤",
          message: "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error
        });
      });
  },
  watch: {
    $route() {
      // 取得當前頁面顯示的類別
      axios({
        method: "get",
        url: host + "/class/" + this.$route.params.classid
      })
        .then(res => {
          this.class = res.data;
          // 取得該類別的商品
          axios({
            method: "get",
            url: host + "/itemsbyclass/" + this.class.id
          })
            .then(res => {
              this.items = JSON.parse("[" + res.data + "]");
            })
            .catch(function(error) {
              this.$notify.error({
                title: "發生錯誤",
                message:
                  "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error
              });
            });
        })
        .catch(function(error) {
          this.$notify.error({
            title: "發生錯誤",
            message: "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error
          });
        });
    }
  }
};
</script>