// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import AboutView from "@/views/AboutView.vue";
import HomeView from "@/views/HomeView.vue";
import AssistantWorkbench from "@/views/AssistantWorkbench.vue";
import NormalWorkbench from "@/views/NormalWorkbench.vue";
import ManagerWorkbench from "@/views/ManagerWorkbench.vue";
import SupervisorWorkbench from "@/views/SupervisorWorkbench.vue";
import ChatRoomView from "@/views/ChatRoomView.vue";
import userApi from "@/api/userApi.js";

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
            const logged = localStorage.getItem("logged");
            if (logged === "true") {
                console.log("已登录，进入workbench");
                next("/workbench");
            }
            else {
                next()
            }
        }
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
        meta: { needAuth: false, roles: [0, 1, 2, 3]}
    },
    {
        path: "/workbench/assistant",
        name: "assistantWorkbench",
        component: AssistantWorkbench,
        meta: { needAuth: false, roles: [1] }
    },
    {
        path: "/workbench/normal",
        name: "NormalWorkbench",
        component: NormalWorkbench,
        meta: { needAuth: false, roles: [0] }
    },
    {
        path: "/workbench/manager",
        name: "ManagerWorkbench",
        component: ManagerWorkbench,
        meta: { needAuth: false, roles: [3] }
    },
    {
        path: "/workbench/supervisor",
        name: "SupervisorWorkbench",
        component: SupervisorWorkbench,
        meta: { needAuth: false, roles: [2] }
    },
    {
        path: "/chat",
        name: "Chat",
        component: ChatRoomView,
        meta: { needAuth: false, roles: [0, 1, 2] }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    let userRole, isAuthenticated;
    try {
        userRole = await userApi.checkSession();
        isAuthenticated = localStorage.getItem("logged");
    } catch (e) {
        isAuthenticated = false;
        userRole = -1;
        localStorage.setItem("logged", false);
        localStorage.removeItem('userName');
        localStorage.removeItem('session');
    }
    localStorage.setItem("userRole", userRole);
    console.log("from", from.path, "to", to.path);
    if (to.meta.needAuth && isAuthenticated === "false") {
        console.log("推到login", to.meta.needAuth, isAuthenticated === "false");
        next('/login');
    } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
        console.log("推到主页", to.meta.roles, !to.meta.roles.includes(userRole));
        next('/');
    } else {
        console.log("无处理")
        next()
    }
});

export default router;
