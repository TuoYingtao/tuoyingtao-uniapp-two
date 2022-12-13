<template>
	<view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view>
      <text class="title">{{ title }}</text>
    </view>
    <view style="padding-top: 30rpx;">
      <t-button class="space-item bottom-btn" @click="toList">去 List.vue 页面</t-button>
    </view>
  </view>
</template>

<script>
import TButton from "@/components/t-components/t-button/t-button";

export default {
  components: {TButton},
  data() {
    return {
      title: 'Hello'
    }
  },
  onLoad() {

  },
  methods: {
    toList(e) {
      console.log('toList', e)
      this.$navigateTo({
        url: '/pages_a/list/list',
      })
    }
  }
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

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
