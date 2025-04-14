import axios from 'axios';
import router from "@/router/index.js";
import { ClearLocalStorage } from "@/utils.js";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8081', // 基础 URL
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    withCredentials: true,
});

apiClient.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response) {
        switch (error.response.status) {
            case 402:
            {
                alert("用户名或密码错误");
                break;
            }
            case 403:
            {
                await router.back();
                break;
            }
            case 456:
            {
                alert("注册失败");
                break;
            }
        }
    }
    return Promise.reject(error);
});

export default {
    async login(username, password) {
        const postJson = {
            userName: username,
            password: password,
        };
        const result = await apiClient.post('/user/login', postJson);
        localStorage.setItem("userName", username);
        localStorage.setItem("logged", true);
        window.location.reload();
        return result;
    },

    async register(username, password) {
        const postJson = {
            userName: username,
            password: password,
        };
        const result = await apiClient.post('/user/register', postJson);
        localStorage.setItem("userName", username);
        localStorage.setItem("logged", true);
        window.location.reload();
        return result;
    },

    test(){
        return apiClient.get('/user/test');
    },

    async getUsersByUserClass(userClassCode) {
        const postJson = {
            userClassCode: userClassCode,
        };
        return await apiClient.post('/user/getUsersByClass', postJson);
    },

    async getConsultants(){
        const postJson = {
            userClassCode: 1,
        };
        return await apiClient.post('/online/getUser', postJson);
    },

    async checkSession() {
        return (await apiClient.get('/user/checkSession')).data
    },

    async logout() {
        await apiClient.get('/user/logout');
        ClearLocalStorage();
        localStorage.setItem("logged", false);
        window.location.reload();
    },

    consulting(consultingId) {
        return apiClient.get('/consult/connect_request?consult_id=' + consultingId);
    },

    cancelConsulting(){
        return apiClient.get('/consult/cancel_request');
    },

    responseToRequest(patientId, accept){
        const postJson = {
            patientId: patientId,
            accept: accept,
        }
        return apiClient.post('/consult/response_request', postJson);
    },

    submitUserChange(userJson){
        return apiClient.post('/user/changeUser', userJson);
    },

    resetPassword(userId){
        return apiClient.post('/user/resetPassword', userId);
    },

    changePassword(old, password){
        const postJson = {
            oldPassword: old,
            newPassword: password,
        }
        return apiClient.post('/user/changePassword', postJson);
    },

    changeUserInfo(userJson){
        return apiClient.post('/user/changeUserInfo', userJson);
    }
};