<template>
  <div class="primarynav-container" ref="container">
    <div
      class="item"
      v-for="(item, i) in menuList"
      :key="i"
      :class="{ active: i === index }"
      @touchend="handleTouch(i, $event)"
      @touchmove="isMove = true"
    >
      <div class="img-container">
        <img :src="item.imgURL" />
      </div>
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import { move } from '@/utils/index';

export default {
  async created() {
    //  首先根据初始索引 获取一次初始数据
    this.$store.dispatch('getSidebar', this.menuList[this.index].title);
  },
  data() {
    return {
      menuList: [
        {
          title: '时令水果',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/时令水果.jpg',
        },
        {
          title: '酒水冲调',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/酒水冲调.jpg',
        },
        {
          title: '安心乳品',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/安心乳品.jpg',
        },
        {
          title: '休闲零食',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/休闲零食.jpg',
        },
        {
          title: '肉蛋食材',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/肉蛋食材.jpg',
        },
        {
          title: '新鲜蔬菜',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/新鲜食材.jpg',
        },
        {
          title: '熟食餐饮',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/熟食餐饮.jpg',
        },
        {
          title: '海鲜水产',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/海鲜水产.jpg',
        },
        {
          title: '粮油调味',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/粮油调味.jpg',
        },
        {
          title: '某手美食',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/某手美食.jpg',
        },
        {
          title: '纸杯清洁',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/纸品清洁.jpg',
        },
        {
          title: '个人护理',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/个人护理.jpg',
        },
        {
          title: '美妆护肤',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/美妆护肤.jpg',
        },
        {
          title: '家居收纳',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/家居收纳.jpg',
        },
        {
          title: '家用电器',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/家用电器.jpg',
        },
        {
          title: '3C数码',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/3C数码.jpg',
        },
        {
          title: '母婴用品',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/母婴用品.jpg',
        },
        {
          title: '鲜花绿植',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/鲜花绿植.jpg',
        },
        {
          title: '宠物用品',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/宠物用品.jpg',
        },
        {
          title: '图书玩具',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/图书文具.jpg',
        },
        {
          title: '手表配饰',
          imgURL:
            'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/手表配饰.jpg',
        },
      ],
      index: 0,
      isMove: false,
    };
  },
  methods: {
    move,
    async handleTouch(i, e) {
      if (this.isMove) {
        this.isMove = false;
        return;
      }
      this.index = i;
      //   点击之后 让被点击的元素到中间

      //   左边
      // -  + s.left + s.width/2 -f.width/2
      //   右边
      // s.left + s.width/2 - f.width/2
      const selfLeft = Math.round(e.target.getBoundingClientRect().left);
      const selfWidth = e.target.offsetWidth;
      const parentWidth = this.$refs.container.offsetWidth;
      // 这个是原来的点到目标点的距离 如果是负数  就是向左
      const target = Math.round(selfLeft + selfWidth / 2 - parentWidth / 2);
      this.move(target, this.$refs.container, 'scrollLeft');
      // 点击后  发送请求
      this.$store.dispatch('getSidebar', this.menuList[this.index].title);
    },
  },
};
</script>

<style scoped lang="less">
.primarynav-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  .item {
    width: 50px;
    height: 100%;
    margin-left: 10px;
    .img-container {
      width: 100%;
      height: 50px;
      border-radius: 40%;
      border-width: 2px;
      border-color: transparent;
      border-style: solid;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
    }
    .title {
      text-align: center;
      margin-top: 5px;
    }

    &.active {
      .img-container {
        background: #fff;
        border-color: #d13193;
      }
      .title {
        font-size: 0.8em;
        padding: 2px;
        color: #fff;
        background-color: #d13193;
        border-radius: 10px;
        font-weight: bold;
        word-break: keep-all;
      }
    }
  }
}
.primarynav-container::-webkit-scrollbar {
  width: 0;
}
</style>
