<template>
  <div>
    <!-- 浮動導航列 (電腦版) -->
    <div class="navbar hidden-sm-and-down">
      <el-row type="flex" justify="center" style="text-align: center">
        <el-col :span="6"></el-col>
        <el-col :span="12">
          <router-link style="font-size: 24px; line-height: 60px" class="logo" to="/">Salis 生活小飾館</router-link>
        </el-col>
        <el-col :span="4"></el-col>
        <el-col :span="2" class="actions">
          <i
            style="cursor: pointer"
            @click="shoppingCartOpening = true"
            class="bigicon el-icon-shopping-cart-full"
          ></i>
          <i style="cursor: pointer" @click="enterOrderID" class="bigicon el-icon-s-order"></i>
        </el-col>
      </el-row>
    </div>

    <!-- 浮動導航列 (手機版) -->
    <div class="navbarmobile hidden-md-and-up">
      <el-row type="flex" justify="right">
        <el-col :span="18">
          <router-link class="logo" to="/">Salis 生活小飾館</router-link>
        </el-col>
        <el-col :span="6">
          <i
            style="cursor: pointer"
            @click="shoppingCartOpening = true"
            class="bigiconmobile el-icon-shopping-cart-full"
          ></i>
          <i style="cursor: pointer" @click="enterOrderID" class="bigiconmobile el-icon-s-order"></i>
        </el-col>
      </el-row>
    </div>

    <!-- 網頁內容 -->
    <router-view></router-view>

    <!-- 頁尾 -->
    <div style="margin-top: 60px; margin-bottom: 60px">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <p>購物</p>
          <div v-for="theclass in this.classes" :key="theclass.name">
            <p>
              <router-link :to="'/classpage/' + theclass.id">{{ theclass.name }}</router-link>
            </p>
          </div>
        </el-col>
        <el-col :span="6">
          <p>顧客服務</p>
          <p>
            <a href="#">常見問題</a>
          </p>
          <p>
            <a href="#">聯絡店家</a>
          </p>
          <p>
            <a href="#">尺寸說明</a>
          </p>
        </el-col>
        <el-col :span="6">
          <p>其他信息</p>
          <p>
            <a href="#">隱私政策</a>
          </p>
          <p>
            <a href="#">使用條款</a>
          </p>
          <p>
            <a href="#">退貨政策</a>
          </p>
          <p>
            <a href="#">防偽聲明</a>
          </p>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <p style="margin-top: 60px">CopyRight Salis 生活小飾館 2020.</p>
      </el-row>
    </div>

    <!-- 購物車 -->
    <el-drawer title="購物車" :visible.sync="shoppingCartOpening" direction="rtl" :size="drawersize">
      <el-row type="flex" justify="center">
        <el-col :span="22">
          <el-table :data="this.$store.state.shoppingcart" empty-text="購物車內還沒有商品！">
            <el-table-column width="100px">
              <template slot-scope="scope">
                <img
                  :src="'/images/' + scope.row.id + '.jpg'"
                  class="image"
                  style="width: 80px; cursor: pointer"
                  @click="$router.push('/itempage/' + scope.row.id); shoppingCartOpening = false"
                />
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <p>{{ scope.row.name}}</p>
                <p>{{ scope.row.option}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="數量"></el-table-column>
            <el-table-column prop="sumprice" label="合計"></el-table-column>
            <el-table-column width="100px">
              <template slot-scope="scope">
                <el-button type="danger" class="el-icon-delete" @click="delitem(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            type="primary"
            style="margin-top: 30px; float: right"
            @click="gotocheckout()"
          >結帳</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import axios from "axios";
import config from "../src/config.js";
import "element-ui/lib/theme-chalk/display.css";
export default {
  name: "app",
  data() {
    return {
      shoppingCartOpening: false,
      classes: [],
      drawersize: "100%"
    };
  },
  created() {
    const vm = this;

    // 從本地獲取上次保存的購物車資訊
    if (localStorage.getItem("shoppingcart") != null) {
      this.$store.commit("update");
    }

    // 針對手機和桌面顯示調整購物車介面的寬度
    if (screen.width > 600) {
      this.drawersize = "800px";
    }

    // 取得商品類別清單
    axios({ method: "get", url: config.host + "/classes" })
      .then(res => {
        this.classes = JSON.parse("[" + res.data + "]");
      })
      .catch(function(error) {
        vm.$notify.error({
          title: "發生錯誤",
          message: "系統發生了一項錯誤，請和我們聯絡來處理這個問題。" + error,
          position: "bottom-right"
        });
      });
  },
  methods: {
    delitem(item) {
      this.$store.commit("delitem", { item });
    },
    gotocheckout() {
      this.$router.push("/checkout");
      this.shoppingCartOpening = false;
    },
    enterOrderID() {
      this.$prompt("請輸入您的訂單編號", "訂單查詢", {
        confirmButtonText: "查詢",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        this.$router.push("/order/" + value);
      });
    }
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: "Times New Roman", "微軟正黑體", Times, serif;
}
.el-message-box {
  width: 98% !important;
  max-width: 420px;
}
.navbar {
  position: fixed;
  top: 20px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 30;
  width: 100%;
  color: white;
  line-height: 16px;
}

.navbarmobile {
  position: fixed;
  top: 20px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 30;
  width: 100%;
  color: white;
  line-height: 16px;
}

.actions {
  line-height: 90px;
}

.logo {
  font-size: 16px;
  margin-top: 14px;
  margin-left: 20px;
  display: inline-block;
  color: white;
}

.itemclasses {
  font-size: 12px;
  margin-top: 20px;
  margin-left: 20px;
  display: inline-block;
  text-align: center;
}

.itemclasses a {
  margin-left: 20px;
  color: white;
  text-decoration: none;
}

a {
  text-decoration: none;
  color: black;
}
.bigicon {
  font-size: 1.5rem;
  margin-right: 30px;
  margin-top: 14px;
}

.bigiconmobile {
  font-size: 1.5rem;
  margin-right: 15px;
  margin-top: 10px;
}
</style>
