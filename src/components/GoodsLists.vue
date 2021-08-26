<template>
  <div class="goodslists-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" id="content">
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="就这些了 要不吃点别的吧！"
        @load="onLoad"
        :v-if="$store.state.type != undefined"
      >
        <div
          class="goods-card van-hairline--bottom"
          v-for="(item, i) in list"
          :key="i"
        >
          <div class="img" :id="`img${i}`">
            <img :src="item.images[0]" />
          </div>
          <div class="container">
            <div class="title">{{ item.title }}</div>
            <div class="desc">{{ item.desc }}</div>
            <div class="tag">
              <div class="item" v-for="(tag, i) in item.tags" :key="i">
                {{ tag }}
              </div>
            </div>
            <div class="price">￥{{ item.price }}</div>
            <div class="num">
              <div
                class="reduce"
                v-show="item.selectNumber > 0"
                @touchend="handleReduce(i)"
              ></div>
              <div class="number" v-show="item.selectNumber > 0">
                {{ item.selectNumber }}
              </div>
              <div class="increase" @touchend="handleIncrease(i)"></div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { setItem, getItem } from '@/utils';
import pageFly from '@/utils/imgAnimation';

export default {
  props: ['sortType'],
  data() {
    return {
      page: this.$store.state.page,
      list: this.$store.state.goodsList,
      loading: this.$store.state.isLoading,
      finished: this.$store.state.finished,
      refreshing: this.$store.state.finished,
    };
  },
  created() {
    const obj = getItem();
    const list = this.list.map((item) => {
      const i = item;
      if (obj[item.id]) {
        i.selectNumber = obj[item.id];
      } else {
        delete i.selectNumber;
      }
      return item;
    });
    this.$store.commit('getGoods', list);
  },
  methods: {
    onLoad() {
      // 加载数据;
      this.$store.dispatch('pushGoods', {
        type: this.$store.state.type,
        page: this.page,
        size: 7,
        sort: this.sortType,
      });
    },
    onRefresh() {
      this.$store.dispatch('getGoods', {
        type: this.$store.state.type,
        page: 1,
        size: 7,
        sort: this.sortType,
        refreshing: 1,
      });
    },
    handleReduce(i) {
      this.$store.state.goodsList[i].selectNumber -= 1;
      setItem(this.list[i].id, this.$store.state.goodsList[i].selectNumber);
    },
    handleIncrease(i) {
      if (!this.$store.state.goodsList[i].selectNumber) {
        this.$set(this.$store.state.goodsList[i], 'selectNumber', 0);
      }
      this.$store.state.goodsList[i].selectNumber += 1;
      setItem(this.list[i].id, this.$store.state.goodsList[i].selectNumber);
      const img = document.getElementById(`img${i}`);
      const originUrl = this.$store.state.goodsList[i].images[0];
      const {
        width, height, top, left,
      } = img.getBoundingClientRect();
      const origin = {
        originUrl,
        originWidth: width,
        originHeight: height,
        originTop: top,
        originLeft: left,
      };
      const target = {
        targetTop: this.$store.state.shoppingTop,
        targetLeft: this.$store.state.shoppingLeft,
      };
      pageFly({
        origin,
        target,
      });
    },
  },

  watch: {
    '$store.state.goodsList': {
      handler(newValue) {
        this.list = newValue;
      },
      deep: true,
    },
    '$store.state.isLoading': {
      handler(newValue) {
        this.loading = newValue;
      },
      deep: true,
    },
    '$store.state.refreshing': {
      handler(newValue) {
        this.refreshing = newValue;
      },
      deep: true,
    },
    '$store.state.finished': {
      handler(newValue) {
        this.finished = newValue;
      },
      deep: true,
    },
    '$store.state.page': {
      handler(newValue) {
        this.page = newValue;
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="less">
.goodslists-container {
  width: 100%;
  height: 100%;
  #content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .goods-card {
    width: 100%;
    height: 100px;
    position: relative;
    display: flex;
    .img {
      margin-right: 20px;
      height: 90px;
      width: 90px;
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
    .container {
      width: 186px;
      height: 100px;
      .title {
        width: 170px;
        height: 17px;
        margin-top: 5px;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .desc {
        width: 170px;
        color: #aaa;
        height: 14px;
        margin-top: 5px;
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tag {
        width: 170px;
        height: 18px;
        margin-top: 5px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .item {
          text-align: center;
          line-height: 14px;
          height: 18px;
          font-size: 10px;
          color: #aaa;
          border: 1px solid #aaa;
          padding: 1px 2px;
          box-sizing: border-box;
          border-radius: 4px;
          margin-right: 5px;
        }
      }
      .price {
        font-size: 15px;
        font-weight: 600;
        color: #ff1a90;
      }
      .num {
        position: absolute;
        width: 50px;
        height: 16px;
        font-size: 14px;
        bottom: 13px;
        right: 13px;
        display: flex;
        justify-content: flex-end;
        .reduce {
          flex: none;
          width: 16px;
          height: 16px;
          background-image: url(https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/rec.png);
          background-size: contain;
        }
        .increase {
          flex: none;
          width: 16px;
          height: 16px;
          background-image: url(https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/add.png);
          background-size: contain;
        }

        .number {
          box-sizing: border-box;
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
