<template>
        <div>
            <canvas id="model_view" @contextmenu.prevent="openMenu" v-if="showPet"></canvas>
            <VaTreeView :nodes="nodes" :style="menuStyle" class="context-menu" v-if="showMenu">
                <template #content="node">
                    <VaButton size="small" color="#FFF" @click="handleTreeItemClick(node)">{{ node.label }}</VaButton>
                </template>
            </VaTreeView>
        </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed } from 'vue';
import * as PIXI from "pixi.js";
import { Live2DModel } from 'pixi-live2d-display';

window.PIXI = PIXI;

const showPet = ref(true);

const showMenu = ref(false);
const menuX = ref(0)
const menuY = ref(0)

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
    if (node.type) {
        doActions(node);
    }
    else if (node.func) {
        node.func(node);
    }
}

const doActions = (node) => {
    model.motion(node.type);
}

const menuExit = (node) => {
    console.log("menu exit");
    showMenu.value = false;
}

const toggleShowPet = (node) => {
    showPet.value = !showPet.value;
}

const test = (node) => {
    console.log("test");
    model.emit("hit", "Body");
}

const nodes = ref([
    {
        id: 1,
        label: "动作",
        icon: "healing",
        children: [
            { id: 2, label: "Flick", type: "Flick" },
            { id: 3, label: "FlickDown", type: "FlickDown" },
            { id: 4, label: "FlickUp", type: "FlickUp" },
            { id: 5, label: "Tap", type: "Tap" },
            { id: 6, label: "Tap Body", type: "Tap@Body" },
            { id: 7, label: "Flick Body", type: "Flick@Body" },
        ],
    },
    {
        id: 8,
        label: "聊天",
        icon: "interests",
        children: [
            { id: 9, label: "Text adventures" },
            { id: 10, label: "Graphic adventures" },
            { id: 11, label: "Visual novels" },
        ],
    },
    { id: 12, label: "视线跟踪", icon: "motorcycle" },
    { id: 13, label: "隐藏", icon: "eye", func: toggleShowPet },
    { id: 14, label: "退出", icon: "logout", func: menuExit },
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

function draggable(model) {
    model.buttonMode = true;
    model.on("pointerdown", (e) => {
        console.log("drag")
        model.dragging = true;
        model._pointerX = e.data.global.x - model.x;
        model._pointerY = e.data.global.y - model.y;
    });
    model.on("pointermove", (e) => {
        if (model.dragging) {
            model.position.x = e.data.global.x - model._pointerX;
            model.position.y = e.data.global.y - model._pointerY;
        }
    });
    model.on("pointerupoutside", () => (model.dragging = false));
    model.on("pointerup", () => (model.dragging = false));
}

const main = async () => {
    app = new PIXI.Application({
        view: document.getElementById("model_view"),
        autoStart: true,
        width: 400,
        height: 400,
        backgroundAlpha: 0,
        interactive: true,
    })

    model = await Live2DModel.from("/live2d/hiyori/runtime/hiyori_pro_t11.model3.json");

    model.interactive = true;
    model.buttonMode = true;
    model.hitArea = new PIXI.Rectangle(0, 0, model.width, model.height);

    // app.renderer.backgroundColor;

    model.scale.set(0.08);
    model.anchor.set(-0.25, -0.2);


    app.stage.addChild(model);
    draggable(model);
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
}

.context-menu {
    min-width: 20vh;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

</style>
