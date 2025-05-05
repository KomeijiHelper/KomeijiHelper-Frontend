// src/router/index.js
import userApi from "@/api/userApi.js";
import {ClearLocalStorage} from "@/utils.js";
import AboutView from "@/views/AboutView.vue";
import AssistantWorkbench from "@/views/AssistantWorkbench.vue";
import ChatRecordsView from "@/views/ChatRecordsView.vue";
import ChatRoomView from "@/views/ChatRoomView.vue";
import FAQView from "@/views/FAQView.vue";
import HomeView from "@/views/HomeView.vue";
import LeadIn from "@/views/LeadIn.vue";
import LoginView from "@/views/LoginView.vue";
import ManagerWorkbench from "@/views/ManagerWorkbench.vue";
import NormalWorkbench from "@/views/NormalWorkbench.vue";
import ProfileView from "@/views/ProfileView.vue";
import RegisterView from "@/views/RegisterView.vue";
import SupervisorWorkbench from "@/views/SupervisorWorkbench.vue";
import {createRouter, createWebHistory} from "vue-router";


const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView,
        meta: { needAuth: false, roles: [-1, 0, 1, 2, 3]}
    },
    {
        path: "/login",
        name: "Login",
        component: LoginView,
        meta: { needAuth: false, roles: [-1, 0, 1, 2, 3]},
        beforeEnter: (to, from, next) => {
            const logged = localStorage.getItem("logged") === "true";
            if (logged) {
                console.log("已登录，进入workbench");
                next("/workbench");
            }
            else {
                next()
            }
        }
    },
    {
        path: "/register",
        name: "Register",
        component: RegisterView,
        meta: { needAuth: false, roles: [-1, 0, 1, 2, 3]},
        beforeEnter: (to, from, next) => {
            const logged = localStorage.getItem("logged") === "true";
            if (logged) {
                console.log("已登录，进入workbench");
                next("/workbench");
            }
            else {
                next()
            }
        }
    },
    {
        path: "/leadIn",
        name: "LeadIn",
        component: LeadIn,
        meta: { needAuth: false, roles: [-1, 0, 1, 2, 3]},
    },
    {
        path: "/about",
        name: "About",
        component: AboutView,
        meta: { needAuth: false, roles: [-1, 0, 1, 2, 3]}
    },
    {
        path: "/workbench",
        name: "Workbench",
        beforeEnter: (to, from, next) => {
            const userRole = localStorage.getItem("userRole") || "-1";
            if (userRole === "0") {
                next("/workbench/normal");
            } else if (userRole === "1") {
                next("/workbench/assistant");
            } else if (userRole === "2") {
                next("/workbench/supervisor");
            } else if (userRole === "3") {
                next("/workbench/manager");
            } else {
                next("/")
            }
        },
        meta: { needAuth: true, roles: [0, 1, 2, 3]}
    },
    {
        path: "/workbench/assistant",
        name: "assistantWorkbench",
        component: AssistantWorkbench,
        meta: { needAuth: true, roles: [1] }
    },
    {
        path: "/workbench/normal",
        name: "NormalWorkbench",
        component: NormalWorkbench,
        meta: { needAuth: true, roles: [0] }
    },
    {
        path: "/workbench/manager",
        name: "ManagerWorkbench",
        component: ManagerWorkbench,
        meta: { needAuth: true, roles: [3] }
    },
    {
        path: "/workbench/supervisor",
        name: "SupervisorWorkbench",
        component: SupervisorWorkbench,
        meta: { needAuth: true, roles: [2] }
    },
    {
        path: "/chat/room",
        name: "ChatRoom",
        component: ChatRoomView,
        meta: { needAuth: true, roles: [0, 1, 2] }
    },
    {
        path: "/chat/history",
        name: "ChatHistory",
        component: ChatRecordsView,
        meta: { needAuth: true, roles: [0, 1, 2]}
    },
    {
        path: "/profile",
        name: "Profile",
        component: ProfileView,
        meta: { needAuth: true, roles: [0, 1, 2, 3] }
    },
    {
        path: "/faq",
        name: "FAQ",
        component: FAQView,
        meta: { needAuth: false }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const getUserClassCode = (userClass) => {
    switch (userClass) {
        case "Normal":{
            return 0;
        }
        case "Assistant":{
            return 1;
        }
        case "Supervisor":{
            return 2;
        }
        case "Manager":{
            return 3;
        }
    }
    return -1;
}
router.beforeEach(async (to, from, next) => {
    let userRole, isAuthenticated;
    const oldUserRole = localStorage.getItem("userRole");
    try {
        const userData = await userApi.checkSession();
        userRole = getUserClassCode(userData.userClass);
        isAuthenticated = localStorage.getItem("logged") === "true";
    } catch (e) {
        isAuthenticated = false;
        userRole = -1;
        localStorage.setItem("logged", false);
        ClearLocalStorage();
    }
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("displayUserRole", userRole === 0?"普通用户":userRole === 1?"咨询师":userRole === 2?"督导":userRole===3?"管理员":"");
    if (userRole.toString() !== oldUserRole) { console.log(userRole, "!=", oldUserRole);window.location.reload(); }
    console.log("from", from.path, "to", to.path);
    if (to.meta.needAuth && !isAuthenticated) {
        console.log("推到leadin", to.meta.needAuth, !isAuthenticated);
        next('/leadIn');
    } else if (to.meta.needAuth && isAuthenticated && to.meta.roles && !to.meta.roles.includes(userRole)) {
        console.log("推到主页", to.meta.roles, !to.meta.roles.includes(userRole));
        next('/');
    } else {
        console.log("无处理")
        next()
    }
});

export default router;
