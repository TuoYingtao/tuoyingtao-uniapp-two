<template>
  <view>
    <t-button class="space-item bottom-btn">默认</t-button>
  </view>
</template>

<script>
import TButton from "@/components/t-components/t-button/t-button";

export default {
  name: "list",
  components: {TButton},
}
</script>

<style lang="scss" scoped>
@import '@/common/css/mixin.scss';

.bottom-btn {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 98;
  width: 100%;
  box-sizing: border-box;
  padding: 15rpx 70rpx;
  display: flex;
  @include x-padding-bottom(12rpx)
}
</style>
