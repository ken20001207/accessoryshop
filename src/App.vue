<template>
  <div>
    <!-- 浮動導航列 -->
    <div class="navbar">
      <router-link class="logo" to="/">Salis 生活小飾館</router-link>
      <div class="itemclasses">
        <router-link to="/classpage/1">商品分類1</router-link>
        <router-link to="/classpage/2">商品分類2</router-link>
        <router-link to="/classpage/3">商品分類3</router-link>
        <router-link to="/classpage/4">商品分類4</router-link>
      </div>
      <div style="float:right;">
        <i style="cursor: pointer" @click="shoppingCartOpening = true" class="bigicon el-icon-shopping-cart-full"></i>
        <i style="cursor: pointer" @click="enterOrderID" class="bigicon el-icon-s-order"></i>
      </div>
    </div>

    <!-- 網頁內容 -->
    <router-view></router-view>

    <!-- 頁尾 -->
    <div style="margin-top: 60px; margin-bottom: 60px">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <p>購物</p>
          <p>
            <router-link to="/classpage/1">商品分類1</router-link>
          </p>
          <p>
            <router-link to="/classpage/2">商品分類2</router-link>
          </p>
          <p>
            <router-link to="/classpage/3">商品分類3</router-link>
          </p>
          <p>
            <router-link to="/classpage/4">商品分類4</router-link>
          </p>
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
    <el-drawer
      title="購物車 Shopping Cart"
      :visible.sync="shoppingCartOpening"
      direction="rtl"
      size="800px"
    >
      <el-row type="flex" justify="center">
        <el-col :span="22">
          <el-table :data="this.$store.state.shoppingcart">
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
export default {
  name: "app",
  data() {
    return {
      shoppingCartOpening: false
    };
  },
  created() {
    if (localStorage.getItem("shoppingcart") != null) {
      this.$store.commit("update");
    }
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

.navbar {
  position: fixed;
  top: 20px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 30;
  width: 100%;
  color: white;
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
</style>
