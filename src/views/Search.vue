<template>
  <div class="search-container">
    <div class="from">
      <router-link to="/classify">
        <van-icon class="arrow-left" name="arrow-left" />
      </router-link>
      <van-search
        v-model="value"
        show-action
        placeholder="苹果1.9/斤"
        @search="onSearch"
        class="search-input"
        @input="handleInput"
        @focus="handleFocus"
      >
        <template #action>
          <router-link v-if="searched" ref="icon" to="/shopping">
            <van-icon
              name="shopping-cart-o"
              class="shopping-cart"
              size="1.7em"
              :badge="shoppingTotal"
              color="#323233"
            />
          </router-link>
          <div @touchend="onSearch" v-if="!searched">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="likevalue" v-if="!searched">
      <van-list>
        <van-cell
          ref="cell"
          v-for="item in likeList"
          :key="item"
          @touchend.native="onSearch(item)"
        >
          <template #title>
            <span v-html="formatHTML(item)"></span>
          </template>
        </van-cell>
      </van-list>
    </div>
    <div class="goodlist" v-if="searched">
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          class="goods-card van-hairline--bottom"
          v-for="(item, i) in searchLists"
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
    </div>
    <div class="history" v-if="!searched && likeList.length === 0">
      <History :history="history" @historyTouch="onSearch($event)" />
    </div>
  </div>
</template>

<script>
import debounce from '@/utils/debounce';
import { getLikeSearch, searchGoods } from '@/api/';
import { setItem, getItem } from '@/utils';
import pageFly from '@/utils/imgAnimation';
import History from '@/components/History.vue';

export default {
  data() {
    return {
      value: '',
      likeList: [],
      searched: false,
      page: 1,
      size: 7,
      searchList: [],
      listToal: 0,
      loading: false,
      finished: false,
      history: [],
    };
  },
  components: {
    History,
  },
  computed: {
    handleInput() {
      return debounce(this.Input, 500);
    },
    searchLists() {
      const items = getItem();
      return this.searchList.map((item) => ({
        ...item,
        selectNumber: items[item.id] ? items[item.id] : 0,
      }));
    },
    shoppingTotal() {
      return this.$store.state.shoppingTotal;
    },
  },
  created() {
    let number = 0;
    const obj = getItem();
    const nums = Object.values(obj);
    nums.forEach((item) => {
      number += item;
    });

    this.$store.commit('changeShoppingTotal', number);
    const history = getItem('history');
    if (history) {
      this.history = history;
    }
  },
  methods: {
    handleReduce(i) {
      const items = getItem();
      this.searchList = this.searchList.map((item) => ({
        ...item,
        selectNumber: items[item.id] ? items[item.id] : 0,
      }));
      this.searchList[i].selectNumber -= 1;
      setItem(this.searchList[i].id, this.searchList[i].selectNumber);
      this.$store.commit('changeShoppingTotal', this.shoppingTotal - 1);
    },
    handleIncrease(i) {
      const items = getItem();
      this.searchList = this.searchList.map((item) => ({
        ...item,
        selectNumber: items[item.id] ? items[item.id] : 0,
      }));
      if (!this.searchList[i].selectNumber) {
        this.$set(this.searchList[i], 'selectNumber', 0);
      }
      this.searchList[i].selectNumber += 1;
      setItem(this.searchList[i].id, this.searchList[i].selectNumber);
      this.$store.commit('changeShoppingTotal', this.shoppingTotal + 1);

      const img = document.getElementById(`img${i}`);
      const originUrl = this.searchList[i].images[0];
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
      const iconPosition = this.$refs.icon.$el.getBoundingClientRect();
      const target = {
        targetTop: iconPosition.top - 20,
        targetLeft: iconPosition.left - 30,
      };
      pageFly({
        origin,
        target,
      });
    },
    async onLoad() {
      const data = await searchGoods(this.value, this.page, this.size);
      this.searchList = [...this.searchList, ...data.list];
      this.page += 1;
      this.loading = false;
      if (this.searchList.length === data.total) {
        this.finished = true;
        this.page = 1;
      }
    },
    formatHTML(item) {
      const reg = new RegExp(this.value, 'g');
      return item.replace(reg, this.value.fontcolor('red'));
    },
    async onSearch(item) {
      // 搜索事件
      // 如果value为空  就不搜索
      if (typeof item === 'string' && this.history.indexOf(item) === -1) {
        this.history.unshift(item);
        localStorage.setItem('history', JSON.stringify(this.history));
      }
      if (this.history.length > 10) {
        this.history = this.history.slice(0, 10);
      }
      this.page = 1;
      if (typeof item === 'string') {
        // 判断是搜索按钮  还是列表点击
        this.value = item;
      }
      if (this.value === '') {
        return;
      }

      const data = await searchGoods(this.value, this.page, this.size);
      this.searchList = data.list;
      this.listToal = data.total;
      this.searched = true;
      this.likeList = [];
      this.page += 1;
    },

    async Input(value) {
      if (!this.value) {
        this.likeList = [];
        return;
      }
      // 函数防抖
      const data = await getLikeSearch(value);
      this.likeList = data.result;
    },
    async handleFocus() {
      this.searched = false;
      if (!this.value) {
        this.likeList = [];
        return;
      }
      const data = await getLikeSearch(this.value);
      this.likeList = data.result;
    },
  },
};
</script>

<style scoped lang="less">
.search-container {
  height: calc(100% + 50px);
  width: 100%;
  position: relative;
  .from {
    position: fixed;
    top: 0;
    height: 55px;
    display: flex;
    font-size: 22px;
    align-items: center;
    justify-content: center;
    margin: 0 15px;
    .search-input {
      width: 323px;
    }
  }
  .likevalue {
    position: absolute;
    max-height: calc(100% - 55px);
    top: 55px;
    padding-left: 30px;
    overflow: auto;
    width: 100%;
  }
  .history {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 30px;
    position: fixed;
    top: 75px;
  }
  .goodlist::-webkit-scrollbar {
    width: 0;
  }
  .goodlist {
    position: absolute;
    max-height: calc(100% - 55px);
    top: 55px;
    overflow: auto;
    width: calc(100% - 30px);
    margin: 0 15px;
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
}
.arrow-left,
.shopping-cart {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
