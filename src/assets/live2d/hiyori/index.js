import {Live2DModel} from "pixi-live2d-display";
import * as PIXI from "pixi.js";

window.PIXI = PIXI

// Live2DModel.registerTicker(PIXI.Ticker);

// PIXI.Application.registerPlugin(PIXI.TickerPlugin);

// PIXI.Renderer.registerPlugin("interaction",PIXI.InteractionManager);


export async function main() {
    const app = new PIXI.Application({
        view: document.getElementById("model_view"),
        autoStart: true,
        width: 180,
        height: 650,
        backgroundAlpha: 0,
    })

    const model = await Live2DModel.from("/live2d/hiyori/runtime/hiyori_pro_t11.model3.json");

    model.trackedPointers = [{ id: 1, type: 'pointerdown', flags: true }, { id: 2, type: 'mousemove', flags: true }]

    app.stage.addChild(model);

    // app.renderer.backgroundColor;

    model.scale.set(0.15);
    model.anchor.set(0.3, 0);

    model.on('hit',(hitAreas)=>{
        if(hitAreas.includes("body")) {
            console.log("tap_body");
            model.motion("tap_body");
        }
    })
}
