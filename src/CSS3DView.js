import * as Cesium from "cesium";

export class CSS3DView {

    constructor({viewer}) {

        // view
        this.view = document.createElement( 'view' )
        this.view.style.position = `absolute`
        this.view.style.top = `0`
        this.view.style.left = `0`
        this.view.style.transformOrigin = '0 0'
        this.view.style.pointerEvents = 'none'
        this.view.style.display = `inline-block`

        // camera
        this.viewer = viewer
        this.camera = document.createElement( 'camera' )
        this.camera.style.display = `inline-block`
        this.camera.style.transformStyle = 'preserve-3d';

        // append camera to view
        this.view.appendChild( this.camera )

    }

    update = function(width, height) {

        // view
        this.view.style.width = `${ width }px`
        this.view.style.height = `${ height }px`

        // camera
        this.camera.style.width = `${ width }px`
        this.camera.style.height = `${ height }px`

        const viewMatrix = this.viewer.camera.viewMatrix
        const frustumMatrix = new Cesium.PerspectiveFrustum({
            fov: this.viewer.camera.frustum.fov,
            aspectRatio: width / height,
            near: this.viewer.camera.frustum.near,
            far: this.viewer.camera.frustum.far
        }).projectionMatrix;

        const fov = frustumMatrix[ 5 ] * 0.5 * height;
        const cameraCSSMatrix = `scale(1)` + 'translateZ(' + fov + 'px)' + `matrix3d(
            ${viewMatrix[0]}, ${-viewMatrix[1]}, ${viewMatrix[2]}, ${viewMatrix[3]},
            ${viewMatrix[4]}, ${-viewMatrix[5]}, ${viewMatrix[6]}, ${viewMatrix[7]},
            ${viewMatrix[8]}, ${-viewMatrix[9]}, ${viewMatrix[10]}, ${viewMatrix[11]},
            ${viewMatrix[12]}, ${-viewMatrix[13]}, ${viewMatrix[14]}, ${viewMatrix[15]}
        )`
        const perspective = 'perspective(' + fov + 'px) ';

        this.camera.style.transform = perspective + cameraCSSMatrix + 'translate(' + 0.5 * width + 'px,' + 0.5 * height + 'px)'

    }

}
