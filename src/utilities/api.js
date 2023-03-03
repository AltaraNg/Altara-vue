import axios from 'axios'
import Auth from './auth'

axios.defaults.baseURL = process.env.VUE_APP_URL;
export const get = url => axios({ method: 'GET', url, headers: { 'Authorization': `Bearer ${Auth.state.api_token}`, 'BNLP-ADMIN-ACCESS': process.env.VUE_APP_BNPL_ACCESS_KEY } });
export const post = (url, data) => axios({
    method: 'POST',
    url,
    data,
    headers: { 'Authorization': `Bearer ${Auth.state.api_token}`, 'BNLP-ADMIN-ACCESS': process.env.VUE_APP_BNPL_ACCESS_KEY  }
});
export const put = (url, data) => axios({
    method: 'PUT',
    url,
    data,
    headers: { 'Authorization': `Bearer ${Auth.state.api_token}`, 'BNLP-ADMIN-ACCESS': process.env.VUE_APP_BNPL_ACCESS_KEY  }
});
export const patch = (url, data) => axios({
    method: 'PATCH',
    url,
    data,
    headers: { 'Authorization': `Bearer ${Auth.state.api_token}`, 'BNLP-ADMIN-ACCESS': process.env.VUE_APP_BNPL_ACCESS_KEY  }
});
export const byMethod = (method, url, data, params = {}) => axios({
    method,
    url,
    data,
    params,
    headers: { 'Authorization': `Bearer ${Auth.state.api_token}` }
});
export const postD = (url, data) => axios({
    url,
    data,
    method: 'POST',
    responseType: 'blob',
    headers: { 'Authorization': `Bearer ${Auth.state.api_token}` }
});
export const del = url => axios({ url, method: 'DELETE', headers: { 'Authorization': `Bearer ${Auth.state.api_token}` } });

export const interceptors = cb => axios.interceptors.response.use(res => res, err => {
    cb(err);
    return Promise.reject(err)
});

/*helper functions for easier calls use of
 * axios includes the api_token for every
 * api call to the backend.*/