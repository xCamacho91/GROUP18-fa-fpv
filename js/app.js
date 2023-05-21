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


document.getElementById("gl-canvas").onmousemove = function (e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * canvas.width / rect.width;
    mouseY = -(e.clientY - rect.top) * canvas.height / rect.height;
}


document.getElementById("light_selector").onchange = function () {
    scene.remove(light);
    scene.remove(light.target);
    let lightType = document.getElementById("light_selector").value;
    makeLight(lightType);
}

document.getElementById("material_selector").onchange = function () {
    scene.remove(sphere);
    let materialType = document.getElementById("material_selector").value;
    makeSphere(materialType);
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

    // *** Calculate the cube
    makeSphere("basic");

    // *** Create a camera
    const fov = 75; // field of view
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


/**
 * Draws a sphere with different characteristics.
 */
function makeSphere(materialType) {
    const sphereRadius = 1;
    const geometry = new THREE.SphereGeometry(sphereRadius); // vertex data
    let material;
    switch (materialType) {
        case "basic": // not affected by lights
            material = new THREE.MeshBasicMaterial({color: colorObject});
            break;
        case "phong": // shiny surfaces based on the Blinn-Phong model for calculating reflectance
            material = new THREE.MeshPhongMaterial({color: colorObject, emissive: colorEmissive, shininess: 35});
            break;
        case "lambert": // surfaces based Lambertian model for calculating reflectance
            material = new THREE.MeshLambertMaterial({color: colorObject, emissive: colorEmissive});
            break;
        default:
            return -1;
    }
    sphere = new THREE.Mesh(geometry, material); // mesh objects represent drawing a specific Geometry with a specific Material
    scene.add(sphere);
}

/**
 *
 * @param lightType
 * @returns {number}
 */
function makeLight(lightType) {
    switch (lightType) {
        case "ambient": // light that shoots light in all directions
            light = new THREE.AmbientLight(colorLight, lightIntensity);
            break;
        case "directional": // often used to represent the sun, and will shine in the direction of its target
            light = new THREE.DirectionalLight(colorLight, lightIntensity);
            light.position.set(0, 10, 0);
            light.target.position.set(10, 20, 50);
            scene.add(light.target);
            break;
        default:
            return -1;
    }
    scene.add(light);
}


/**
 * Renders the scene.
 */
function render() {
    // Change light's position
    light.position.set(mouseX, mouseY, 0);
    // Apply rotation
    sphere.rotation.x += angle;
    // Draw the scene
    renderer.render(scene, camera);
    // Make the new frame
    requestAnimationFrame(render);
}