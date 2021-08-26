<template>
  <div class="classIfy-container">
    <router-link to="/search">
      <div class="search-content">
        <van-icon name="search" />
        <span>你想吃什么呢?</span>
      </div>
    </router-link>

    <div class="primary-nav">
      <Primarynav />
    </div>
    <div class="main">
      <SideBar :sortType="sortType" />
      <div class="main-content">
        <div class="top-nav van-hairline--top-bottom">
          <div
            :class="{ active: selectType === 'all' }"
            @touchend="selectType = 'all'"
          >
            综合
          </div>
          <div
            :class="{ active: selectType === 'sale' }"
            @touchend="selectType = 'sale'"
          >
            销量
          </div>
          <div
            class="arrow"
            :class="{
              active: selectType === 'price',
              up: selectType === 'price' && isup,
              down: selectType === 'price' && !isup,
            }"
            @touchend="
              selectType = 'price';
              isup = !isup;
            "
          >
            价格
          </div>
        </div>
        <div class="goods-list">
          <GoodsLists :sortType="sortType" />
        </div>
      </div>
    </div>
    <BottomNav />
  </div>
</template>

<script>
import Primarynav from '@/components/Primarynav.vue';
import GoodsLists from '@/components/GoodsLists.vue';
import SideBar from '@/components/SideBar.vue';
import BottomNav from '@/components/Bottomnav.vue';

export default {
  components: {
    Primarynav,
    GoodsLists,
    BottomNav,
    SideBar,
  },
  data() {
    return {
      selectType: 'all',
      isup: false,
    };
  },

  computed: {
    sortType() {
      if (this.selectType !== 'price') {
        return this.selectType;
      }

      return `price-${this.isup ? 'up' : 'down'}`;
    },
  },
  watch: {
    sortType: {
      handler() {
        this.$store.dispatch('getGoods', {
          type: this.$store.state.type,
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
.classIfy-container {
  width: 100%;
  height: 100%;
  .search-content {
    width: 340px;
    height: 32px;
    background: #eee;
    border-radius: 10px;
    text-align: center;
    font-size: 1.2em;
    color: #a1a1a1;
    margin: 10px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .primary-nav {
    width: 100%;
    height: 90px;
    margin-top: 10px;
  }
  .main {
    width: 100%;
    background: #fff;
    position: fixed;
    top: 135px;
    bottom: 50px;
    display: flex;

    .main-content {
      position: fixed;
      width: 296px;
      // height: 482px;
      height: calc(100% - 192px);
      left: 80px;
      .top-nav {
        padding: 0 8px;
        display: flex;
        height: 26px;
        justify-content: flex-end;
        div {
          height: 100%;
          line-height: 26px;
          width: 50px;
          color: #aaa;
          text-align: center;
          position: relative;
          &.active {
            color: #ff1a90;
            font-weight: bold;
          }
          &.arrow::before {
            content: "";
            position: absolute;
            border: 4px solid transparent;
            border-bottom-color: #aaa;
            right: 0;
            top: 4px;
          }
          &.arrow::after {
            content: "";
            position: absolute;
            border: 4px solid transparent;
            border-top-color: #aaa;
            right: 0;
            bottom: 5px;
          }
          &.arrow.up::before {
            border-bottom-color: #ff1a90;
          }
          &.arrow.down::after {
            border-top-color: #ff1a90;
          }
        }
      }
      .goods-list {
        width: 100%;
        height: calc(100% - 26px);
        // height: 482px;
        overflow: auto;
      }
    }
  }
}
</style>
