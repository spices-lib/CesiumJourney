import * as Cesium from "cesium";

export class CSS3DOGroup {

    constructor({name = 'divObject', position, rotation, scale }) {

        this.name = name

        this.div = document.createElement(name)
        this.div.style.display = `inline-block`
        this.div.style.transformStyle = 'preserve-3d';
        this.div.style.position = `absolute`
        this.div.style.top = `0`
        this.div.style.left = `0`
        this.div.style.transformOrigin = '0 0'
        this.div.style.pointerEvents = 'none'
        this.div.style.display = `inline-block`

        this.position = new Cesium.Cartesian3(0, 0, 0)
        this.rotation = new Cesium.Cartesian3(0, 0, 0)
        this.scale = new Cesium.Cartesian3(1, 1, 1)

        this.setPosition(position)
        this.setRotation(rotation)
        this.setScale(scale)
    }

    updateModel = function() {

        const qRotation = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(this.rotation.x,  this.rotation.y,  this.rotation.z ), new Cesium.Quaternion())
        const modelMatrix = Cesium.Matrix4.fromTranslationRotationScale(new Cesium.TranslationRotationScale(this.position, qRotation, this.scale), new Cesium.Matrix4())

        this.div.style.transform = `matrix3d(
            ${modelMatrix[0]}, ${modelMatrix[1]}, ${modelMatrix[2]}, ${modelMatrix[3]},
            ${modelMatrix[4]}, ${modelMatrix[5]}, ${modelMatrix[6]}, ${modelMatrix[7]},
            ${modelMatrix[8]}, ${modelMatrix[9]}, ${modelMatrix[10]}, ${modelMatrix[11]},
            ${modelMatrix[12]}, ${modelMatrix[13]}, ${modelMatrix[14]}, ${modelMatrix[15]}
        )`
    }

    setPosition = function(position) {

        // position
        //this.position = new Cesium.Cartesian3.fromDegrees(position.x, position.y, position.z)

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

    appendChild = function(child) {

        for(let i = 0; i < child.length; i++) {
            this.div.appendChild(child[i].div)
        }

    }

}
