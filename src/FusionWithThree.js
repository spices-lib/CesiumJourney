import * as THREE from 'three'
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";
import * as Cesium from "cesium";

// boundaries in WGS84 to help with syncing the renderers
var minWGS84 = [115.23,39.55];
var maxWGS84 = [116.23,41.55];
var cesiumContainer = document.getElementById("cesiumContainer");
cesiumContainer.style.position = `absolute`
cesiumContainer.style.top = `0px`
cesiumContainer.style.left = `0px`
cesiumContainer.style.width = `100%`
cesiumContainer.style.height = `100%`
var ThreeContainer = document.getElementById("threeContainer");
ThreeContainer.style.position = `absolute`
ThreeContainer.style.top = `0px`
ThreeContainer.style.left = `0px`
ThreeContainer.style.width = `100%`
ThreeContainer.style.height = `100%`
ThreeContainer.style.pointerEvents = `none`

var _3Dobjects = []; //Could be any Three.js object mesh
var three = {
    renderer: null,
    camera: null,
    scene: null
};

var cesium = {
    viewer: null
};

await initCesium(); // Initialize Cesium renderer
initThree(); // Initialize Three.js renderer
//init3DObject(); // Initialize Three.js object mesh with Cesium Cartesian coordinate system
loop(); // Looping renderer

async function initCesium() {

    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYWY0MTM0MS0xOGU1LTQxZjUtYTllYy1iYjRkYjJkYzBlMDEiLCJpZCI6NTQ2NDksImlhdCI6MTYyMDEwMjgzOX0.cojh0KQbdymUPmIWIyCU8nCey6OrLQUk50aeirVpXtI";

    cesium.viewer = new Cesium.Viewer(cesiumContainer, {
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
    cesium.viewer.scene.primitives.add(tileset)

    var center = Cesium.Cartesian3.fromDegrees(
        (minWGS84[0] + maxWGS84[0]) / 2,
        ((minWGS84[1] + maxWGS84[1]) / 2) - 1,
        200000
    );
    cesium.viewer.camera.flyTo({
        destination: center,
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-60),
            roll: Cesium.Math.toRadians(0)
        },
        duration: 3
    });
}

function initThree(){
    var fov = 45;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspect = width / height;
    var near = 1;
    var far = 10*1000*1000; // needs to be far to support Cesium's world-scale rendering

    three.scene = new THREE.Scene();
    three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    three.renderer = new THREE.WebGLRenderer({alpha: true});
    ThreeContainer.appendChild(three.renderer.domElement);

    // Galaxy
    const parameters = {}
    parameters.count = 70000
    parameters.size = 0.02 * 2000.0
    parameters.radius = 5
    parameters.branches = 3
    parameters.spin = 1
    parameters.randomness = 0.2
    parameters.randomnessPower = 2
    parameters.insideColor = '#ff6030'
    parameters.outsideColor = '#ff6030'

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

        var center = Cesium.Cartesian3.fromDegrees(
            (minWGS84[0] + maxWGS84[0]) / 2,
            ((minWGS84[1] + maxWGS84[1]) / 2) - 1,
            200000
        );

        /*points.position.x = center.x
        points.position.y = center.y
        points.position.z = center.z*/

        points.scale.x = 2000.0
        points.scale.y = 2000.0
        points.scale.z = 2000.0

        three.scene.add(points)
    }

    generateGalaxy()
}

