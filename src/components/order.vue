<template>
  <!-- container -->
  <el-row type="flex" justify="center" style="margin-top: 120px">
    <el-col :span="16">
      <h2>訂單詳情: # {{ this.id }}</h2>
      <el-tag type="danger">請記下您的訂單編號，未來需要使用訂單編號來查詢進度喔!</el-tag>
      <el-steps
        align-center
        :space="400"
        :active="this.status"
        finish-status="success"
        style="margin: 60px"
      >
        <el-step title="建立" description="訂單已經成功被建立"></el-step>
        <el-step title="付款" description="從下方選擇付款方式進行付款"></el-step>
        <el-step title="出貨" description="商家確認付款成功後會盡快出貨!"></el-step>
      </el-steps>
      <h2>訂購商品</h2>
      <el-table :data="order">
        <el-table-column width="100px">
          <template slot-scope="scope">
            <img :src="'/images/' + scope.row.id + '.jpg'" class="image" style="width: 80px" />
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <p>{{ scope.row.name}}</p>
            <p>{{ scope.row.option}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="數量"></el-table-column>
        <el-table-column prop="price" label="單價"></el-table-column>
        <el-table-column prop="sumprice" label="合計"></el-table-column>
      </el-table>
      <h4 style="float: right">商品總金額 NT$ {{ this.sumprice }}</h4>
      <h2>寄送資訊</h2>
      <div class="deliveryInfo">
        <el-row>
          <el-col :span="5">
            <el-select v-model="delivery" placeholder="寄送方式">
              <el-option label="全家超商取貨 60元" value="全家超商取貨 60元"></el-option>
              <el-option label="統一超商取貨 60元" value="統一超商取貨 60元"></el-option>
              <el-option label="黑貓宅急便 80元" value="黑貓宅急便 80元"></el-option>
              <el-option label="中華郵政 40元" value="中華郵政 40元"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            <el-input v-model="delivery_info" placeholder="寄送地址或收件超商店名"></el-input>
          </el-col>
          <el-col :offset="1" :span="2">
            <el-button type="primary" @click="updateDelivery()">保存</el-button>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
export default {
  name: "orderpage",
  data() {
    return {
      order: [],
      sumprice: 0,
      id: 0,
      status: 0,
      delivery: "",
      delivery_info: ""
    };
  },
  methods: {
    updateDelivery() {
      const vm = this;
      axios({
        method: "post",
        url: "http://localhost:3000/updateDelivery/",
        data: {
          id: this.id,
          delivery: this.delivery,
          delivery_info: this.delivery_info
        }
      })
        .then(() => {
          vm.$notify.success({
            title: "保存成功!",
            message:
              "您新的寄送地址已保存成功，付款確認後您的商品會寄送到這個地址。",
            position: "bottom-right"
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
  },
  created() {
    const vm = this;
    // 取得當前頁面顯示的訂單
    this.id = this.$route.params.orderid;
    axios({
      method: "get",
      url: "http://localhost:3000/order/" + this.$route.params.orderid
    })
      .then(res => {
        this.order = JSON.parse(res.data.data);
        this.sumprice = res.data.sumprice;
        this.status = res.data.statusCode;
        this.delivery = res.data.delivery;
        this.delivery_info = res.data.delivery_info;
      })
      .catch(function(error) {
        if (error.response.status == 404) {
          vm.$router.push("/");
          alert("該訂單不存在，請再次確認您的訂單編號。");
        } else {
          vm.$notify.error({
            title: "系統發生了一項錯誤!",
            message: error,
            position: "bottom-right"
          });
        }
      });
  }
};
</script>

<style scoped>
.deliveryInfo {
  width: 100%;
  height: 400px;
  margin-top: 40px;
}
h2 {
  margin-top: 60px;
}
</style>