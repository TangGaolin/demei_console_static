import { fetch } from '../utils/fetch';

export function getStoreList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/store/getStoreList',
        method: 'post',
        data
    });
}

export function updateStoreInfo(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/store/updateStoreInfo',
        method: 'post',
        data
    });
}

export function addStore(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/store/addStore',
        method: 'post',
        data
    });
}

export function getStoreAllMoney(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/storeData/getStoreAllMoney',
        method: 'post',
        data
    });
}

export function getShopEmpData(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/storeData/getShopEmpData',
        method: 'post',
        data
    });
}