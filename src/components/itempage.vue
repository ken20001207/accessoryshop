<template>
  <!-- container -->
  <el-row type="flex" justify="center" style="margin-top: 120px">
    <el-col :span="12">
      <el-row>
        <el-col :span="10">
          <img :src="'./images/' + item.id + '.jpg'" class="image" style="width: 100%" />
        </el-col>
        <el-col :span="10" :offset="2">
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <p>NT$ {{ item.price}}</p>
          <div style="margin-top: 80px">
            <el-select v-model="option" placeholder="商品選項">
              <el-option v-for="opt in item.options" :key="opt" :value="opt">{{ opt }}</el-option>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <el-input-number v-model="num" :min="1" label="購買數量"></el-input-number>
          </div>
          <div style="margin-top: 10px">
            <el-button @click="additem()">加入購物車</el-button>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <img
          v-for="i in item.imgcount"
          :key="i"
          :src="'./images/' + item.id + '-' + i + '.jpg'"
          class="image"
          style="width: 100%"
        />
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
export default {
  name: "itempage",
  props: ["shoppingCart"],
  created() {
    // 取得當前頁面顯示的商品
    axios({
      method: "get",
      url: "http://localhost:3000/item/" + this.$route.params.itemid
    })
      .then(res => {
        this.item = res.data;
        this.item.options = JSON.parse(this.item.options);

        // 預設商品選項
        this.option = this.item.options[0];
      })
      .catch(function(error) {
        this.$notify.error({
          title: "發生錯誤",
          message: "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error
        });
      });
  },
  data() {
    return {
      num: 1,
      option: "",
      item: {}
    };
  },
  methods: {
    additem() {
      this.$store.commit("additem", {
        item: this.item,
        num: this.num,
        option: this.option
      });
      this.$notify({
        title: "成功加入購物車!",
        message:
          "你已經加入了" +
          this.num +
          "個" +
          this.item.name +
          "(" +
          this.option +
          ")到購物車囉!",
        type: "success",
        position: "bottom-right"
      });
    }
  },
  watch: {
    $route() {
      // 取得當前頁面顯示的商品
      axios({
        method: "get",
        url: "http://localhost:3000/item/" + this.$route.params.itemid
      })
        .then(res => {
          this.item = res.data;
          this.item.options = JSON.parse(this.item.options);

          // 預設商品選項
          this.option = this.item.options[0];
        })
        .catch(function(error) {
          this.$notify.error({
            title: "發生錯誤",
            message: "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error,
            position: "bottom-right"
          });
        });
    }
  }
};
</script>