import * as Cesium from "cesium";

export class CSS3DObject {

    constructor({ name = 'divObject', viewer, position, rotation, scale, offset }) {

        this.name = name
        this.viewer = viewer

        this.div = document.createElement(this.name)
        this.div.style.width = `300px`
        this.div.style.height = `500px`
        this.div.className = 'object';
        this.div.style.backgroundColor = 'rgba(0,127,127,0.25)'
        this.div.style.position = 'absolute'
        this.div.style.pointerEvents = 'auto'
        this.div.style.userSelect = 'none'
        this.div.setAttribute('draggable', false)
        this.div.style.pointerEvents = `none`

        this.position = new Cesium.Cartesian3(0, 0, 0)
        this.rotation = new Cesium.Cartesian3(0, 0, 0)
        this.scale = new Cesium.Cartesian3(1, 1, 1)
        this.offset = new Cesium.Cartesian2(50, 50)

        this.setPosition(position)
        this.setRotation(rotation)
        this.setScale(scale)
        this.setOffset(offset)
    }

    debugPosition = function () {

        let pt = this.viewer.entities.add({
            position: this.position,
            orientation: {
                heading: 6.160507542478311,
                pitch: -0.49982768408170264,
                roll: 6.2826078347680285
            },
            point: {
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                pixelSize: 2,
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

    updateModel = function() {

        const qRotation = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(this.rotation.x + this.alignRotation.x,  this.rotation.y + this.alignRotation.y,  this.rotation.z + this.alignRotation.z ), new Cesium.Quaternion())
        const modelMatrix = Cesium.Matrix4.fromTranslationRotationScale(new Cesium.TranslationRotationScale(this.position, qRotation, this.scale), new Cesium.Matrix4())

        this.div.style.transform = `translate(-${ 100 - this.offset.x }%,-${ this.offset.y }%)` + `matrix3d(
            ${modelMatrix[0]}, ${modelMatrix[1]}, ${modelMatrix[2]}, ${modelMatrix[3]},
            ${-modelMatrix[4]}, ${-modelMatrix[5]}, ${-modelMatrix[6]}, ${-modelMatrix[7]},
            ${modelMatrix[8]}, ${modelMatrix[9]}, ${modelMatrix[10]}, ${modelMatrix[11]},
            ${modelMatrix[12]}, ${modelMatrix[13]}, ${modelMatrix[14]}, ${modelMatrix[15]}
        )`

    }

    setPosition = function(position) {

        // position
        this.position = new Cesium.Cartesian3.fromDegrees(position.x, position.y, position.z)

        // alignRotation
        this.alignRotation = new Cesium.Cartesian3(0, 0, 0)
        this.alignRotation.x = -position.x / 90.0 * Cesium.Math.toRadians(90.0)
        this.alignRotation.z =  position.y / 90.0 * Cesium.Math.toRadians(90.0)

        // update model matrix
        this.updateModel()

    }

    setRotation = function(rotation) {

        // rotation
        this.rotation.x = Cesium.Math.toRadians(rotation.x)
        this.rotation.y = Cesium.Math.toRadians(rotation.y)
        this.rotation.z = Cesium.Math.toRadians(rotation.z)

        // update model matrix
        this.updateModel()

    }

    setScale = function(scale) {

        // scale
        this.scale = scale

        // update model matrix
        this.updateModel()

    }

    setOffset = function(offset) {

        // offset
        this.offset = offset

        this.div.style.transformOrigin = `${ 100 - this.offset.x }% ${ this.offset.y }%`

        // update model matrix
        this.updateModel()

    }

}
