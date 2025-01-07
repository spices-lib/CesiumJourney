import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";

// Debug
const gui = new dat.GUI()

// Scene
const scene = new THREE.Scene()

// Galaxy
const parameters = {}
parameters.count = 70000
parameters.size = 0.02
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 2
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#ff6030'

const fusion = {}


let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    // Destroy old galaxy
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    // geometry
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // position
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    // points
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

generateGalaxy()

// Sizes
const sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}

// Camera
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(60, aspectRatio)
camera.position.z = 3
scene.add(camera)

// Renderer
let threeCanvasList = document.getElementById("threeContainer")
threeCanvasList.style.position = `absolute`
threeCanvasList.style.top = `0`
threeCanvasList.style.left = `0`
let canvas = document.createElement('canvas')
threeCanvasList.appendChild(canvas)
canvas.style.backgroundColor = `transparent`
const renderer = new THREE.WebGLRenderer({
    canvas : canvas,
})
fusion.threeCanvas = canvas
fusion.threeContext = canvas.getContext('webgl2')

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYWY0MTM0MS0xOGU1LTQxZjUtYTllYy1iYjRkYjJkYzBlMDEiLCJpZCI6NTQ2NDksImlhdCI6MTYyMDEwMjgzOX0.cojh0KQbdymUPmIWIyCU8nCey6OrLQUk50aeirVpXtI";

const cesiumCanvasList = document.getElementById("cesiumContainer")
cesiumCanvasList.style.position = `absolute`
cesiumCanvasList.style.top = `0`
cesiumCanvasList.style.left = `0`
cesiumCanvasList.style.width = `100%`
cesiumCanvasList.style.height = `100%`
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
fusion.cesiumCanvas = viewer.scene.canvas
fusion.cesiumContext = viewer.scene.canvas.getContext('webgl2')

// Add Photorealistic 3D Tiles
const tileset = await Cesium.createGooglePhotorealistic3DTileset({
    // Only the Google Geocoder can be used with Google Photorealistic 3D Tiles.  Set the `geocode` property of the viewer constructor options to IonGeocodeProviderType.GOOGLE.
    onlyUsingWithGoogleGeocoder: true,
})
viewer.scene.primitives.add(tileset)

let position = Cesium.Cartesian3.fromDegrees(60, 39.9, 1000)
viewer.camera.flyTo({
    destination: position,
    orientation:{
        heading:  6.160507542478311,
        pitch:  -0.49982768408170264,
        roll: 6.2826078347680285
    }
})

viewer.scene.requestRenderMode = true;





var canvas1;
var texture1;
var image;
var shaderProgram;
var vertex_buffer;
var texture_buffer;
var index_buffer;
var aVertLocation;
var aTexLocation;
var vertices = [];
var texCoords = [];

var gl;
var gl2;
var canvas2;
var texture2;
var shaderProgram2;
var vertex_buffer2;
var texture_buffer2;
var index_buffer2;
var aVertLocation2;
var aTexLocation2;
var vertices2 = [];
var texCoords2 = [];

let indices = [0, 1, 2, 0, 2, 3];
vertices = [-1, -1, 1, -1, 1, 1, -1, 1];
texCoords = [0, 0, 1, 0, 1, 1, 0, 1];

function initApp()
{
    initWebGL();

    image = new Image();
    image.onload = function(){
        render();
        render2();
    }
    image.crossOrigin = '';
    image.src = 'https://i.imgur.com/ZKMnXce.png';
}

