function animate() {
    requestAnimationFrame(animate);
  
    renderer.render(scene, camera);
  }
  
  function poligono(nlados, dim) {
    //Funcion que crear la geometria de un poligono en base a el numero de lados y la longitud de cada lado, luego, retorna la geometria creada
    const vertices = [];
    const ang = 2*Math.PI/nlados; //Define el angulo al que está situado cada vertice
    radio = dim/2/Math.sin(ang/2);  //Define la longitud de cada lado del poligono
    for (i=0; i<=nlados; i++) {
        const x = radio*Math.cos(i*ang);  //Componente rectangular en x para hayar la coordenada x del vertice
        const y = radio*Math.sin(i*ang);  //Componente rectangular en y para hayar la coordenada y del vertice
        vertices.push([x, y]);
    }
    return vertices;
  }
  
  function getRandomColor() {

    //Funcion que genera un color aleatorio y luego lo retorna
    var r = Math.random();
    var g = Math.random();
    var b = Math.random();
  
    return new THREE.Color(r, g, b);
  }
 
  function cara_pol(geo_buff, color_al){

    //Funcion que dibuja las caras del poliedro tomando como parametros una geometria y color proporcionados, luego, retorna el objeto mesh
    var vertices=[]
    var indices=[]
    for (var i = 0; i < geo_buff.length; i++) {
      var vertex = new THREE.Vector3(geo_buff[i][0], geo_buff[i][1], 0);  //Buffer que almacena la geometria de los vertices
      vertices.push(vertex);
    }
    
    //Creacion de indices para poder dibujar las caras del poligono, en base a los vertices proporcionados
    for (var i = 1; i < geo_buff.length - 1; i++) {
      indices.push(0);
      indices.push(i);
      indices.push(i + 1);
    }
  
  //Creacion de la geometria para crear el objeto mesh
  var geometry= new THREE.BufferGeometry();
  geometry.setFromPoints(vertices); //Establecer vertices en la geometria
  geometry.setIndex(indices); //Establecer indices de las caras
  geometry.computeVertexNormals();  //Crear los vertices normales del objeto
  
  var material=new THREE.MeshPhongMaterial({color: color_al, side: THREE.DoubleSide, specular: 0xffffff, shininess: 50}); //Creacion del material y definicion de parametros del mismo
  var mesh= new THREE.Mesh(geometry,material);  //Creacion de la cara poligonal
  
  return mesh
  
  }

  function createSquareFace(geo_inf, geo_sup, color_al,altura) {
    var vertex_inf = [];
    var vertex_sup = [];
    var square_vertex = [];
    var indices = [];
  
    for (var i = 0; i < geo_inf.length; i++) {
      var vertex = new THREE.Vector3(geo_inf[i][0], geo_inf[i][1], 0);  //Buffer que almacena la geometria de la cara inferior 
      vertex_inf.push(vertex);
    }
  
    for (var i = 0; i < geo_sup.length; i++) {
      var vertex = new THREE.Vector3(geo_sup[i][0], geo_sup[i][1], 0);  //Buffer que almacena la geometria de la cara superior
      vertex_sup.push(vertex);
    }
  
    for (var i = 0; i < geo_inf.length; i++) {
      var inf_XY = new THREE.Vector3(vertex_inf[i].x, vertex_inf[i].y, 0);  //Buffer que almacena los vertices inferiores para dibujar las caras cuadradas del poliedro
      var sup_XY = new THREE.Vector3(vertex_sup[i].x, vertex_sup[i].y, altura); //Buffer que almacena los vertices superiores para dibujar las caras cuadradas del poliedro
      square_vertex.push(inf_XY, sup_XY);
    }
  
    for (var i = 0; i < geo_sup.length - 1; i++) {
      //Definicion de los indices de las caras cuadradas del poliedro
      //Las caras se crean dibujando triangulos y no cuadros, por lo tanto es necesario hacer el recorrido 2 veces, trazando 2 triangulos por cada cara cuadrada
      indices.push(i * 2);
      indices.push(i * 2 + 1);
      indices.push(i * 2 + 3);
  
      indices.push(i * 2);
      indices.push(i * 2 + 3);
      indices.push(i * 2 + 2);
    }
  
    //Creacion de la geometria utilizada para la creacion del objeto de caras cuadradas de los poliedros
    var geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(square_vertex);  //Definicion de los vertices en la geometria
    geometry.setIndex(indices); //Definicion de los indices en la geometria
    geometry.computeVertexNormals();  //Crear los vertices normales del objeto
  
    var material = new THREE.MeshPhongMaterial({ color: color_al, side: THREE.DoubleSide, specular: 0xffffff, shininess: 50});  //Creacion del material y los parametros del mismo
    var mesh = new THREE.Mesh(geometry, material);  //Creacion del objeto caras cuadradas del poliedro
  
    return mesh;
  }
  
  function crearPiramide(n_lados,d_lados_sup,d_lados_inf,altura){
  
  //En esta funcion se llaman todas las funciones creadas anteriormente y les da los parametros establecidos por el usuario, finalmente, retorna todos los objetos agrupados
  var color_al=getRandomColor()
  
  var geometria_inf=poligono(n_lados,d_lados_inf) //Crear la geometria de la cara inferior del objeto
  var cara_inf=cara_pol(geometria_inf,color_al) //Crear la cara inferior del poliedro
  
  var geometria_sup=poligono(n_lados,d_lados_sup) //Crear la geometria de la cara superior del objeto
  var cara_sup=cara_pol(geometria_sup,color_al) //Crear la cara superior del poliedro
  
  cara_sup.position.z=altura  //Altura de la cara superior del objeto
  
  var cuadro_1=createSquareFace(geometria_inf,geometria_sup,color_al,altura)  //Crear las caras cuadradas del poliedro
  
  var group= new THREE.Group(); //Creacion del grupo a retornar
  group.add(cara_inf);
  group.add(cara_sup);
  group.add(cuadro_1);
  
  return group
  }

  function rads(grados){
    //Funcion para convertir de grados a radianes
    radian=(grados*Math.PI)/180
    return radian
  }