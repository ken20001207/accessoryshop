<template>
  <!-- container -->
  <el-row type="flex" justify="center" style="margin-top: 120px">
    <el-col :span="16">
      <h2>請確認您的訂單</h2>
      <el-table :data="this.$store.state.shoppingcart">
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
        <el-table-column label="數量">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.num"
              @change="handleChange(scope.row, scope.row.num)"
              :min="1"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="合計">
          <template slot-scope="scope">NT$ {{ scope.row.num * scope.row.price }}</template>
        </el-table-column>
        <el-table-column width="100px">
          <template slot-scope="scope">
            <el-button type="danger" class="el-icon-delete" @click="delitem(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <h2>寄送資訊</h2>
      <div class="deliveryInfo">
        <el-row>
          <el-col :span="4">
            <el-select v-model="delivery.way" placeholder="寄送方式">
              <el-option
                v-for="way in deliveryWay"
                :key="way.name"
                :value="way.name"
              >{{ way.name + " NT$" + way.price}}</el-option>
            </el-select>
          </el-col>
          <el-col :offset="1" :span="19">
            <el-input v-model="delivery.address" placeholder="寄送地址或收件超商店名"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 30px">
          <el-col :span="4">
            <el-input v-model="delivery.name" placeholder="收件人姓名"></el-input>
          </el-col>
          <el-col :offset="1" :span="7">
            <el-input v-model="delivery.phone" placeholder="收件人聯繫電話"></el-input>
          </el-col>
          <el-col :offset="1" :span="7">
            <el-input v-model="delivery.email" placeholder="收件人電子郵件"></el-input>
          </el-col>
          <el-col :offset="1" :span="3">
            <el-button type="primary" style="float: right" @click="sendOrder()">送出訂單</el-button>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
export default {
  name: "itempage",
  data() {
    return {
      shoppingCart: [],
      delivery: {},
      deliveryWay: {}
    };
  },
  methods: {
    /** 從購物車刪除物品 */
    delitem(item) {
      this.$store.commit("delitem", { item });
    },
    /** 更改購物車某項商品的數量 */
    handleChange(item, num) {
      this.$store.commit("changeAmount", { item: item, amount: num });
    },
    /** 送出訂單 */
    sendOrder() {
      const vm = this;

      // 確認所有欄位都已經填寫
      if (this.delivery.way == "" ||
        this.delivery.way == undefined ||
        this.delivery.name == "" ||
        this.delivery.name == undefined ||
        this.delivery.address == "" ||
        this.delivery.address == undefined ||
        this.delivery.phone == "" ||
        this.delivery.phone == undefined ||
        this.delivery.email == "" ||
        this.delivery.email == undefined
      ) {
        vm.$notify.warning({
          title: "未填寫完整",
          message: "為了確保發貨順利，請填寫所有寄送資訊喔!",
          position: "bottom-right"
        });
      } else
        axios({
          method: "post",
          url: "http://localhost:3000/sendorder/",
          data: {
            items: this.$store.state.shoppingcart,
            delivery: this.delivery
          }
        })
          .then(res => {
            localStorage.removeItem("shoppingcart");
            vm.$store.commit("clean");
            vm.$router.push("/order/" + res.data.orderID);
            var myWindow = window.open("");
            myWindow.document.write(res.data.payform);
          })
          .catch(function(error) {
            vm.$notify.error({
              title: "發生錯誤",
              message:
                "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error,
              position: "bottom-right"
            });
          });
    }
  },
  created() {
    const vm = this;
    axios({
      method: "get",
      url: "http://localhost:3000/deliveryWay"
    })
      .then(res => {
        this.deliveryWay = res.data;
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
  margin-top: 40px;
}
h2 {
  margin-top: 60px;
}
</style>