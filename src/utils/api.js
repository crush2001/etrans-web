import axios from "axios";
import { Message } from "element-ui";

axios.interceptors.response.use(success=>{
    if (success.status && success.status === 200) {
        if (success.data.code === 500) {
            Message.error({message:success.data.message});
            return;
        }
        if (success.data.message) {
            Message.success({message:success.data.message});
        }
    }
    return success.data;
},error => {
    if (error.response.data.message) {
        Message.error({message:error.response.data.message});
    }else {
        Message.error({message:'未知错误'});
    }
    return;
});

axios.interceptors.request.use(config=>{
    if (window.sessionStorage.getItem('token')) {
        config.headers['Authorization'] = window.sessionStorage.getItem('token');
    }
    return config;
},error => {
    console.log(error);
});

axios.defaults.headers.common['Authorization'] = `${window.sessionStorage.getItem('token')}`

let base = '';
export const postRequest=(url,params)=>{
    return axios({
        method:'post',
        url:`${base}${url}`,
        params
    })
}
export const getRequest=(url,params)=>{
    return axios({
        method:'get',
        url:`${base}${url}`,
        params
    })
}

export const putRequest=(url,params)=>{
    return axios({
        method: 'put',
        url:`${base}${url}`,
        data:params
    })
}

export const deleteRequest=(url,params)=>{
    return axios({
        method: 'delete',
        url:`${base}${url}`,
        data:params
    })
}
