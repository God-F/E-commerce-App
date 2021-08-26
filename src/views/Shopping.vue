<template>
  <div class="shopping-container">
    <van-nav-bar title="购物车" right-text="删除" @click-right="onClickRight" />
    <div class="shoppingCar">
      <van-checkbox-group v-model="result" ref="checkboxGroup">
        <div
          class="goods-card van-hairline--bottom"
          v-for="(item, i) in shoppingList"
          :key="i"
        >
          <van-checkbox :name="i"></van-checkbox>
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
      </van-checkbox-group>
    </div>
    <van-submit-bar
      :price="totalPrice"
      :button-text="`去结算(${totalNumber})`"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
    </van-submit-bar>
    <BottomNav />
  </div>
</template>

<script>
import BottomNav from '@/components/Bottomnav.vue';
import { Toast, Dialog } from 'vant';
import { getItem, setItem } from '@/utils';
import { getGoodsById } from '@/api/index';
import pageFly from '@/utils/imgAnimation';

export default {
  components: {
    BottomNav,
  },
  async created() {
    const idObj = getItem();
    const ids = Object.keys(idObj).join(',');
    const data = await getGoodsById(ids);
    this.shoppingList = data.list;
    this.shoppingList.forEach((item) => {
      const i = item;
      this.$set(i, 'selectNumber', idObj[item.id]);
    });

    // 初始化图标提示
    let number = 0;
    const obj = getItem();
    const nums = Object.values(obj);
    nums.forEach((item) => {
      number += item;
    });

    this.$store.commit('changeShoppingTotal', number);
  },
  watch: {
    result: {
      handler(newvalue) {
        if (
          newvalue.length === this.shoppingList.length
          && newvalue.length !== 0
        ) {
          this.checked = true;
        } else if (newvalue.length === 0) {
          this.checked = false;
        } else {
          this.checked = false;
        }
      },
    },
  },
  methods: {
    checkAll() {
      if (this.result.length === this.shoppingList.length) {
        this.$refs.checkboxGroup.toggleAll();
      } else {
        this.$refs.checkboxGroup.toggleAll(true);
      }
    },
    onClickRight() {
      if (this.result.length === 0) {
        Toast('请选择商品');
        return;
      }
      Dialog.confirm({
        title: '提示',
        message: '确认删除所有选择的商品?',
      })
        .then(() => {
          const list = this.shoppingList.filter(
            (item, i) => this.result.indexOf(i) !== -1,
          );
          list.forEach((item) => {
            setItem(item.id, 0);
          });
          if (this.result.length === this.shoppingList.length) {
            this.checked = false;
          }
          this.shoppingList = this.shoppingList.filter(
            (item, i) => this.result.indexOf(i) === -1,
          );
          this.result = [];
          this.$store.commit('changeShoppingTotal', this.totalNumber);
        })
        .catch(() => {});
    },
    onSubmit() {
      Toast('触发订单提交函数');
    },
    handleReduce(i) {
      if (this.shoppingList[i].selectNumber === 1) {
        Dialog.confirm({
          title: '提示',
          message: '确认删除这项商品?',
        })
          .then(() => {
            setItem(this.shoppingList[i].id, 0);
            this.shoppingList = this.shoppingList.filter(
              (item, index) => index !== i,
            );
            this.$store.commit('changeShoppingTotal', this.totalNumber);
          })
          .catch(() => {});
        return;
      }
      this.shoppingList[i].selectNumber -= 1;
      setItem(this.shoppingList[i].id, this.shoppingList[i].selectNumber);
      this.$store.commit('changeShoppingTotal', this.totalNumber);
    },
    handleIncrease(i) {
      if (!this.shoppingList[i].selectNumber) {
        this.$set(this.shoppingList[i], 'selectNumber', 0);
      }
      this.shoppingList[i].selectNumber += 1;
      setItem(this.shoppingList[i].id, this.shoppingList[i].selectNumber);
      this.$store.commit('changeShoppingTotal', this.totalNumber);
      const img = document.getElementById(`img${i}`);
      const originUrl = this.shoppingList[i].images[0];
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
  data() {
    return {
      checked: false,
      shoppingList: [],
      result: [],
    };
  },
  computed: {
    totalNumber() {
      const list = this.shoppingList.filter(
        (item, i) => this.result.indexOf(i) !== -1,
      );
      return list.reduce((prev, cur) => prev + cur.selectNumber, 0);
    },
    totalPrice() {
      const list = this.shoppingList.filter(
        (item, i) => this.result.indexOf(i) !== -1,
      );
      return list.reduce(
        (prev, cur) => prev + cur.selectNumber * cur.price * 100,
        0,
      );
    },
  },
};
</script>

<style lang='less' scoped>
.shopping-container {
  width: 100%;
  height: 100%;
  .shoppingCar::-webkit-scrollbar {
    width: 0;
  }
  .shoppingCar {
    width: calc(100% - 20px);
    height: calc(100% - 160px);
    padding: 10px;
    position: fixed;
    top: 46px;
    overflow: auto;
    .goods-card {
      width: 100%;
      height: 100px;
      position: relative;
      display: flex;
      .van-checkbox {
        margin-right: 10px;
      }
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
.van-submit-bar {
  bottom: 50px;
}
</style>
