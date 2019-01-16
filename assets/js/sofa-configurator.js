var lstElement = [];

function loadTexture(texture){
    console.log('load texture',texture);
    console.log(lstElement);
    var textureImage;
    var bumpImage;
    var diffuse = new THREE.TextureLoader()
    // diffuse.mapping = THREE.CubeUVReflectionMapping;
    diffuse.wrapS = THREE.RepeatWrapping;
    diffuse.wrapT = THREE.RepeatWrapping;
    diffuse.load(
        'texture/'+texture+'.jpg',
        function(texture){
            textureImage = texture;
        },
        null,
        function(err){
            console.log('failed')
        }
    );

    var bump = new THREE.TextureLoader()
    bump.load(
        'texture/'+texture+'-bump.jpg',
        function(texture){
            bumpImage = texture;
        },
        null,
        function(err){
            console.log('failed')
        }
    );

    setTimeout(() => {
        // console.log('texture image test',textureImage);
        textureImage.wrapS = THREE.RepeatWrapping;
        textureImage.wrapT = THREE.RepeatWrapping;

        bumpImage.wrapS = THREE.RepeatWrapping;
        bumpImage.wrapT = THREE.RepeatWrapping;

        var material = new THREE.MeshStandardMaterial({
            map : textureImage,
            bumpMap : bumpImage,
            // metalness : 0.2,
            // roughness : 0.4,
        })
        
        console.log(material)
        for(var i in lstElement){
            var item = lstElement[i].model;
            for(var j in item.children){
                item.children[j].material = material;
            }
        }
    }, 500);
}

var SofaConfigurator = function(item){
    $('#category-list').hide();
    $('#sofa-config-panel').show();
    $('#canvasSofa').children().remove();
    $('#select-type').children().remove();
    if(item.components){
        $('#select-type').append("<h2>Categories</h2>");
        item.components.map((component,i)=>{
            $('#select-type').append(
                "<div class='single-component' cat='"+component.data+"'>"+
                "<p>"+component.name+"</p>"+
                "</div>"
            )
        })
    }

    /*
    *Single Component Clicked
    */
    $('.single-component').click(function(){
        var name = $(this).attr('cat');
        console.log(name);

        var loader = new THREE.TDSLoader();
        loader.load("models/"+name,function(object){
            object.rotation.x = -Math.PI / 2;
            object.castShadow = true;
            scene.add(object)
            lstElement.push({
                name : name,
                model : object
            })

            for(var i in lstElement){
                var item = lstElement[i].model;
                console.log(item);
                for(var j in item.children){
                    item.children[j].castShadow = true;
                    item.children[j].receiveShadow = true;
                    item.children[j].material = new THREE.MeshStandardMaterial({color : 'red'});
                }
            }
        })
    })

    $('#select-type').hide();
    
    /*
    *Manage Elements
    */


    /*
    *manage color
    */
    //add all colors
    for(var i in lstColor){
        var item = lstColor[i];
        $('#primary-color-selector').append(
            "<div class='select-color-item' style='background-color : #"+item.color+"' data-color='"+item.color+"'>"+
            "<span class='tooltip'>"+item.name+"</span>"+
            "</div>"
        );
        $('#secondary-color-selector').append(
            "<div class='select-color-item' style='background-color : #"+item.color+"' data-color='"+item.color+"'>"+
            "<span class='tooltip'>"+item.name+"</span>"+
            "</div>"
        );
    }

    //add primary color selection event listeners
    $('#primary-color-selector .select-color-item').click(function(){
        console.log('primary color selected')
        $(this).parent().find('.select-color-item').each(function(){
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        var color = $(this).data('color');
        console.log(color)
        for(var i in lstElement){
            var item = lstElement[i].model;
            for(var j in item.children){
                if(item.children[j].name.includes('CG-1') == true)
                {
                    var newMat = item.children[j].material.clone();
                    newMat.color.set('#'+color);
                    newMat.map = null;
                    newMat.needsUpdate = true;

                    item.children[j].material = newMat;
                    console.log('new mat updated')
                }
            }
        }
    })
    $('#secondary-color-selector .select-color-item').click(function(){
        // console.log('secondary color selected');
        $(this).parent().find('.select-color-item').each(function(){
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        var color = $(this).data('color');
        console.log(color)
        for(var i in lstElement){
            var item = lstElement[i].model;
            for(var j in item.children){
                if(item.children[j].name.includes('CG-2') == true)
                {
                    var newMat = item.children[j].material.clone();
                    newMat.color.set('#'+color);
                    newMat.map = null;
                    newMat.needsUpdate = true;

                    item.children[j].material = newMat;
                    console.log('new mat updated')
                }
            }
        }
    })
    

    //main webGL engine
    if ( WEBGL.isWebGLAvailable() === false ) {
        document.body.appendChild( WEBGL.getWebGLErrorMessage() );
    }
    var renderer, scene, camera;
    var sceneContainer = document.getElementById('canvasSofa');
    
    init();
    animate();
    function init() {
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( sceneContainer.offsetWidth, sceneContainer.offsetHeight );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        sceneContainer.appendChild( renderer.domElement );
        
        var gl = renderer.context;
        
        // if ( ! gl.getExtension( 'OES_texture_float' ) ) {
        //     alert( 'OES_texture_float not supported' );
        //     throw 'missing webgl extension';
        // }
        // if ( ! gl.getExtension( 'OES_texture_float_linear' ) ) {
        //     alert( 'OES_texture_float_linear not supported' );
        //     throw 'missing webgl extension';
        // }
        camera = new THREE.PerspectiveCamera( 40, sceneContainer.offsetWidth / sceneContainer.offsetHeight, 1, 100000 );
        camera.position.set( -3000, 2000, 1500 );
        scene = new THREE.Scene();
        
        scene.background = new THREE.Color( 0x333333 );
        // scene.fog = new THREE.Fog( 0xaaaaaa, 25000, 14000 );
        // LIGHTS
        // var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
        // dirLight.position.set( 0, 0, 1 ).normalize();
        // scene.add( dirLight );
        var pointLight = new THREE.PointLight( 0xffffff, 1 );
        pointLight.position.set( 0, 10000, 10000 );
        scene.add( pointLight );
    
        var pointLight2 = new THREE.PointLight( 0xffffff, 1 );
        pointLight2.position.set( -10000, 10000, -20000 );
        scene.add( pointLight2 );

        var pointLight3 = new THREE.PointLight( 0xffffff, 1 );
        pointLight3.position.set( 50000, 10000, -10000 );
        scene.add( pointLight3 );

        var geoFloor = new THREE.BoxBufferGeometry( 200000, 0.1, 200000 );
        var matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0, metalness: 0 } );
        var mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
        mshStdFloor.receiveShadow = true;
        scene.add( mshStdFloor );

        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        // controls.target.copy( mshStdKnot.position );
    
        // vertical angle control
        controls.minPolarAngle = -Math.PI / 2;
        controls.maxPolarAngle = Math.PI / 2 - 0.1;

        controls.minDistance = 1000;
        controls.maxDistance = 5000;
    
    
        controls.update();
    
        window.addEventListener( 'resize', onResize, false );
    }
    function onResize() {
        renderer.setSize( sceneContainer.offsetWidth, sceneContainer.offsetHeight );
        camera.aspect = ( sceneContainer.offsetWidth / sceneContainer.offsetHeight );
        camera.updateProjectionMatrix();
    }
    function animate() {
        requestAnimationFrame( animate );
        
        renderer.render( scene, camera );
    }
}