function init3DObject(){
    //Cesium entity
    var entity = {
        name : 'Polygon',
        polygon : {
            hierarchy : Cesium.Cartesian3.fromDegreesArray([
                minWGS84[0], minWGS84[1],
                maxWGS84[0], minWGS84[1],
                maxWGS84[0], maxWGS84[1],
                minWGS84[0], maxWGS84[1],
            ]),
            material : Cesium.Color.RED.withAlpha(0.2)
        }
    };
    var Polygon = cesium.viewer.entities.add(entity);

    // Lathe geometry
    var doubleSideMaterial = new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
    });
    var segments = 10;
    var points = [];
    for ( var i = 0; i < segments; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * segments + 5, ( i - 5 ) * 2 ) );
    }
    var geometry = new THREE.LatheGeometry( points );
    var latheMesh = new THREE.Mesh( geometry, doubleSideMaterial ) ;
    latheMesh.scale.set(1500,1500,1500); //scale object to be visible at planet scale
    latheMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
    latheMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
    var latheMeshYup = new THREE.Group();
    latheMeshYup.add(latheMesh)
    three.scene.add(latheMeshYup); // don’t forget to add it to the Three.js scene manually

    //Assign Three.js object mesh to our object array
    var _3DOB = new _3DObject();
    _3DOB.threeMesh = latheMeshYup;
    _3DOB.minWGS84 = minWGS84;
    _3DOB.maxWGS84 = maxWGS84;
    _3Dobjects.push(_3DOB);

    // dodecahedron
    geometry = new THREE.DodecahedronGeometry();
    var dodecahedronMesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial()) ;
    dodecahedronMesh.scale.set(5000,5000,5000); //scale object to be visible at planet scale
    dodecahedronMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
    dodecahedronMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
    var dodecahedronMeshYup = new THREE.Group();
    dodecahedronMeshYup.add(dodecahedronMesh)
    three.scene.add(dodecahedronMeshYup); // don’t forget to add it to the Three.js scene manually

    //Assign Three.js object mesh to our object array
    _3DOB = new _3DObject();
    _3DOB.threeMesh = dodecahedronMeshYup;
    _3DOB.minWGS84 = minWGS84;
    _3DOB.maxWGS84 = maxWGS84;
    _3Dobjects.push(_3DOB);
}

function _3DObject(){
    this.graphMesh = null; //Three.js 3DObject.mesh
    this.minWGS84 = null; //location bounding box
    this.maxWGS84 = null;
}

function loop(){
    requestAnimationFrame(loop);
    renderCesium();
    renderThreeObj();
}

function renderCesium(){
    cesium.viewer.render();
}

function renderThreeObj(){
    // register Three.js scene with Cesium
    three.camera.fov = Cesium.Math.toDegrees(cesium.viewer.camera.frustum.fovy) // ThreeJS FOV is vertical
    three.camera.updateProjectionMatrix();

    var cartToVec = function(cart){
        return new THREE.Vector3(cart.x, cart.y, cart.z);
    };

    // Configure Three.js meshes to stand against globe center position up direction
    /*for(let id in _3Dobjects){
        minWGS84 = _3Dobjects[id].minWGS84;
        maxWGS84 = _3Dobjects[id].maxWGS84;
        // convert lat/long center position to Cartesian3
        var center = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2);

        // get forward direction for orienting model
        var centerHigh = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2,1);

        // use direction from bottom left to top left as up-vector
        var bottomLeft  = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1]));
        var topLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1]));
        var latDir  = new THREE.Vector3().subVectors(bottomLeft,topLeft ).normalize();

        // configure entity position and orientation
        _3Dobjects[id].graphMesh.position.copy(center);
        _3Dobjects[id].graphMesh.lookAt(centerHigh);
        _3Dobjects[id].graphMesh.up.copy(latDir);
    }*/

    // Clone Cesium Camera projection position so the
    // Three.js Object will appear to be at the same place as above the Cesium Globe

    three.camera.matrixAutoUpdate = false;
    var cvm = cesium.viewer.camera.viewMatrix;
    var civm = cesium.viewer.camera.inverseViewMatrix;
    three.camera.matrixWorld.set(
        civm[0], civm[4], civm[8 ], civm[12],
        civm[1], civm[5], civm[9 ], civm[13],
        civm[2], civm[6], civm[10], civm[14],
        civm[3], civm[7], civm[11], civm[15]
    );
    console.log(three.camera.matrixWorld)
    three.camera.matrixWorldInverse.set(
        cvm[0], cvm[4], cvm[8 ], cvm[12],
        cvm[1], cvm[5], cvm[9 ], cvm[13],
        cvm[2], cvm[6], cvm[10], cvm[14],
        cvm[3], cvm[7], cvm[11], cvm[15]
    );
    three.camera.lookAt(new THREE.Vector3(0,0,0));

    var width = ThreeContainer.clientWidth;
    var height = ThreeContainer.clientHeight;
    var aspect = width / height;
    three.camera.aspect = aspect;
    three.camera.updateProjectionMatrix();

    three.renderer.setSize(width, height);
    three.renderer.render(three.scene, three.camera);


}
