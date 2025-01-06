import {CustomShader, Terrain, Tonemapper, Viewer} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import Stats from "stats.js/src/Stats.js";
import { SpicesSkyAtmosphere, SpicesFog, SpicesPostProcessStages, SpicesDirectionalLight } from "./scene.js";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYWY0MTM0MS0xOGU1LTQxZjUtYTllYy1iYjRkYjJkYzBlMDEiLCJpZCI6NTQ2NDksImlhdCI6MTYyMDEwMjgzOX0.cojh0KQbdymUPmIWIyCU8nCey6OrLQUk50aeirVpXtI";

const viewer = new Cesium.Viewer("cesiumContainer", {
    timeline: false,
    animation: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
    // The globe does not need to be displayed,
    // since the Photorealistic 3D Tiles include terrain
    globe: false,
});

// Rendering Settings
viewer.scene.skyAtmosphere = new SpicesSkyAtmosphere().instance
viewer.scene.fog = new SpicesFog().instance
viewer.scene.postProcessStages = new SpicesPostProcessStages().instance
viewer.scene.shadowMap.enabled = true
viewer.scene.shadowMap.softShadows = true
viewer.scene.shadowMap.size = 8192
viewer.scene.light = new SpicesDirectionalLight().instance

console.log(viewer.scene)

const shader = new CustomShader({
    uniforms: {},
    varying: {},
    vertexShaderText: `
         void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) 
         {
         }
    `,
    fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) 
        {
            //material.diffuse = vec3(1.0f, 1.0f, 1.0f);
        }
    `
})

// Add Photorealistic 3D Tiles
const tileset = await Cesium.createGooglePhotorealistic3DTileset({
    // Only the Google Geocoder can be used with Google Photorealistic 3D Tiles.  Set the `geocode` property of the viewer constructor options to IonGeocodeProviderType.GOOGLE.
    onlyUsingWithGoogleGeocoder: true,
})
viewer.scene.primitives.add(tileset)
tileset.customShader = shader

console.log(tileset)

// Point the camera at the Googleplex
viewer.scene.camera.setView({
    destination: new Cesium.Cartesian3(
        -2693797.551060477,
        -4297135.517094725,
        3854700.7470414364,
    ),
    orientation: new Cesium.HeadingPitchRoll(
        4.6550106925119925,
        -0.2863894863138836,
        1.3561760425773173e-7,
    ),
});

viewer.scene.requestRenderMode = true;

let stats = new Stats()
stats.showPanel(1);
document.body.appendChild( stats.dom );


viewer.scene.preUpdate.addEventListener(()=>{

})

const tick = () => {

    stats.begin();

    viewer.scene.requestRender()

    viewer

    stats.end();

    window.requestAnimationFrame(tick)
}

tick()