function initWebGL()
{

    canvas1 = document.getElementById('glCanvas1');
    canvas1.style.zIndex = `99`
    gl = canvas1.getContext('webgl');

    /*====================== Shaders =======================*/

    // Vertex shader source code
    var vertCode =
        'attribute vec2 coordinates;' +
        'attribute vec2 aTexCoord;' +
        'varying highp vec2 vTexCoord;' +
        'void main(void) {' +
        'gl_Position = vec4(coordinates,1.0,1.0);' +
        'vTexCoord = aTexCoord;' +
        '}';
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    //fragment shader source code
    var fragCode =
        'uniform sampler2D texture;' +
        'varying highp vec2 vTexCoord;' +
        'void main(void) {' +
        ' gl_FragColor = texture2D(texture, vTexCoord);' +
        '}';
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.deleteShader( vertShader );
    gl.deleteShader( fragShader );
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    aVertLocation = gl.getAttribLocation(shaderProgram, "coordinates");
    aTexLocation = gl.getAttribLocation(shaderProgram, "aTexCoord");

    vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.enableVertexAttribArray(aVertLocation);
    gl.vertexAttribPointer(aVertLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    texture_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
    gl.enableVertexAttribArray(aTexLocation);
    gl.vertexAttribPointer(aTexLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    texture1 = gl.createTexture();
    gl.uniform1i( gl.getUniformLocation( shaderProgram, 'texture' ), 0 );


    //==========================================================//

    canvas2 = document.getElementById('glCanvas2');
    gl2 = canvas2.getContext('webgl');
    var vertShader2 = gl2.createShader(gl2.VERTEX_SHADER);
    var fragShader2 = gl2.createShader(gl2.FRAGMENT_SHADER);
    gl2.shaderSource(vertShader2, vertCode);
    gl2.shaderSource(fragShader2, fragCode);
    gl2.compileShader(vertShader2);
    gl2.compileShader(fragShader2);

    shaderProgram2 = gl2.createProgram();
    gl2.attachShader(shaderProgram2, vertShader2);
    gl2.attachShader(shaderProgram2, fragShader2);
    gl2.deleteShader( vertShader2 );
    gl2.deleteShader( fragShader2 );
    gl2.linkProgram(shaderProgram2);
    gl2.useProgram(shaderProgram2);

    aVertLocation2 = gl2.getAttribLocation(shaderProgram2, "coordinates");
    aTexLocation2 = gl2.getAttribLocation(shaderProgram2, "aTexCoord");

    vertex_buffer2 = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, vertex_buffer2);
    gl2.enableVertexAttribArray(aVertLocation2);
    gl2.vertexAttribPointer(aVertLocation2, 2, gl2.FLOAT, false, 0, 0);
    gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(vertices), gl2.STATIC_DRAW);

    texture_buffer2 = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, texture_buffer2);
    gl2.enableVertexAttribArray(aTexLocation2);
    gl2.vertexAttribPointer(aTexLocation, 2, gl2.FLOAT, false, 0, 0);
    gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(texCoords), gl2.STATIC_DRAW);

    index_buffer2 = gl2.createBuffer();
    gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, index_buffer2);
    gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl2.STATIC_DRAW);

    texture2 = gl2.createTexture();
    gl2.uniform1i( gl2.getUniformLocation( shaderProgram2, 'texture' ), 0 );
}

function render()
{
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.enableVertexAttribArray(aVertLocation);
    gl.enableVertexAttribArray(aTexLocation);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function render2()
{
    gl2.bindTexture(gl2.TEXTURE_2D, texture2);
    gl2.texImage2D(gl2.TEXTURE_2D, 0, gl2.RGBA, gl2.RGBA, gl2.UNSIGNED_BYTE, canvas1);
    gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MAG_FILTER, gl2.LINEAR);
    gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MIN_FILTER, gl2.LINEAR);
    gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_S, gl2.CLAMP_TO_EDGE);
    gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_T, gl2.CLAMP_TO_EDGE);

    gl2.bindTexture(gl2.TEXTURE_2D, texture2);
    gl2.enableVertexAttribArray(aVertLocation2);
    gl2.enableVertexAttribArray(aTexLocation2);
    gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, index_buffer2);
    gl2.drawElements(gl2.TRIANGLES, 6, gl2.UNSIGNED_SHORT,0);
}

document.addEventListener('DOMContentLoaded', initApp);
