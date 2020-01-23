<template>
  <el-card :body-style="{ padding: '0px' }" style="margin: 30px; cursor: pointer;" shadow="hover">
    <img
      :src="'./images/' + item.id + '.jpg'"
      class="image"
      style="width: 300px;"
    />
    <div style="padding: 14px;text-align: center;">
      <p style="margin: 10px; size: 16px"> {{ item.name}} </p>
      <p style="margin: 30px; size: 12px">NT$ {{ item.price}}</p>
    </div>
  </el-card>
</template>

<script>
export default {
    name: "itemcard",
    props: ["item"]
}
</script>