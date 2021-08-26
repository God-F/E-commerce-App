<template>
  <div class="Home-container">
    <h2>这是首页</h2>
    <BottomNav />
  </div>
</template>

<script>
import BottomNav from '@/components/Bottomnav.vue';

export default {
  components: {
    BottomNav,
  },
};
</script>

<style scoped lang = 'less'>
.Home-container {
  width: 100%;
  height: 100%;
}
</style>
