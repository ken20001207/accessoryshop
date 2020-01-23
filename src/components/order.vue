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
      <h4 style="float: right">總金額 NT$ {{ this.sumprice }} (含運費)</h4>
      <div style="margin-top: 60px">
        <h2>寄送資訊</h2>
        <el-row>
          <el-col :span="6">
            <p>收件人</p>
            <h3>{{ this.delivery.name}}</h3>
          </el-col>
          <el-col :offset="1" :span="6">
            <p>聯繫方式</p>
            <h3>{{ this.delivery.phone}}</h3>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <p>電子郵件</p>
            <h3>{{ this.delivery.email}}</h3>
          </el-col>
          <el-col :offset="1" :span="6">
            <p>寄送方式</p>
            <h3>{{ this.delivery.way}}</h3>
          </el-col>
          <el-col :offset="1" :span="10">
            <p>收件地址</p>
            <h3>{{ this.delivery.address}}</h3>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 60px">
        <h2>付款資訊</h2>
        <div v-if="status == 1">
          <p>付款狀態 : 尚未收到付款</p>
          <el-tag type="warning">付款後可能會需要最多24個小時系統才會更新狀態喔!</el-tag>
        </div>
        <div v-if="status >= 2">
          <p>付款狀態 : 付款完成</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import config from "../config.js";
export default {
  name: "orderpage",
  data() {
    return {
      order: [],
      sumprice: 0,
      id: 0,
      status: 0,
      payform: "",
      delivery: {}
    };
  },
  created() {
    const vm = this;
    // 取得當前頁面顯示的訂單
    this.id = this.$route.params.orderid;
    axios({
      method: "get",
      url: config.host + "/order/" + this.$route.params.orderid
    })
      .then(res => {
        this.order = JSON.parse(res.data.data);
        this.sumprice = res.data.sumprice;
        this.status = res.data.statusCode;
        this.delivery = JSON.parse(res.data.delivery);
        this.payform = res.data.payform;
      })
      .catch(function(error) {
        if (error.response.status == 404) {
          vm.$notify.warning({
            title: "該訂單不存在!",
            message: "您輸入的訂單編號並不存在，請重新確認或連繫客服人員。",
            position: "bottom-right"
          });
          vm.$router.push("/");
        } else {
          vm.$notify.error({
            title: "系統發生了一項錯誤!",
            message: error,
            position: "bottom-right"
          });
          vm.$router.push("/");
        }
      });
  },
  methods: {
    gotoecpay() {
      var myWindow = window.open("");
      myWindow.document.write(this.payform);
    }
  }
};
</script>