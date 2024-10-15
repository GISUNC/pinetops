// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // White background

// Add directional light to illuminate the model
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10); // Position the light above the scene
scene.add(directionalLight);

// Add ambient light to softly light the entire scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light everywhere
scene.add(ambientLight);

// Set up camera (Perspective for better view rotation)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 150); // Move camera back so the model is visible
camera.lookAt(0, 0, 0); // Ensure camera points at the model's center

// Create the WebGL renderer and attach it to the DOM
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding; // Updated gamma correction
document.body.appendChild(renderer.domElement);

// Enable OrbitControls for user interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.05;
controls.rotateSpeed = 1.0; // Ensure rotation speed is normal
controls.screenSpacePanning = false; // Don't allow camera to pan up/down
controls.maxPolarAngle = Math.PI; // Allow full rotation vertically
controls.minPolarAngle = 0; // Allow full rotation horizontally
controls.enableRotate = true; // Make sure rotation is enabled

// Load the glTF model using GLTFLoader
const loader = new THREE.GLTFLoader();
loader.load('models/model.glb', function (gltf) {
    const model = gltf.scene; // The loaded 3D model
 
    // Optionally, adjust model position if it's off-center
    model.position.set(0, 0, 0); // Adjust if necessary

    scene.add(model); // Add the model to the scene

    // Traverse through the model to check materials
    model.traverse((child) => {
        if (child.isMesh) {
            console.log('Material properties:', child.material); // Log material info
        }
        if (child.userData) {
            console.log('User Data:', child.userData); // Log material info
        }
    });
}, undefined, function (error) {
    console.error('An error occurred while loading the model:', error);
});

// Animate and render the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Make sure OrbitControls updates
    renderer.render(scene, camera); // Render the scene using the camera
}
animate();


// Optional: Handle window resizing
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function saveImage() {
    // Render the scene before capturing the image
    renderer.render(scene, camera);

    // Capture the rendered canvas as an image
    const imgData = renderer.domElement.toDataURL('image/png'); // Change to 'image/jpeg' for JPEG format

    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'rendered_model.png'; // Set the file name and format (use .jpg for JPEG)
    link.click(); // Programmatically click the link to trigger download
}

// Attach the export function to the button
document.getElementById('saveImageBtn').addEventListener('click', saveImage);

