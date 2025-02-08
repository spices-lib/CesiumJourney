import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import Stats from "stats.js/src/Stats.js";
import {CSS3DObject} from "./CSS3DObject.js";
import {CSS3DView} from "./CSS3DView.js";
import {CSS3DOGroup} from "./CSS3DGroup.js";

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

// Add Photorealistic 3D Tiles
const tileset = await Cesium.createGooglePhotorealistic3DTileset({
    // Only the Google Geocoder can be used with Google Photorealistic 3D Tiles.  Set the `geocode` property of the viewer constructor options to IonGeocodeProviderType.GOOGLE.
    onlyUsingWithGoogleGeocoder: true,
})
viewer.scene.primitives.add(tileset)
let canvas = document.getElementById("cesiumContainer")

viewer.scene.requestRenderMode = true;

// view
let view = new CSS3DView({viewer: viewer})
canvas.appendChild( view.view );

// object
let objects = []

for(let i = 0; i <= 1; i+= 4) {
    for(let j = 0; j < 1; j+= 4) {

        let obj = new CSS3DObject({
            viewer: viewer,
            position: new Cesium.Cartesian3(114.253, 23.872, 1000),
            rotation: new Cesium.Cartesian3(90, 0, 0),
            scale: new Cesium.Cartesian3(Cesium.Math.randomBetween(1, 1), Cesium.Math.randomBetween(1, 1), Cesium.Math.randomBetween(1, 1)),
            offset: new Cesium.Cartesian2(0, 100),
        })
        obj.debugPosition()

        objects.push(obj)

        view.camera.appendChild(obj.div)
    }
}

objects[0].focus()

// group
/*let group = new CSS3DOGroup({
    position: new Cesium.Cartesian3(0, 0, 0),
    rotation: new Cesium.Cartesian3(0, 0, 0),
    scale: new Cesium.Cartesian3(1, 1, 1),
})

group.appendChild(objects)

view.camera.appendChild(group.div)*/

console.log("finish")

let stats = new Stats()
stats.showPanel(1);
document.body.appendChild( stats.dom );

const tick = () => {

    stats.begin();

    viewer.scene.requestRender()

    // view
    view.update(canvas.clientWidth, canvas.clientHeight)

    stats.end();
    window.requestAnimationFrame(tick)
}

tick()
