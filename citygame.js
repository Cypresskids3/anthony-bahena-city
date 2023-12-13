import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const objects = []; //array ~ list
let raycaster; //raygun

let moveFoward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let isSprinting = false;
let isCrouching = false;

let prevTime = performance.now(); //current time
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let loader = new GLTFLoader();

let camera, scene, controls, renderer;

init();
animate();
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(135, 206, 235)");
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000000);
    camera.position.set(0,10,0)


    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });
    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveFoward = true;
                break;

            case 'KeyD':
                moveRight = true;
                break;

            case 'KeyS':
                moveBackward = true;
                break;

            case 'KeyA':
                moveLeft = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 30;
                canJump = false;
                break;
            case 'ShiftLeft':
                isSprinting = true;
                break;
            case 'KeyC':
                if(isCrouching != true) camera.position.y -= 0.4;
                isCrouching = true;
                break;        
        }

    }

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveFoward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
            case 'ShiftLeft':
                isSprinting = false;
                break;
            case 'KeyC':
                camera.position.y += 0.4;
                isCrouching = false;
                break;        
        }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 1);

    const light = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(light);

    loader.load("./monkey.glb", function(gltf){
        let city = gltf.scene; //THREE Group
        scene.add(city);//adds scene to city
        city.traverse(function(obj){
            objects.push(obj);//adds each object to collision list
        });
    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onwindowResize);

}

function onwindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}





function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();

    if (controls.isLocked === true) {

        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 1

        const intersections = raycaster.intersectObjects(objects, false);
        const onObject = intersections.length > 0;
        const delta = (time - prevTime)/1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 10.0 * delta;

        direction.z = Number(moveFoward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if(isSprinting){
            camera.fov = 80;
            camera.updateProjectionMatrix();
            if (moveFoward || moveBackward) velocity.z -= direction.z * 200.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 200.0 * delta;
        }else if(isCrouching){
            camera.fov = 70;
            camera.updateProjectionMatrix();
            if (moveFoward || moveBackward) velocity.z -= direction.z * 20.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 20.0 * delta;
        }else{
            camera.fov = 75;
            camera.updateProjectionMatrix();
            if (moveFoward || moveBackward) velocity.z -= direction.z * 50.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 50.0 * delta;
        }    
        
        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta);

        if (controls.getObject().position.y < -20) {
            velocity.y = 0;
            controls.getObject().position.set(0,10,0);//respawn
            canJump = true;
        }

    }
    prevTime = time;
    renderer.render(scene, camera);
}

