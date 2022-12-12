import { request } from "@/utils/request";

export function test(params) {
    return request.get({
        url: '/index_info',
        params: params,
    })
}
