<template>
    <div>
        <Vue3DraggableResizable @dragging="onDragging" class="draggable" :w="56" :h="56" :resizable="false" :x="1000"
            :y="350">
            <div>
                <div class="bubble" v-if="showMessage" @click="closeMessage">{{ message }}</div>
                <canvas v-show="showPet" id="model_view" @contextmenu.prevent="openMenu"></canvas>
            </div>
            <template v-if="!showPet">
                <VaPopover message="双击显示桌宠">
                    <button class="pet-button" @dblclick="toggleShowPet">
                        <i class="fa-solid fa-paw"></i>
                    </button>
                </VaPopover>
            </template>
            <template v-if="showMenu">
                <VaTreeView :nodes="nodes" :style="menuStyle" class="context-menu">
                    <template #content="node">
                        <VaButton size="small" color="#FFF" @click="handleTreeItemClick(node)">{{ node.label }}
                        </VaButton>
                    </template>
                </VaTreeView>
            </template>
        </Vue3DraggableResizable>
    </div>
</template>

<script setup>
import userApi from '@/api/userApi';
import {Live2DModel} from 'pixi-live2d-display';
import * as PIXI from "pixi.js";
import {computed, onBeforeMount, onMounted, ref} from 'vue';
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import {VaPopover, VaTreeView} from 'vuestic-ui';

window.PIXI = PIXI;

const showPet = ref(true);

const showMenu = ref(false);
const menuX = ref(0)
const menuY = ref(0)

const showMessage = ref(false);
const message = ref("");

const menuStyle = computed(() => ({
    position: 'absolute',
    left: `${menuX.value}px`,
    top: `${menuY.value}px`,
    zIndex: 10,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    maxHeight: '301px',
    overflowY: 'auto'
}))

const openMenu = (e) => {

    const petRect = e.currentTarget.getBoundingClientRect(); // 获取 .pet 的位置

    let x = e.clientX - petRect.left;
    let y = e.clientY - petRect.top;

    menuX.value = x;
    menuY.value = y;
    showMenu.value = true;
}

const handleClickOutside = (e) => {
    if (!e.target.closest('.context-menu')) {
        showMenu.value = false
    }
}

const handleTreeItemClick = (node) => {
    if (node.action) {
        doActions(node);
    }
    else if (node.chat) {
        chat(node);
    }
    else if (node.func) {
        node.func(node);
    }
}

const doActions = (node) => {
    model.motion(node.action);
}

const onDragging = (position) => {
    const maxWidth = window.innerWidth
    const maxHeight = window.innerHeight

    // 防止越界
    // if (left < 0) x.value = 0
    // else if (left + width.value > maxWidth) x.value = maxWidth - width.value
    // else x.value = left

    // if (top < 0) y.value = 0
    // else if (top + height.value > maxHeight) y.value = maxHeight - height.value
    // else y.value = top
}

const menuExit = (node) => {
    console.log("menu exit");
    showMenu.value = false;
}

const toggleShowPet = (node) => {
    showPet.value = !showPet.value;
    menuExit(node);
}

const chat = (node) => {
    beforeChat();
    node.func(node).then((timeout) => {
        afterChat(timeout);
    });
}


let messageTimeoutId;

const closeMessage = () => {
    clearTimeout(messageTimeoutId);
    showMessage.value = false;
    message.value = "";
}

const beforeChat = () => {
    showMessage.value = true;
    menuExit();
}

const afterChat = (seconds) => {
    messageTimeoutId = setTimeout(() => {
        if (showMessage.value == true) closeMessage();
    }, seconds * 1000);
}

const tellingJoke = async (node) => {
    const content = "请给我讲一个笑话，150字以内，最后不要显示多少字";
    try {
        const reply = await userApi.chatWithAI(content);
        console.log(reply);
        message.value = reply.data.data;
    }
    catch (e) {
        console.error(e);
    }
    return 10;
}

const comfort = async (node) => {
    const content = "我心情不好，请安慰我，300字以内，最后不要显示多少字";
    try {
        const reply = await userApi.chatWithAI(content);
        console.log(reply);
        message.value = reply.data.data;
    }
    catch (e) {
        console.error(e);
    }
    return 15;
}
const howToAskForHelp = async (node) => {
    const content = "本网站可以通过工作台进行心理咨询师的选择，在对方确认后开启会话，我该如何向咨询师寻求帮助呢？";
    try {
        const reply = await userApi.chatWithAI(content);
        console.log(reply);
        message.value = reply.data.data;
    }
    catch (e) {
        console.error(e);
    }
    return 40;
}

const test = (node) => {
    model.emit("hit", "Body");
}

