import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera,renderer.domElement);

const geometry = new THREE.BoxGeometry(1,2,3);
const material = new THREE.MeshLambertMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry,material);
const cube1 = new THREE.Mesh(geometry,material);
scene.add(cube);

scene.add(cube1);

const light = new THREE.PointLight(0xffffff, 1000);
light.position.set(0,5,0); //X,Y,Z
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sphereGeometry = new THREE.SphereGeometry(2,64,64);
const sphereMaterial = new THREE.MeshLambertMaterial({color:0xff00ff})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.z = 0;
sphere.position.x = 8;

camera.position.z = 8;
camera.position.x = 8;
cube1.position.x = 15;

const torusGeometry = new THREE.TorusGeometry(3,1,64,64);
const torusMaterial = new THREE.MeshLambertMaterial({color:0x0000ff});
const torus = new THREE.Mesh(torusGeometry,torusMaterial);
scene.add(torus);
torus.position.x = 8;

function animate(){
    requestAnimationFrame(animate);

    torus.rotation.y += .01

    cube1.rotation.x += .01;
    cube1.rotation.y += .01;

    cube.rotation.x += .01;
    cube.rotation.y += .01;

    renderer.render(scene,camera)
}
animate();
