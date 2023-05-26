import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

// On loading the page, run the init function
onload = () => {
    init()
};

// Global variables
const angle = 0.02; // rotation in radians
const colorObject = 0x3f51b5; // color
const colorEmissive = 0xd95000; // emissive color
const colorLight = 0xffff00; // light color
const lightIntensity = 2; // light intensity
const cameraPositionZ = 4; // camera's Z position

let mouseX, mouseY; // mouse position
let canvas, sphere, renderer, scene, camera, light, controls , clock;
let objects=[];
let loader = new THREE.TextureLoader();


let redColor = 255;
let greenColor = 255
let blueColor = 255;


let directionX = 10;
let directionY = 20;
let directionZ = 50;

let objectColor = rgbToHex(redColor,greenColor,blueColor);

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

document.getElementById("btn").onclick = function (e) {

    redColor = document.getElementById("ir").value;
    greenColor = document.getElementById("ig").value;
    blueColor = document.getElementById("ib").value;

    objectColor = rgbToHex(redColor,greenColor,blueColor);

    directionX = document.getElementById("dx").value;
    directionY = document.getElementById("dy").value;
    directionZ = document.getElementById("dz").value;


    scene.remove(light);
    scene.remove(light.target);
    let lightType = document.getElementById("light_selector").value;
    makeLight(lightType);
}

document.getElementById("gl-canvas").onmousemove = function (e) {
    mouseX = (e.x / canvas.width) * cameraPositionZ - cameraPositionZ / 2;
    mouseY = -(e.y / canvas.height) * cameraPositionZ + cameraPositionZ / 2;
}
document.getElementById("button_fps").onclick = function (e) {
    controls.lock();
}

/**
 * Initializes the WebGL application
 */
function init() {

    // *** Get canvas
    canvas = document.getElementById('gl-canvas');

    // *** Create a render
    // Render is the main object of three.js used to draw scenes to a canvas
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setClearColor(0xffffff);


    // *** Create a scene
    // Scene defines properties like the background, and defines the objects to be rendered
    scene = new THREE.Scene();
    for (let i=0; i<(Math.random() * 26)+5;i++){
        if((Math.random() * 2)>1) {
            makeCube();
        }else{
            makeCone();
        }
    }
    // *** Create a camera
    const fov = 90; // field of view
    const near = 0.1;
    const far = 5;
    // Anything before or after this range will be clipped
    const aspect = canvas.width / canvas.height;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // mimics the way the human eye sees
    camera.position.z = cameraPositionZ;
    controls = new PointerLockControls(camera, renderer.domElement);
    clock = new THREE.Clock();
    // *** Create a light ***
    makeLight("ambient");

    // *** Render
    render();

}


function makeCube() {
    const cubeSide= ((Math.random() * 41)+10)*0.01;
    const geometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide).toNonIndexed(); // vertex data
    // Specify the colors of the faces
    let colorsArray = [];
    let vertexColors = [
        [1.0, 1.0, 0.0], // yellow
        [0.0, 1.0, 0.0], // green
        [0.0, 0.0, 1.0], // blue
        [1.0, 0.0, 1.0], // magenta
        [0.0, 1.0, 1.0], // cyan
        [1.0, 0.0, 0.0], // red
    ];
    // Set the color of the faces
    for (let face = 0; face < 6; face++) {
        let faceColor = new THREE.Color();
        faceColor.setRGB(...vertexColors[face]);
        for (let vertex = 0; vertex < 6; vertex++) {
            colorsArray.push(...faceColor);
        }
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));

    let  material = new THREE.MeshPhongMaterial({vertexColors: true}); // represent the surface properties. Note: the basic material is not affected by lights
    if((Math.random() * 2)>1) {
        material = new THREE.MeshPhongMaterial({map: loader.load('texture.png')}); // represent the surface properties. Note: the basic material is not affected by lights
    }
    const cube = new THREE.Mesh(geometry, material); // mesh objects represent drawing a specific Geometry with a specific Material
    cube.translateX(Math.floor((Math.random() * 21)-10));
    cube.translateY(Math.floor((Math.random() * 3)-1));
    cube.translateZ(Math.floor((Math.random() * 21)-10));
    scene.add(cube);
    objects.push(cube);
}

function makeCone() {
    const coneSide= ((Math.random() * 41)+10)*0.01;
    const geometry = new THREE.TetrahedronGeometry(coneSide, 0); // vertex data
    // Specify the colors of the faces
    let colorsArray = [];
    let vertexColors = [
        [0.0, 1.0, 0.0], // green
        [0.0, 0.0, 1.0], // blue
        [1.0, 0.0, 1.0], // magenta
        [0.0, 1.0, 1.0], // cyan
    ];
    // Set the color of the faces
    for (let face = 0; face < 4; face++) {
        let faceColor = new THREE.Color();
        faceColor.setRGB(...vertexColors[face]);
        for (let vertex = 0; vertex < 3; vertex++) {
            colorsArray.push(...faceColor);
        }
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));
    let  material = new THREE.MeshPhongMaterial({vertexColors: true}); // represent the surface properties. Note: the basic material is not affected by lights
    if((Math.random() * 2)>1) {
        material = new THREE.MeshPhongMaterial({map: loader.load('texture.png')}); // represent the surface properties. Note: the basic material is not affected by lights
    }

    const cone = new THREE.Mesh(geometry, material); // mesh objects represent drawing a specific Geometry with a specific Material
    cone.translateX(Math.floor((Math.random() * 21)-10));
    cone.translateY(Math.floor((Math.random() * 3)-1));
    cone.translateZ(Math.floor((Math.random() * 21)-10));
    scene.add(cone);
    objects.push(cone);
}

/**
 *
 * @param lightType
 * @returns {number}
 */
function makeLight(lightType) {
    switch (lightType) {
        case "ambient": // light that shoots light in all directions
            light = new THREE.AmbientLight(objectColor, lightIntensity);
            break;
        case "directional": // often used to represent the sun, and will shine in the direction of its target
            light = new THREE.DirectionalLight(objectColor, lightIntensity);
            light.position.set(directionX, directionY, directionZ);
            light.target.position.set(directionX, directionY, directionZ);
            scene.add(light.target);
            break;
        default:
            return -1;
    }
    scene.add(light);
}


/*
 * Renders the scene.
 */
function render() {
    // Change light's position
    light.position.set(mouseX, mouseY, 0);
    // Apply rotation
    //objects[0].translateX(angle);
    objects[0].rotateX(angle);
    objects[0].rotateY(angle);
    // Draw the scene
    renderer.render(scene, camera);
    // Make the new frame
    requestAnimationFrame(render);
}