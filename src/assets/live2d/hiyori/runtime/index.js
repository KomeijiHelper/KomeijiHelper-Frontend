import * as PIXI from "pixi.js";

window.PIXI = PIXI

import { Live2DModel, Cubism2ModelSettings } from "pixi-live2d-display";

export async function main() {
    const app = new PIXI.Application({
        view: document.getElementById("model_view"),
        autoStart: true,
        width: 180,
        height: 650,
        backgroundAlpha: 0,
    })

    const model = await Live2DModel.from("src/assets/live2d/hiyori/runtime/hiyori_pro_t11.model3.json");

    app.stage.addChild(model);

    // app.renderer.backgroundColor;

    model.scale.set(0.15);
    model.anchor.set(0.3, 0);
}
