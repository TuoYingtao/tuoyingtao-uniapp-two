import qs from 'qs';
import cloneDeep from 'lodash/cloneDeep';
import { navigateTo } from '@/utils/navigate';

/**
 * 判断是否是扫码进入的小程序
 * onLoad 中获取所有入参，依照小程序规则，如 page=user&pid=1，将解析为 {page:'user', pid:'1'}
 * @param query 扫码参数
 */
export function isSearchScene(query) {
	console.info("启动页加载完成，参数:", query);
	let data = query;
	if (query.scene) {
		// 扫码进入的情况
		try {
			let sceneQuery = qs.parse(decodeURIComponent(query.scene));
			if (sceneQuery) {
				data = sceneQuery;
			}
			console.info("检测到扫码进入, query:", {...sceneQuery});
		} catch (e) {}
	}
	return data;
}

/**
 * 跳转处理
 */
export function handlePageNavigate() {
	const defaultPage = "/pages/index/index";
	// 检查页面是否存在
	let path = ROUTES.find((it) => it.path.endsWith(this.query.p))?.path ?? defaultPage;
	let query = cloneDeep(this.query);
	delete query.p;

	navigateTo({url: path, query}, "redirect");
}

/**
 * 获取网络图片缓存到本地
 */
export async function getImageUrl(url) {
	let path = null
	await uni.getImageInfo({
		src: url
	}).then(res => {
		path = res[1].path
	})
	return path
}

/**
 * 获取设备信息
 */
export function getSystemInfo() {
	try {
		const res = wx.getSystemInfoSync()
		const { platform, model } = res;
		if (['ios', 'mac', 'devtools'].includes(platform)) {
			res.isIosPlatform = true
		}
		if (
			/iphone\sx/i.test(model) ||
			(/iphone/i.test(model) && /unknown/.test(model)) ||
			/iphone\s1[1-9]/i.test(model)
		) {
			//iphone出新机型，小程序没更新会出现unknown的情况
			res.isIphoneX = true
		}
		return res;
	} catch (e) {
		// Do something when catch error
	}
}

/**
 * 检查小程序是否可更新
 */
export const checkAppUpdate = function() {

	// 小程序版本支持getUpdateManager方法
	if (uni.canIUse('getUpdateManager')) {
		const updateManager = uni.getUpdateManager();
		// 检查版本完成
		updateManager.onCheckForUpdate(function(res) {
			if (res.hasUpdate) {
				// 新版下载完成
				updateManager.onUpdateReady(function() {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，请重启小程序体验新版',
						showCancel: false,
						success: function() {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					})
				})
				// 下载失败
				updateManager.onUpdateFailed(function (res) {
					// 新的版本下载失败
					uni.showModal({
						title: '更新失败',
						content: '新版本下载失败，请删除当前小程序，重新搜索下载～',
						showCancel: false,
						success: (res) => {
							// 新版下载失败，退出小程序
							uni.navigateBack({
								delta: 0,
							});
						},
					});
				});
			}
		});
	}else{
		//如果用户手机的小程序版本过低提示
		uni.showModal({
			title: '温馨提示',
			content: '当前微信版本过低，功能无法使用，请升级微信客户端',
			showCancel: false
		});
	}
}
