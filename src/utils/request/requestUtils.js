export function joinTimestamp(join, result, isPrefix = true) {
    if (!join) return result ? '' : {};
    const now = new Date().getTime();
    if (result) {
        return `${isPrefix ? '?' : '&'}_t=${now}`
    }
    return { _t: now };
}

export function setObjToUrlParams(baseUrl, obj) {
    let parameters = '';
    for (const key in obj) {
        parameters += `${key}=${encodeURIComponent(obj[key])}&`;
    }
    parameters = parameters.replace(/&$/, '');
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}