const nodes = ref([
    {
        id: 1,
        label: "动作与表情",
        icon: "fa-solid fa-person-running",
        children: [
            { id: 2, label: "摇头", action: "Flick" },
            { id: 5, label: "摸头", action: "Tap" },
            { id: 3, label: "垂眸", action: "FlickDown" },
            { id: 4, label: "高兴", action: "FlickUp" },
            { id: 6, label: "不满", action: "Tap@Body" },
            { id: 7, label: "害羞", action: "Flick@Body" },
        ],
    },
    {
        id: 8,
        label: "与桌宠聊天",
        icon: "fa-solid fa-comment-dots",
        children: [
            { id: 9, label: "给我讲一个笑话", chat: true, func: tellingJoke },
            { id: 10, label: "我心情不好，安慰我", chat: true, func: comfort },
            { id: 10, label: "我该如何向心理咨询师寻求帮助", chat: true, func: howToAskForHelp },
        ],
    },
    // { id: 12, label: "视线跟踪", icon: "motorcycle" },
    { id: 13, label: "隐藏桌宠", icon: "eye", func: toggleShowPet },
    { id: 14, label: "退出菜单", icon: "logout", func: menuExit },
]);

let app;
let model;
let originUpdate;

function addEyesTracked(app, model) {
    app.view.addEventListener("mouseenter", (e) => {
        model.internalModel.motionManager.update = () => { }; // 防止 motion 重置参数
    })

    app.view.addEventListener("mousemove", (e) => {
        const rect = app.view.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 归一化到 [-1, 1] 范围
        const centerX = app.renderer.width / 2;
        const centerY = app.renderer.height / 2;

        const nx = ((x - centerX) / centerX).toFixed(2);
        const ny = -((y - centerY) / centerY).toFixed(2);

        // 设置模型的头部角度和眼球角度
        model.internalModel.coreModel.setParameterValueById("ParamAngleX", nx * 30);
        model.internalModel.coreModel.setParameterValueById("ParamAngleY", ny * 30);
        model.internalModel.coreModel.setParameterValueById("ParamEyeBallX", nx * 1);
        model.internalModel.coreModel.setParameterValueById("ParamEyeBallY", ny * 1);
    });

    app.view.addEventListener("mouseleave", (e) => {
        model.internalModel.motionManager.update = originUpdate;
        model.motion("Idle");
    })

}

const main = async () => {
    const model_view = document.getElementById("model_view");
    app = new PIXI.Application({
        view: model_view,
        autoStart: true,
        width: model_view.clientWidth,
        height: model_view.clientHeight,
        backgroundAlpha: 0,
        antialias: true,
    })

    model = await Live2DModel.from("/live2d/hiyori/runtime/hiyori_pro_t11.model3.json");

    model.interactive = true;
    model.buttonMode = true;
    model.hitArea = new PIXI.Rectangle(0, 0, model.width, model.height);


    // TODO: auto fit resolution
    model.scale.set(0.08);
    model.anchor.set(0.15, 0);


    app.stage.addChild(model);

    // eyes tracked
    // originUpdate = model.internalModel.motionManager.update;
    // eyesTracked(app, model);

    model.on('hit', (hitAreas) => {
        console.log("yes");
    })
}

onMounted(() => {
    window.addEventListener('click', handleClickOutside);
    main();
});

onBeforeMount(() => {
    window.removeEventListener('click', handleClickOutside);
    model?.destroy();
    app?.destroy();
});

</script>

<style scoped>
.pet {
    position: absolute;
    top: 20%;
    left: 50%;
}

#model_view {
    cursor: pointer;
    pointer-events: auto;
    z-index: 5;
    width: 20vh;
    height: 20vh;
}

.context-menu {
    min-width: 30vh;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.pet-button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #FFA07A;
    color: #FFFACD;
    font-size: 24px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    position: relative;
    top: 10vh;
    left: 10vh;
    transform: translate(-50%, -50%);
}

.draggable {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    background: transparent !important;
}
</style>

<style scoped>
.bubble {
    position: absolute;
    top: -10vh;
    left: -25vh;
    width: 30vh;
    height: 20vh;
    background-color: #a8d5f3;
    border-radius: .6em;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: thin;
    /* Firefox */
    scrollbar-color: #999 transparent;
    /* Firefox */
    padding: 8px 12px;
}


/* .bubble::after {
    content: ' ';
    position: absolute;
    right: -20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
    color: #a8d5f3;
    background-color: currentColor;
    background: linear-gradient(135deg, transparent 50%, currentColor 50%);
    transform: rotate(45deg);
    border-radius: 2px;
} */

/* Chrome, Edge, Safari */
.bubble::-webkit-scrollbar {
    width: 6px;
}

.bubble::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
}

.bubble::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
}
</style>
