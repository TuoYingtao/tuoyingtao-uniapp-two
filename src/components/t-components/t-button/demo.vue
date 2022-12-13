<template>
    <view class="vi-t-button-demo">
        <view class="my-10 space-y-4">
            <view class="flex justify-center space-x-2">
                <t-button class="space-item">默认</t-button>
                <t-button class="space-item" border-radius="0">方形</t-button>
                <t-button class="space-item" color="#73CBBF">变色</t-button>
                <t-button class="space-item" color="#eee" text-color="#4395f3">变色</t-button>
            </view>
            <view class="flex justify-center space-x-2">
                <t-button class="space-item" plain>镂空</t-button>
                <t-button class="space-item" plain color="#73CBBF">镂空</t-button>
                <t-button class="space-item" plain color="#4395f3" text-color="#ece626">镂空反色</t-button>
            </view>
            <view class="flex justify-center space-x-2">
                <t-button class="space-item" size="small" border-radius="0">小</t-button>
                <t-button class="space-item" size="small" loading border-radius="0">加载中</t-button>
                <t-button class="space-item" size="default">中</t-button>
                <t-button class="space-item" size="default" loading>加载中</t-button>
                <t-button class="space-item" size="large" plain>大</t-button>
                <t-button class="space-item" size="large" plain loading>加载中</t-button>
            </view>
            <view class="flex justify-center space-x-2">
                <t-button class="space-item">正常</t-button>
                <t-button class="space-item" shadow="default">阴影</t-button>
                <t-button class="space-item" disabled>禁用</t-button>
                <t-button class="space-item" hover-class="custom-hover">自定义hover</t-button>
            </view>
            <view class="flex justify-center space-x-2">
                <t-button class="space-item" @tap="onTapButton">Tap事件</t-button>
                <t-button class="space-item" @click="onTapButton">Click事件</t-button>
                <t-button class="space-item" open-type="getUserInfo" @getuserinfo="onGetUserInfo">获取信息</t-button>
            </view>
            <view class="px-4 space-y-2">
                <t-button class="space-item block" block size="large">块级元素</t-button>
                <t-button class="space-item block" block size="large" border-radius="0">块级元素</t-button>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {};
    },
    methods: {
        onGetUserInfo(e) {
            uni.showToast({title: "获取用户信息成功"});
            console.log(12, e);
        },
        onTapButton(e) {
            uni.showToast({title: "点击了按钮"});
            console.log(e);
        },
    },
    mounted() {},
};
</script>
<style lang="scss">
.vi-t-button-demo {
    .custom-hover {
        opacity: 0.2;
    }
    .my-10 {
      margin-top: 2.5rem;
      margin-bottom: 2.5rem;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .space-y-4 {
      --tw-space-y-reverse: 0;
      margin-top: calc(1rem * calc(1 - 0));
      margin-bottom: calc(1rem * 0);
    }
    .space-x-2 {
      --tw-space-x-reverse: 0;
      margin-right: calc(0.5rem * 0);
      margin-left: calc(0.5rem * calc(1 - 0));
    }
    .space-y-2 {
      --tw-space-y-reverse: 0;
      margin-top: calc(0.5rem * calc(1 - 0));
      margin-bottom: calc(0.5rem * 0);
    }
}
</style>
