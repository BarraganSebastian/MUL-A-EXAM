const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const spotLight0 = new THREE.SpotLight(0xFFFFFF);
spotLight0.position.set(2, 7, 7);
scene.add(spotLight0);

const size = 100;
const divisions = 100;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

camera.position.z = 2;
camera.position.x = 2;
camera.position.y = 2;

const controls = new THREE.OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

function vertices(R, num_v) {
  var ver = [];
  var a = 2 * Math.PI / num_v;

  for (var i = 0; i < num_v; i++) {
    ver.push([R * Math.cos(i * a), R * Math.sin(i * a)]);
  }
  return ver;
}

function poliedro(nlados, altura, radio) {
  var verticesArray = vertices(radio, nlados);
  var vertexBuffer = [];
  var indexBuffer = [];

  for (var i = 0; i < verticesArray.length; i++) {
    vertexBuffer.push(verticesArray[i][0], verticesArray[i][1], altura);
  }

  // Calcular los índices para formar los triángulos utilizando el algoritmo de ear clipping
  var remainingVertices = [...Array(verticesArray.length).keys()];

  while (remainingVertices.length > 2) {
    for (var i = 0; i < remainingVertices.length; i++) {
      var prevIndex = (i === 0) ? remainingVertices.length - 1 : i - 1;
      var nextIndex = (i === remainingVertices.length - 1) ? 0 : i + 1;

      var prevVertex = remainingVertices[prevIndex];
      var currVertex = remainingVertices[i];
      var nextVertex = remainingVertices[nextIndex];

      var isEar = true;

      for (var j = 0; j < remainingVertices.length; j++) {
        if (j !== prevIndex && j !== i && j !== nextIndex) {
          var testVertex = remainingVertices[j];
          var isInsideTriangle = isPointInsideTriangle(
            vertexBuffer[prevVertex * 3], vertexBuffer[prevVertex * 3 + 1],
            vertexBuffer[currVertex * 3], vertexBuffer[currVertex * 3 + 1],
            vertexBuffer[nextVertex * 3], vertexBuffer[nextVertex * 3 + 1],
            vertexBuffer[testVertex * 3], vertexBuffer[testVertex * 3 + 1]
          );

          if (isInsideTriangle) {
            isEar = false;
            break;
          }
        }
      }

      if (isEar) {
        indexBuffer.push(prevVertex, currVertex, nextVertex);
        remainingVertices.splice(i, 1);
        break;
      }
    }
  }

  // Agregar el último triángulo
  indexBuffer.push(remainingVertices[0], remainingVertices[1], remainingVertices[2]);

  var geo = new THREE.BufferGeometry();

  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertexBuffer), 3)
  );

  geo.setIndex(indexBuffer);

  const material = new THREE.MeshBasicMaterial({ color: 0xff0000,  side: THREE.DoubleSide });
  const poli = new THREE.Mesh(geo, material);

  return poli;
}

function isPointInsideTriangle(x1, y1, x2, y2, x3, y3, x, y) {
  var d1 = sign(x, y, x1, y1, x2, y2);
  var d2 = sign(x, y, x2, y2, x3, y3);
  var d3 = sign(x, y, x3, y3, x1, y1);

  var hasNegative = (d1 < 0) || (d2 < 0) || (d3 < 0);
  var hasPositive = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(hasNegative && hasPositive);
}

function sign(x1, y1, x2, y2, x3, y3) {
  return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
}

function getGeometryFromMesh(mesh) {
  return mesh.geometry;
}

function createSquareFace(radio1,nlados1,radio2) {
  var vertexArray=vertices(radio1,nlados1)
  var vertexArray2=vertices(radio2,nlados1)

  for(i=0;i<vertexArray.length;i++){
  var verti = [
    new THREE.Vector3(vertexArray[0][0],vertexArray[0][1],-1),
    new THREE.Vector3(vertexArray[1][0],vertexArray[1][1],-1),
    new THREE.Vector3(vertexArray2[1][0],vertexArray2[1][1],1),
    new THREE.Vector3(vertexArray2[0][0],vertexArray2[0][1],1)
  ];

  }
  
  var indices = [0, 1, 2, 2, 3, 0];
  
  var geometry = new THREE.BufferGeometry();
  geometry.setFromPoints(verti);
  geometry.setIndex(indices);
  
  var material = new THREE.MeshBasicMaterial({ color: 0xff0000,  side: THREE.DoubleSide });
  var mesh = new THREE.Mesh(geometry, material);
  
  return mesh;
}




var cara1 = poliedro(5, -1, 1);
var cara2= poliedro(5,1,.5);

var cara0=createSquareFace(1,5,.5,5);
scene.add(cara0);

scene.add(cara1);
scene.add(cara2);



animate();
