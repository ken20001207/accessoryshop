<template>
  <el-card :body-style="{ padding: '0px' }" class="card" style="display: inline-block; cursor: pointer;" shadow="hover">
    <img
      :src="'./images/' + item.id + '.jpg'"
      class="image"
    />
    <div style="padding: 14px;text-align: center;">
      <p style="size: 16px"> {{ item.name}} </p>
      <p style="size: 12px">NT$ {{ item.price}}</p>
    </div>
  </el-card>
</template>

<script>
export default {
    name: "itemcard",
    props: ["item"]
}
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .image {
    width: 80px;
  }
  .card {
    width: 120px;
    margin: 10px; 
  }
}
@media only screen and (min-width: 600px) {
  .image {
    width: 300px;
  }
  .card {
    width: 300px;
    margin: 30px; 
  }
}
</style>