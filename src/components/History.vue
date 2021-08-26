<template>
  <div class="history-container">
    <h3>历史记录:</h3>
    <div class="content">
      <div
        class="item"
        v-for="(item, i) in history"
        :key="i"
        @touchend="handleTouch(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['history'],
  methods: {
    handleTouch(item) {
      this.$emit('historyTouch', item);
    },
  },
};
</script>

<style scopd lang="less">
.history-container {
  width: 100%;
  .content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .item {
      border-radius: 10px;
      background: #eee;
      height: 16px;
      line-height: 16px;
      padding: 15px;
      margin-right: 10px;
      margin-bottom: 10px;
      margin-top: 5px;
    }
  }
}
</style>
