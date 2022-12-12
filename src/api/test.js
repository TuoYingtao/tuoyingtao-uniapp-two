import { request } from "@/utils/request";

export function test(params) {
    return request.get({
        url: '/index_info',
        params: params,
    })
}

export function userInfoTest(params) {
    return request.get({
        url: '/user/info',
        params: params,
    })
}
