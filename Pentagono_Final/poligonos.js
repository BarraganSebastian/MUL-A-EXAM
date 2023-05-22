//Creacion de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Creacion del renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Creacion y parametros de la malla
const size = 100;
const divisions = 100;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

//Posicion de la cámara
camera.position.z = 2;
camera.position.x = 2;
camera.position.y = 2;

//Implementacion de controles orbitales
const controls = new THREE.OrbitControls(camera, renderer.domElement);


//Definicion de parametros del poliedro
var poliedros = [];
var lados = 5;
var long_sup = 0.7;
var long_inf = 1;
var altura = 1;

//Creacion y movimiento de poliedros
var poli1=crearPiramide(lados,long_sup,long_inf,altura)
var poli2=crearPiramide(lados,long_sup,long_inf,altura)
poli2.position.x=lados/2
var poli3=crearPiramide(lados,long_sup,long_inf,altura)
poli3.position.x=lados
var poli4=crearPiramide(lados,long_sup,long_inf,altura)
poli4.position.x=1.5*lados
var poli5=crearPiramide(lados,long_sup,long_inf,altura)
poli5.position.y=lados/2
var poli6=crearPiramide(lados,long_sup,long_inf,altura)
poli6.position.x=lados/2
poli6.position.y=lados/2
var poli7=crearPiramide(lados,long_sup,long_inf,altura)
poli7.position.x=lados
poli7.position.y=lados/2
var poli8=crearPiramide(lados,long_sup,long_inf,altura)
poli8.position.x=1.5*lados
poli8.position.y=lados/2

//Rotacion de poliedros
grados=rads(-90)

poli1.rotation.x=grados
poli2.rotation.x=grados
poli3.rotation.x=grados
poli4.rotation.x=grados
poli5.rotation.x=grados
poli6.rotation.x=grados
poli7.rotation.x=grados
poli8.rotation.x=grados

//Añadir poliedros a la escena
scene.add(poli1)
scene.add(poli2)
scene.add(poli3)
scene.add(poli4)
scene.add(poli5)
scene.add(poli6)
scene.add(poli7)
scene.add(poli8)

//Creacion de luces spotlight y de ambiente
var light= new THREE.SpotLight(0xFFFFFF);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

//posicion y enfoque de las luces
light.position.set(2,7,7);
light.target=poli2;

scene.add(light)


animate();
