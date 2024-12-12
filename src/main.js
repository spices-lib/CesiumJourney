import {CustomShader, Terrain, Viewer} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";

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

// Enable rendering the sky
viewer.scene.skyAtmosphere.show = true;

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
try {
    const tileset = await Cesium.createGooglePhotorealistic3DTileset({
        // Only the Google Geocoder can be used with Google Photorealistic 3D Tiles.  Set the `geocode` property of the viewer constructor options to IonGeocodeProviderType.GOOGLE.
        onlyUsingWithGoogleGeocoder: true,
    })
    viewer.scene.primitives.add(tileset)
    tileset.customShader = shader
} catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset.
  ${error}`)
}





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

