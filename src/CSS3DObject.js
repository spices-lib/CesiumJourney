import Cesium from "cesium";

export class CSS3DObject {

    constructor({name = 'divObject', viewer, position}) {

        this.name = name
        this.viewer = viewer
        this.position = position

        this.div = document.createElement(this.name);
        this.div.style.width = `300px`
        this.div.style.height = `500px`
        this.div.className = 'object';
        this.div.style.backgroundColor = 'rgba(0,127,127,0.25)'
        this.div.style.position = 'absolute';
        this.div.style.pointerEvents = 'auto';
        this.div.style.userSelect = 'none';
        this.div.setAttribute('draggable', false);
        this.div.style.pointerEvents = `none`

        let modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(this.position.x, this.position.y, this.position.z), new Cesium.Matrix4())
        this.div.style.transform = 'translate(-0%,-0%)' + `matrix3d(
        ${modelMatrix[0]}, ${modelMatrix[1]}, ${modelMatrix[2]}, ${modelMatrix[3]},
        ${-modelMatrix[4]}, ${-modelMatrix[5]}, ${-modelMatrix[6]}, ${-modelMatrix[7]},
        ${modelMatrix[8]}, ${modelMatrix[9]}, ${modelMatrix[10]}, ${modelMatrix[11]},
        ${modelMatrix[12]}, ${modelMatrix[13]}, ${modelMatrix[14]}, ${modelMatrix[15]}
        )`

    }

    debugPosition = function () {

        let pt = this.viewer.entities.add({
            id: "point",
            position: this.position,
            orientation: {
                heading: 6.160507542478311,
                pitch: -0.49982768408170264,
                roll: 6.2826078347680285
            },
            point: {
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                pixelSize: 10,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            },
        });
    }
    
    focus = function () {

        this.viewer.camera.flyTo({
            destination: this.position,
            orientation: {
                heading: 6.160507542478311,
                pitch: -0.49982768408170264,
                roll: 6.2826078347680285
            }
        })
    }
}
