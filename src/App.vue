<template>
  <div id="app">
    <div class="view-container">
      <router-view></router-view>
    </div>
    <!-- <BottomNav /> -->
  </div>
</template>
<script>
// import BottomNav from '@/components/Bottomnav.vue';
import { setItem } from '@/utils';

export default {
  // components: {
  //   BottomNav,
  // },
  created() {
    setItem();
  },
};
</script>

<style lang="less" >
* {
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
  position: absolute;
  .view-container {
    width: 100%;
    height: calc(100% - 50px);
  }
}
</style>
