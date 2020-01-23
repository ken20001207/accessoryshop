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
        <el-table-column prop="sumprice" label="合計"></el-table-column>
        <el-table-column width="100px">
          <template slot-scope="scope">
            <el-button type="danger" class="el-icon-delete" @click="delitem(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" style="margin-top: 30px; float: right" @click="sendOrder()">送出訂單</el-button>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
export default {
  name: "itempage",
  data() {
    return {
      shoppingCart: []
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
      axios({
        method: "post",
        url: "http://localhost:3000/sendorder/",
        data: { items: this.$store.state.shoppingcart }
      })
        .then(res => {
          this.$router.push("/order/" + res.data);
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