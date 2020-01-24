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
      <!-- 寄送資訊表單（電腦版）-->
      <div class="deliveryInfo hidden-sm-and-down">
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

      <!-- 寄送資訊表單（手機版）-->
      <div class="deliveryInfo hidden-md-and-up">
        <el-select v-model="delivery.way" placeholder="寄送方式">
          <el-option
            v-for="way in deliveryWay"
            :key="way.name"
            :value="way.name"
          >{{ way.name + " NT$" + way.price}}</el-option>
        </el-select>
        <el-input style="margin-top: 15px" v-model="delivery.address" placeholder="寄送地址或收件超商店名"></el-input>

        <el-input style="margin-top: 15px" v-model="delivery.name" placeholder="收件人姓名"></el-input>

        <el-input style="margin-top: 15px" v-model="delivery.phone" placeholder="收件人聯繫電話"></el-input>

        <el-input style="margin-top: 15px" v-model="delivery.email" placeholder="收件人電子郵件"></el-input>

        <el-button type="primary" style="float: right; margin-top: 15px" @click="sendOrder()">送出訂單</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import config from "../config.js";
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
      if (
        this.delivery.way == "" ||
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
          url: config.host + "/sendorder/",
          data: {
            items: this.$store.state.shoppingcart,
            delivery: this.delivery
          }
        })
          .then(res => {
            localStorage.removeItem("shoppingcart");
            vm.$store.commit("clean");
            this.$confirm(
              "畫面將跳轉至綠界金流安全付款介面，請您付款後選擇 “回到商店” 來查看你的訂單狀態。同時請您記下您的訂單編號 " +
                res.data.orderID +
                " 以便您未來需要查詢本筆訂單。",
              "請注意",
              {
                confirmButtonText: "前往安全付款畫面",
                type: "warning",
                showClose: false,
                showCancelButton: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                closeOnHashChange: false
              }
            )
              .then(() => {
                document.write(res.data.payform);
              })
              .catch(() => {
                this.$message({
                  type: "error",
                  message: "付款時發生問題，請您重新送出訂單"
                });
              });
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
      url: config.host + "/deliveryWay"
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