import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";
import Stats from "stats.js/src/Stats.js";

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

let position = Cesium.Cartesian3.fromDegrees(60, 39.9, 1000)
let canvas = document.getElementById("cesiumContainer")
let pt = viewer.entities.add({
    id: "point",
    position: position,
    point: {
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
    },
});
viewer.camera.flyTo({
    destination: position,
    orientation:{
        heading:  6.160507542478311,
        pitch:  -0.49982768408170264,
        roll: 6.2826078347680285
    }
})

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

let nCount = 10 * 10000
let objects = []
// object
for(let i = 0; i < nCount; i++) {


    const element = document.createElement('object');
    cameraElement.appendChild(element)
    element.style.width = `300px`
    element.style.display = `none`
    element.style.height = `500px`
    element.className = 'object';
    element.style.backgroundColor = 'rgba(0,127,127,0.25)'
    element.style.position = 'absolute';
    element.style.pointerEvents = 'auto';
    element.style.userSelect = 'none';
    element.setAttribute('draggable', false);
    element.style.pointerEvents = `none`

    objects.push(element)
}

// object
for(let i = 0; i < nCount; i++) {

    let modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(position.x, position.y, position.z), new Cesium.Matrix4())
    objects[i].style.transform = 'translate(-50%,-50%)' + `matrix3d(
        ${modelMatrix[0]}, ${modelMatrix[1]}, ${modelMatrix[2]}, ${modelMatrix[3]},
        ${-modelMatrix[4]}, ${-modelMatrix[5]}, ${-modelMatrix[6]}, ${-modelMatrix[7]},
        ${modelMatrix[8]}, ${modelMatrix[9]}, ${modelMatrix[10]}, ${modelMatrix[11]},
        ${modelMatrix[12]}, ${modelMatrix[13]}, ${modelMatrix[14]}, ${modelMatrix[15]}
    )`
}

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
