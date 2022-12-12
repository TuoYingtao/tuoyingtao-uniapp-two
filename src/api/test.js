import { request } from "@/utils/request";

export function test(params) {
    return request.post({
        url: '/index',
        params: params,
    })
}
