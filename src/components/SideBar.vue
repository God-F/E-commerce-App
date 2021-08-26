<template>
  <div class="SideBar-container">
    <div class="left-nav" ref="left">
      <div
        class="item"
        :class="{ active: i === index }"
        v-for="(item, i) in $store.state.sidebar"
        :key="i"
        @touchend="handleClick(i, $event)"
        @touchmove="isMove = true"
      >
        {{ typeof item == "string" ? item : "全部" }}
      </div>
    </div>
  </div>
</template>

<script >
import { move } from '@/utils/index';

export default {
  data() {
    return {
      isMove: false,
      index: 0,
    };
  },
  props: ['sortType'],
  methods: {
    move,
    handleClick(i, e) {
      if (this.isMove) {
        this.isMove = false;
        return;
      }
      this.index = i;
      const parentTop = this.$refs.left.getBoundingClientRect().top;
      const parentHeight = this.$refs.left.offsetHeight;
      const selfHeight = e.target.offsetHeight;
      const seltTop = e.target.getBoundingClientRect().top;
      const target = seltTop + selfHeight / 2 - parentTop - parentHeight / 2;
      // 运动
      this.move(target, this.$refs.left, 'scrollTop');
      // 发送请求
      // 获取数据
      this.$store.dispatch('getGoods', {
        type: this.sidebarType,
        page: 1,
        size: 7,
        sort: this.sortType,
      });
    },
  },
  computed: {
    sidebarType() {
      return this.$store.state.sidebar[this.index];
    },
  },
  watch: {
    //   主要是为了解决 初始化阶段 无法得到this.$store.state.sidebar[this.index]
    // 这个数据  created时 此数据为undefined
    // 所以监听这个数据的变化
    sidebarType: {
      handler() {
        // if (!this.sidebarType) {
        //   return;
        // }
        this.$store.dispatch('getGoods', {
          type: this.sidebarType,
          page: 1,
          size: 7,
          sort: this.sortType,
        });
      },
    },
  },
};
</script>

<style scoped lang="less">
.left-nav {
  width: 80px;
  height: 100%;
  background: #f8f8f8;
  overflow: auto;
  .item {
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: relative;
    &.active {
      font-weight: bold;
      color: #ff1a90;
      &::before {
        content: "";
        width: 6px;
        height: 18px;
        position: absolute;
        background-color: #ff1a90;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }
}
.left-nav::-webkit-scrollbar {
  width: 0;
  background-color: transparent;
}
</style>
