import { getUserInfo, Login } from "@/api/user";
import { setToken } from "@/utils/storage";

const state = {
	info: null, // 用户信息 {id, name}
	// 定位信息
	location: {
		longitude: null,
		latitude: null,
		/** 获取时间，毫秒时间戳，0表示未获取过 */
		create_time: 0,
	}
}

const mutations = {
	setInfo(state, payload = null) {
		state.info = payload;
	},
	// 设置位置
	setLocation(state, payload) {
		state.location.longitude = payload.longitude ?? null;
		state.location.latitude = payload.latitude ?? null;
		state.location.create_time = (payload.longitude || payload.latitude) ? new Date().valueOf() : 0;
	}
}

const actions = {
	/** 调用wx.login进行登录，同时更新session_key */
	login({ commit, dispatch }) {
		return uni.login({ provider: "weixin" }).then(([error, result]) => {
			if (error) throw new Error(result.errMsg ?? error);
			return Login({ code: result.code }).then((res) => {
				setToken(res.data);
				// 调试登陆
				// setToken('23406f0a0e4e2456ba85d7ffffd7a3aa');
				return dispatch("updateInfo");
			});
		});
	},
	logout({ commit }) {
		setToken();
		commit("setInfo");
		return Promise.resolve();
	},
	// 调接口更新用户信息
	updateInfo({ commit }) {
		return getUserInfo().then((res) => {
			if (res.code) throw new Error(res.msg);
			commit("setInfo", res.data);
			return res.data;
		});
	},

	// 获取用户位置
	// 如果已获取过，会返回上次位置
	getLocation({ state, commit }, payload = {
		forceUpdate: false, // 是否强制更新
	}) {
		let locationPromise = Promise.resolve(state.location);
		if (state.location.create_time == 0 || payload.forceUpdate) {
			locationPromise = uni.getLocation({
				type: 'gcj02'
			}).then(([err, res]) => {
				if (err) throw new Error(err?.errMsg ?? '未知错误');
				commit('setLocation', { longitude: res.longitude, latitude: res.latitude });
				return state.location;
			})
		}
		return locationPromise
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
