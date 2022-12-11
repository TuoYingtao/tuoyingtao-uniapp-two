const state = {
		// 项目名称和版本号，可在页面中用于显示
		app_name: '',
		app_version: '',
		app_version_code: 0,
		// 服务端配置
		server_config: {
			// 开屏背景图
			entry_background_img: '',
		},
		// 设备信息
		device_info: {
			SDKVersion: '',
			batteryLevel: 0,
			benchmarkLevel: 1,
			brand: '',
			deviceId: '',
			deviceOrientation: '',
			devicePixelRatio: 1,
			enableDebug: false,
			fontSizeSetting: 16,
			language: 'zh_CN',
			model: '',
			pixelRatio: 1,
			platform: '',
			safeArea: {
				bottom: 0,
				height: 0,
				left: 0,
				right: 0,
				top: 0,
				width: 0,
			},
			safeAreaInsets: {
				bottom: 0,
				left: 0,
				right: 0,
				top: 0,
			},
			screenHeight: 0,
			screenWidth: 0,
			statusBarHeight: 44,
			system: '',
			version: '',
			windowHeight: 0,
			windowWidth: 0,

			// 在小程序下存在
			appName: '',
			appVersion: '',
			appVersionCode: 0,
		},
		// 胶囊按钮位置
		menu_button_bounding: {
			bottom: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0,
			width: 0
		}
	}

const mutations = {
		setAppName(state, name = '') {
			state.app_name = name
		},
		setAppVersion(state, version = '') {
			state.app_version = version
		},
		setAppVersionCode(state, code = 0) {
			state.app_version_code = code
		},
		setServerConfig(state, payload = null) {
			Object.assign(state.server_config, payload);
		},
		setDeviceInfo(state, payload = {}) {
			Object.assign(state.device_info, payload);
		},
		getMenuButtonBounding(state) {
			Object.assign(state.menu_button_bounding, uni.getMenuButtonBoundingClientRect());
		}
}

const actions = {
	// 自动获取系统信息和胶囊按钮
	updateDeviceInfo({ commit }) {
		return uni.getSystemInfo().then(([err, sysinfo]) => {
		if (err) throw new Error(err?.msg ?? "获取系统信息失败");
		commit("setDeviceInfo", sysinfo);
		return sysinfo
	});
	},
	// 应用初始化，自动应用名、版本号、设备信息、胶囊按钮等固定信息。
	init({ dispatch, commit, state }) {
		commit('getMenuButtonBounding')
		return dispatch('updateDeviceInfo').then(sysinfo => {
			if (sysinfo.appName) {
				commit('setAppName', sysinfo.appName)
			}
			if (sysinfo.appVersion) {
				commit('setAppVersion', sysinfo.appVersion)
			}
			if (sysinfo.appVersionCode) {
				commit('setAppVersionCode', sysinfo.appVersionCode)
			}
			return {
				app_name: state.app_name,
				app_version: state.app_version,
				app_version_code: state.app_version_code,
				device_info: state.device_info,
				menu_button_bounding: state.menu_button_bounding,
			}
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}


