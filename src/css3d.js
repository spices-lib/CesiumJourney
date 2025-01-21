import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import Stats from "stats.js/src/Stats.js";
import CSS3DObject from "./CSS3DObject.js";

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


let obj = new CSS3DObject({
    viewer: viewer,
    position: new Cesium.Cartesian3.fromDegrees(60, 39.9, 1000)
})
obj.debugPosition()
obj.focus()

viewer.scene.requestRenderMode = true;

// view
const viewElement = document.createElement( 'view' )
canvas.appendChild( viewElement );
viewElement.style.position = `absolute`
viewElement.style.top = `0`
viewElement.style.left = `0`
viewElement.style.transformOrigin = '0 0'
viewElement.style.pointerEvents = 'none'
viewElement.style.display = `inline-block`

// camera
const cameraElement = document.createElement( 'camera' )
viewElement.appendChild( cameraElement )
cameraElement.style.display = `inline-block`

// object
cameraElement.appendChild(obj.div)

console.log("finish")

function updateDiv() {

    // view
    viewElement.style.width = `${ canvas.clientWidth }px`
    viewElement.style.height = `${ canvas.clientHeight }px`

    // camera
    cameraElement.style.transformStyle = 'preserve-3d';
    cameraElement.style.width = `${ canvas.clientWidth }px`
    cameraElement.style.height = `${ canvas.clientHeight }px`
    const viewMatrix = viewer.camera.viewMatrix
    const frustumMatrix = new Cesium.PerspectiveFrustum({
        fov: Cesium.Math.toRadians(60),
        aspectRatio: canvas.clientWidth / canvas.clientHeight,
        near: 1.0,
        far: 1000.0
    }).projectionMatrix;
    const fov = frustumMatrix[ 5 ] * 0.5 * canvas.clientHeight;
    const cameraCSSMatrix = `scale(1)` + 'translateZ(' + fov + 'px)' + `matrix3d(
        ${viewMatrix[0]}, ${-viewMatrix[1]}, ${viewMatrix[2]}, ${viewMatrix[3]},
        ${viewMatrix[4]}, ${-viewMatrix[5]}, ${viewMatrix[6]}, ${viewMatrix[7]},
        ${viewMatrix[8]}, ${-viewMatrix[9]}, ${viewMatrix[10]}, ${viewMatrix[11]},
        ${viewMatrix[12]}, ${-viewMatrix[13]}, ${viewMatrix[14]}, ${viewMatrix[15]}
    )`
    const perspective = 'perspective(' + fov + 'px) ';

    const style = perspective + cameraCSSMatrix + 'translate(' + 0.5 * canvas.clientWidth + 'px,' + 0.5 * canvas.clientHeight + 'px)'
    cameraElement.style.transform = style

}

let stats = new Stats()
stats.showPanel(1);
document.body.appendChild( stats.dom );

const tick = () => {

    stats.begin();

    viewer.scene.requestRender()

    updateDiv()


    stats.end();
    window.requestAnimationFrame(tick)
}

tick()
