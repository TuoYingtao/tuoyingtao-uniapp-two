<script>
  import { test } from "@/api/test";

  export default {
    // 全局变量机制
    globalData: {
      text: 'text'
    },
		onLaunch: function() {
      console.log('App Launch', this.globalData, process.env)
		},
    onShow: async function() {
      console.log('App Show', this.globalData, process.env)
      console.log('ROUTES', ROUTES)
      test({a: 1}).then(res => {
        console.log(res)
      });
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
