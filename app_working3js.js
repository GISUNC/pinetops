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

// Array to store selected points
const points = [];

// Create a material for the points and the line
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

// Geometry for a small point sphere
const pointGeometry = new THREE.SphereGeometry(0.02, 16, 16);

// Group to hold the ruler line and points
const rulerGroup = new THREE.Group();
scene.add(rulerGroup);

// Event listener for mouse clicks
renderer.domElement.addEventListener('click', onMouseClick);

// Handle mouse click to select points
function onMouseClick(event) {
    if (points.length >= 2) {
        // Clear points and line after two points are selected
        points.length = 0;
        rulerGroup.clear();
    }

    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    // Raycaster to find intersection in the scene
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Intersect with objects in the scene
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const point = intersects[0].point;

        // Add point to points array
        points.push(point);

        // Create a visual sphere for the point
        const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
        pointMesh.position.copy(point);
        rulerGroup.add(pointMesh);

        // If two points are selected, draw the line and calculate distance
        if (points.length === 2) {
            drawLineAndCalculateDistance();
        }
    }
}

// Draw the line between points and calculate the distance
function drawLineAndCalculateDistance() {
    // Create geometry for the line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    rulerGroup.add(line);

    // Calculate distance
    const distance = points[0].distanceTo(points[1]);
    console.log('Distance:', distance.toFixed(2), 'units');

    // Display distance as text
    displayDistanceText(distance);
}

// Display distance text on screen
function displayDistanceText(distance) {
    const distanceText = document.getElementById('distanceText');
    if (!distanceText) {
        // Create a div for displaying the distance if it doesn't exist
        const distanceDiv = document.createElement('div');
        distanceDiv.id = 'distanceText';
        distanceDiv.style.position = 'absolute';
        distanceDiv.style.top = '60px';
        distanceDiv.style.left = '10px';
        distanceDiv.style.color = 'black';
        distanceDiv.style.fontSize = '18px';
        document.body.appendChild(distanceDiv);
    }
    document.getElementById('distanceText').innerText = `Distance: ${distance.toFixed(2)} units`;
}
