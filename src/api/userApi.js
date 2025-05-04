import router from "@/router/index.js";
import { ClearLocalStorage } from "@/utils.js";
import axios from 'axios';

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
        return result;
    },

    async register(username, password, userClass, email,q, emergencyContact) {
        const postJson = userClass !== 0 ? {
            userName: username,
            password: password,
            userClass: userClass,
            email:email,
            qualification: q,
        } : {
            userName: username,
            password: password,
            userClass: userClass,
            email:email,
            emergencyContact: emergencyContact,
        };
        const result = await apiClient.post('/user/register', postJson);
        localStorage.setItem("userName", username);
        localStorage.setItem("logged", true);
        return result;
    },

    test() {
        return apiClient.get('/user/test');
    },

    async getUsersByUserClass(userClassCode) {
        const postJson = {
            userClassCode: userClassCode,
        };
        return await apiClient.post('/user/getUsersByClass', postJson);
    },

    async getConsultants() {
        const postJson = {
            userClassCode: 1,
        };
        return await apiClient.post('/online/getUser', postJson);
    },

    async getSupervisors(){
        const postJson = {
            userClassCode: 2,
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

    cancelConsulting() {
        return apiClient.get('/consult/cancel_request');
    },

    responseToRequest(patientId, accept) {
        const postJson = {
            patientId: patientId,
            accept: accept,
        }
        return apiClient.post('/consult/response_request', postJson);
    },

    submitUserChange(userJson) {
        return apiClient.post('/user/changeUser', userJson);
    },

    resetPassword(userId) {
        return apiClient.post('/user/resetPassword', userId);
    },

    changePassword(old, password) {
        const postJson = {
            oldPassword: old,
            newPassword: password,
        }
        return apiClient.post('/user/changePassword', postJson);
    },

    changeUserInfo(userJson) {
        return apiClient.post('/user/changeUserInfo', userJson);
    },

    fileUpload(formData) {
        return apiClient.post('/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    rating(approve, rank, cid = null) {
        const postJson = cid === null ? {
            approve: approve,
            rank: rank,
        } : {
            approve: approve,
            rank: rank,
            cid: cid,
        }
        return apiClient.post('/chatRecord/rating', postJson);
    },
    async chatWithAI(content) {
        const postJson = {
            message: content,
        }
        return await apiClient.post('/ai/chat', postJson);
    },
    getHistoryChat() {
        return apiClient.get('/chatRecord/getHistoryChat')
    },
    async getTempChat(name){
        return await apiClient.get('/chatRecord/getTempChat?consultantName='+name)
    },
    getChatContent(chatId) {
        return apiClient.get('/chatRecord/getChatContent',{
            params:{
                fileId:chatId,
            }
        })
    },
    downloadChat(chatId) {
        apiClient.get('/chatRecord/downloadFile', {
            params: {
                fileId: chatId,
            },
            responseType: 'blob'
        },).then(response => {
            const blob = new Blob([response.data]);

            const disposition = response.headers['content-disposition'];
            let fileName;
            if (disposition && disposition.includes('filename=')) {
                fileName = decodeURIComponent(disposition.split('filename=')[1].replace(/"/g, ''));
            }

            // 创建链接并触发下载
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // 文件名
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // 释放 blob 对象
        })
    },
    async getDashboardInfo(){
        return await apiClient.get('/dashboard/consultant/chatRecordCount')
    },
    async getConsultantInfo(){
        return await apiClient.get('/dashboard/consultant/getInfo')
    },
    async getUserCount(){
        return await apiClient.get('/dashboard/manager/userCount');
    },
    async getOnlineCount(){
        return await apiClient.get('/dashboard/manager/onlineUserCount')
    },
    async getPeriodChatRecord(start,end) {
        const postJson = {
            start:start,
            end:end
        };
        return await apiClient.post('/dashboard/consultant/period/chatRecord',postJson);
    },
    async sendCaptcha(type) {
        switch (type) {
            case "changePwd":
                return await apiClient.get('/mail/sendCaptcha/changePwd');
            case "resetPwd":
                return await apiClient.get('/mail/sendCaptcha/resetPwd')
        }
    },
    async sendRegisterCaptcha(name,email) {
        return await apiClient.get('/mail/sendCaptcha/register',{
            params:{
                name:name,
                email:email
            }
        });
    },
    async checkCaptcha(captcha,type) {
        const postJson = {
            captcha:captcha,
            type:type
        }
        return await apiClient.post('/mail/checkCaptcha',postJson);
    },
    async checkRegisterCaptcha(mail,captcha) {
        return await apiClient.post('/mail/checkCaptcha/register',{
            email:mail,
            captcha:captcha
        });
    }
};