// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import AboutView from "@/views/AboutView.vue";
import HomeView from "@/views/HomeView.vue";
import SelectConsultant from "@/views/SelectConsultant.vue";
import AssistantDashboard from "@/views/AssistantDashboard.vue";
import NormalDashboard from "@/views/NormalDashboard.vue";
import ManagerDashboard from "@/views/ManagerDashboard.vue";
import SupervisorDashboard from "@/views/SupervisorDashboard.vue";
<<<<<<< HEAD
import ChatRoom from "@/views/Chat/ChatRoomView.vue";
=======
import ChatRoomView from "@/views/ChatRoomView.vue";
import userApi from "@/api/userApi.js";
>>>>>>> dc669678173e2294296d27c61f23e6b0379024f0

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
                console.log("已登录，进入dashboard");
                next("/dashboard");
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
        path: "/select-consultant",
        name: "SelectConsultant",
        component: SelectConsultant,
        meta: { needAuth: false, roles: [0]}
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        beforeEnter: (to, from, next) => {
            const userRole = localStorage.getItem("userRole") || "-1";
            if (userRole === "0") {
                next("/select-consultant");
            } else if (userRole === "1") {
                next("/dashboard/assistant");
            } else if (userRole === "2") {
                next("/dashboard/supervisor");
            } else if (userRole === "3") {
                next("/dashboard/manager");
            } else {
                next("/")
            }
        },
        meta: { needAuth: false, roles: [0, 1, 2, 3]}
    },
    {
        path: "/dashboard/assistant",
        name: "assistantDashboard",
        component: AssistantDashboard,
        meta: { needAuth: false, roles: [1] }
    },
    {
        path: "/dashboard/normal",
        name: "NormalDashboard",
        component: NormalDashboard,
        meta: { needAuth: false, roles: [0] }
    },
    {
        path: "/dashboard/manager",
        name: "ManagerDashboard",
        component: ManagerDashboard,
        meta: { needAuth: false, roles: [3] }
    },
    {
        path: "/dashboard/supervisor",
        name: "SupervisorDashboard",
        component: SupervisorDashboard,
<<<<<<< HEAD
    },
    {
        path: "/dashboard/chatroom",
        name: "ChatRoomDashboard",
        component: ChatRoom,
=======
        meta: { needAuth: false, roles: [2] }
    },
    {
        path: "/chat",
        name: "Chat",
        component: ChatRoomView,
        meta: { needAuth: false, roles: [0, 1, 2] }
>>>>>>> dc669678173e2294296d27c61f23e6b0379024f0
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
