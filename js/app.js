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

let mouseX, mouseY; // mouse position
let canvas, sphere, renderer, scene, camera, light;
let objects=[];
const loader = new THREE.TextureLoader();


document.getElementById("btn").onclick = function (e) {

    scene.remove(light);
    scene.remove(light.target);
    let lightType = document.getElementById("light_selector").value;
    makeLight(lightType);
}

document.getElementById("gl-canvas").onmousemove = function (e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * canvas.width / rect.width;
    mouseY = -(e.clientY - rect.top) * canvas.height / rect.height;
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
    camera.position.z = 3;

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
    currentObject = cube;
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
    currentObject = cone;
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
            light = new THREE.AmbientLight(rgbToHex(document.getElementById("ir").value,document.getElementById("ig").value,document.getElementById("ib").value), lightIntensity);
            break;
        case "directional": // often used to represent the sun, and will shine in the direction of its target
            light = new THREE.DirectionalLight(rgbToHex(document.getElementById("ir").value,document.getElementById("ig").value,document.getElementById("ib").value), lightIntensity);
            light.position.set(1,1,1);
            light.target.position.set(document.getElementById("dx").value, document.getElementById("dy").value, document.getElementById("dz").value);
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