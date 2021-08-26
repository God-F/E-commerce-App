<template>
  <div class="bottomnav-container">
    <van-tabbar v-model="active" route fixed>
      <van-tabbar-item name="home" to="/home" icon="home-o">
        首页
      </van-tabbar-item>
      <van-tabbar-item name="classify" to="/classify" icon="apps-o">
        分类
      </van-tabbar-item>
      <van-tabbar-item
        name="shopping"
        :badge="$store.state.shoppingTotal"
        to="/shopping"
        icon="shopping-cart-o"
        ref="shopping"
      >
        购物车
      </van-tabbar-item>
      <van-tabbar-item name="user" to="/user" icon="user-circle-o">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { getItem } from '@/utils';

export default {
  data() {
    return {
      active: 'home',
    };
  },
  created() {
    let number = 0;
    const obj = getItem();
    const nums = Object.values(obj);
    nums.forEach((item) => {
      number += item;
    });

    this.$store.commit('changeShoppingTotal', number);
  },
  watch: {
    '$store.state.goodsList': {
      handler() {
        let number = 0;
        const obj = getItem();
        const nums = Object.values(obj);
        nums.forEach((item) => {
          number += item;
        });

        this.$store.commit('changeShoppingTotal', number);
      },
      deep: true,
    },
  },
  mounted() {
    const { top, left } = this.$refs.shopping.$el.getBoundingClientRect();
    this.$store.commit('changeShoppingTop', top);
    this.$store.commit('changeShoppingLeft', left);
  },
};
</script>

<style scoped lang="less">
</style>
