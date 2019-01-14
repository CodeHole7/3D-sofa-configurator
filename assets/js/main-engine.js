if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var renderer, scene, camera;
var origin = new THREE.Vector3();
var rectLight;
var param = {};
var stats;
init();
// animate();
function init() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    document.body.appendChild( renderer.domElement );
    var gl = renderer.context;
    
    if ( ! gl.getExtension( 'OES_texture_float' ) ) {
        alert( 'OES_texture_float not supported' );
        throw 'missing webgl extension';
    }
    if ( ! gl.getExtension( 'OES_texture_float_linear' ) ) {
        alert( 'OES_texture_float_linear not supported' );
        throw 'missing webgl extension';
    }
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 20, 35 );
    scene = new THREE.Scene();
    
    scene.background = new THREE.Color( 0xdddddd );
    // scene.fog = new THREE.Fog( 0xaaaaaa, 250, 1400 );
    // LIGHTS
    // var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    // dirLight.position.set( 0, 0, 1 ).normalize();
    // scene.add( dirLight );
    var pointLight = new THREE.PointLight( 0xffffff, 1 );
    pointLight.position.set( 0, 100, 90 );
    scene.add( pointLight );

    var pointLight2 = new THREE.PointLight( 0xffffff, 1 );
    pointLight2.position.set( 0, 100, -90 );
    scene.add( pointLight2 );

    var geoFloor = new THREE.BoxBufferGeometry( 2000, 0.1, 2000 );
    var matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0, metalness: 0 } );
    var mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    scene.add( mshStdFloor );
    var matStdObjects = new THREE.MeshStandardMaterial( { color: 0xA00000, roughness: 0, metalness: 0 } );
    
    var geoKnot = new THREE.TorusKnotBufferGeometry( 1.5, 0.5, 100, 16 );
    var mshStdKnot = new THREE.Mesh( geoKnot, matStdObjects );
    mshStdKnot.position.set( 5, 5, 0 );
    mshStdKnot.castShadow = true;
    mshStdKnot.receiveShadow = true;
    scene.add( mshStdKnot );
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.copy( mshStdKnot.position );

    // vertical angle control
    controls.minPolarAngle = -Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;


    controls.update();

    window.addEventListener( 'resize', onResize, false );
}
function onResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = ( window.innerWidth / window.innerHeight );
    camera.updateProjectionMatrix();
}
function animate() {
    requestAnimationFrame( animate );
    if ( param.motion ) {
        var t = ( Date.now() / 2000 );
        // move light in circle around center
        // change light height with sine curve
        var r = 15.0;
        var lx = r * Math.cos( t );
        var lz = r * Math.sin( t );
        var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
        rectLight.position.set( lx, ly, lz );
        rectLight.lookAt( origin );
    }
    renderer.render( scene, camera );
    // stats.update();
}