<script>
  import { test } from "@/api/test";
  import {request} from "@/utils/request";

  export default {
    // 全局变量机制
    globalData: {
      text: 'text'
    },
		onLaunch: function() {
      console.log('App Launch', this.globalData, process.env)
		},
    onShow: function() {
      console.log('App Show', this.globalData, process.env)
      console.log('ROUTES', ROUTES)
      test({a: 1}).then(res => {
        console.log(res)
      });
      const requestInstance = request.getRequest();
      requestInstance({ method: 'get', url: '/user/info' }).then(res => {
        console.log('地址----1', res)
        console.log('地址用户信息-----1', res.user)
      })
      requestInstance({ method: 'get', url: '/user/info' }).then(res => {
        console.log('地址-----2', res)
        console.log('地址用户信息------2', res.user)
      })

		},
		onHide: function() {
      console.log('App Hide', this.globalData, process.env)
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
  @import "@/common/css/common.scss";
</style>
