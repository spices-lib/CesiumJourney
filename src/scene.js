import * as Cesium from "cesium";
import * as dat from 'dat.gui'
import {
    Fog,
    SkyBox
} from "cesium";

// Debug UI
const gui = new dat.GUI()

const drawVector3 = (ui, vector3, min = 0, max = 1, range = 0.01) => {
    let folder = ui.addFolder(vector3.toString())
    folder.add(vector3, "x").min(min).max(max).step(range)
    folder.add(vector3, "y").min(min).max(max).step(range)
    folder.add(vector3, "z").min(min).max(max).step(range)
}

export class SpicesSkyAtmosphere {
    constructor() {
        this.instance = new Cesium.SkyAtmosphere()

        let folder = gui.addFolder("SkyAtmosphere")
        folder.add(this.instance, "show")
        folder.add(this.instance, "perFragmentAtmosphere")
        folder.add(this.instance, "atmosphereLightIntensity").min(0).max(200).step(1)
        folder.add(this.instance, "atmosphereRayleighScaleHeight").min(0).max(50000).step(100)
        folder.add(this.instance, "atmosphereMieScaleHeight").min(0).max(20000).step(100)
        folder.add(this.instance, "atmosphereMieAnisotropy").min(-1).max(1).step(0.01)
        folder.add(this.instance, "hueShift").min(0).max(1).step(0.01)
        folder.add(this.instance, "saturationShift").min(-1).max(1).step(0.01)
        folder.add(this.instance, "brightnessShift").min(-1).max(1).step(0.01)
    }
}

export class SpicesFog {
    constructor() {
        this.instance = new Cesium.Fog()

        let folder = gui.addFolder("Fog")
        folder.add(this.instance, "enabled")
        folder.add(this.instance, "renderable")
        folder.add(this.instance, "density").min(0).max(0.002).step(0.0001)
        folder.add(this.instance, "heightScalar").min(0).max(0.02).step(0.0001)
        folder.add(this.instance, "maxHeight").min(0).max(4000000).step(10000)
        folder.add(this.instance, "visualDensityScalar").min(0).max(1).step(0.01)
        folder.add(this.instance, "screenSpaceErrorFactor").min(0).max(10).step(0.1)
        folder.add(this.instance, "minimumBrightness").min(0).max(1).step(0.01)
        folder.add(this.instance, "heightFalloff").min(0).max(1).step(0.01)
    }
}

export class SpicesPostProcessStages {
    constructor() {
        this.instance = new Cesium.PostProcessStageCollection()

        let folder = gui.addFolder("PostProcess")
        folder.add(this.instance, "tonemapper", {
            REINHARD: Cesium.Tonemapper.REINHARD,
            MODIFIED_REINHARD: Cesium.Tonemapper.MODIFIED_REINHARD,
            FILMIC: Cesium.Tonemapper.FILMIC,
            ACES: Cesium.Tonemapper.ACES,
            PBR_NEUTRAL: Cesium.Tonemapper.PBR_NEUTRAL
        })
        folder.add(this.instance, "exposure").min(0).max(1).step(0.01)
    }
}

export class SpicesDirectionalLight {
    constructor() {
        this.instance = new Cesium.DirectionalLight({
            direction: new Cesium.Cartesian3(1),
            intensity: 10
        })

        const parameters = {
            color: 0xff0000,
        }

        let folder = gui.addFolder("DirectionalLight")
        drawVector3(folder, this.instance.direction, -1, 1, 0.01)
        folder.add(this.instance, "intensity").min(0).max(30).step(1)
        folder.addColor(parameters, "color").onChange(()=>{
            //this.instance.color.clone(parameters.color)
        })
    }
}
