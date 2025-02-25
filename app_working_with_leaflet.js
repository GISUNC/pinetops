// Initialize the Leaflet map
// Define the model's geographic location
const modelLat = 35.9849112; // Replace with actual latitude
const modelLng = -78.9922438; // Replace with actual longitude

const map = L.map('map').setView([35.9849112, -78.9922438], 20); // Replace with actual lat/lng

// Add a tile layer to the map (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Set up the Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background for overlay
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.pointerEvents = 'none'; // Make the Three.js canvas transparent to mouse events
document.body.appendChild(renderer.domElement);

// Adjust camera position
camera.position.set(0, 0, 100); // Start above the map

// Resize Three.js canvas with window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Function to convert geographic coordinates to map pixel coordinates
function latLngToPixel(lat, lng) {
    const point = map.latLngToContainerPoint([lat, lng]);
    return new THREE.Vector3(point.x - window.innerWidth / 2, window.innerHeight / 2 - point.y, 0);
}



// // Load the 3D model and place it at the correct location
// const loader = new THREE.GLTFLoader();
// loader.load('models/model.glb', function (gltf) {
//     const model = gltf.scene;
//     scene.add(model);

//     // Set initial model position based on lat/lng
//     const modelPosition = latLngToPixel(modelLat, modelLng); // Replace with model's actual location
//     model.position.set(modelPosition.x, modelPosition.y, 0);

//     animate();
// }, undefined, function (error) {
//     console.error('An error occurred while loading the model:', error);
// });
const loader = new THREE.GLTFLoader();
loader.load('models/model.glb', function (gltf) {
    const model = gltf.scene;
    console.log("Model loaded successfully"); // Check if model is loaded
    scene.add(model);

    // Set initial model position based on lat/lng
    const modelPosition = latLngToPixel(modelLat, modelLng);
    model.position.set(modelPosition.x, modelPosition.y, 0);

    animate(); // Start animation loop
}, undefined, function (error) {
    console.error('An error occurred while loading the model:', error);
});
// Update model position on map move
map.on('move', () => {
    const modelPosition = latLngToPixel(modelLat, modelLng);
    scene.children.forEach((child) => {
        child.position.set(modelPosition.x, modelPosition.y, 0);
    });
});

// Animate and render the Three.js scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
