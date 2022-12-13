<script>
  import { test, userInfoTest } from "@/api/test";
  import { checkAppUpdate, getSystemInfo, isSearchScene } from "@/utils/tools";

  export default {
    // 全局变量机制
    globalData: {
      text: 'text'
    },
		onLaunch: function(options) {
      // 获取设备信息
      const systemInfo = getSystemInfo();
      console.log(systemInfo)
      // 扫码参数
      const search = isSearchScene(options);
      // 检测小程序版本信息
      checkAppUpdate();
      console.log('App Launch', this.globalData, process.env)
		},
    onShow: function() {
      console.log('ROUTES', ROUTES)
      test({a: 1}).then(res => {
        console.log('首页-----', res)
      });
      userInfoTest().then(res => {
        console.log('地址----1', res)
      })
      userInfoTest().then(res => {
        console.log('地址-----2', res)
      })
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
  @import "@/common/css/common.scss";
  // uView
  @import "uview-ui/index.scss";
</style>
