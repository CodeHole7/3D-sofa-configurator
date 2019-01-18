var SofaConfigurator = function(item){
    var lstElement = [];
    var undoManager = new UndoManager();

    ////////////////////////////////////////////
    //Initialize DOM
    ////////////////////////////////////////////
    $('#category-list').hide();
    $('#sofa-config-panel').show();
    $('#canvasSofa').children().remove();
    $('#select-type').children().remove();

    //display all sofa components
    if(item.components){
        $('#select-type').append("<h2>Categories</h2>");
        item.components.map((component,i)=>{
            $('#select-type').append(
                "<div class='single-component' cat='"+component.data+"'>"+
                "<img src='models/"+component.thumbImage+"' width='200px'>"+
                "<p>"+component.name+"</p>"+
                "</div>"
            )
        })
    }

    /////////////////////////////////////////////
    //undo/redo management
    /////////////////////////////////////////////
    $('.btn-undo').click(function(){
        console.log('try to undo');
        undoManager.undo();
    })

    $('.btn-redo').click(function(){
        console.log('try to redo');
        undoManager.redo();
    })

    /////////////////////////////////////////////
    //Add component event dispatch
    /////////////////////////////////////////////
    $('.single-component').click(function(){
        var name = $(this).attr('cat');

        var loader = new THREE.TDSLoader();
        loader.load("models/"+name,function(object){
            object.rotation.x = -Math.PI / 2;
            object.castShadow = true;
            object.name = name + '-' + Date().toString().replace(/\s/g, '');
            
            //set default material to object
            for(var j in object.children){
                object.children[j].castShadow = true;
                object.children[j].receiveShadow = true;
                object.children[j].material = new THREE.MeshStandardMaterial({
                    color : 0xffffff,
                    metalness : 0.4,
                    roughness : 0.5,
                });
            }
            //add sprites for control handlers
            //sprite for rotate
            var spriteRotateMap = new THREE.TextureLoader().load( 'texture/sprite-rotate.png' );
            var spriteRotateMaterial = new THREE.SpriteMaterial( { map: spriteRotateMap, color: 0xffffff } );
            var spriteRotate = new THREE.Sprite( spriteRotateMaterial );
            spriteRotate.scale.set(200, 200, 1)
            spriteRotate.position.set(0,-200,1100);
            spriteRotate.name = "sprite-rotate";
            spriteRotate.visible = false;
            object.add(spriteRotate);

            //sprite for delete
            var spriteDeleteMap = new THREE.TextureLoader().load( 'texture/sprite-delete.png' );
            var spriteDeleteMaterial = new THREE.SpriteMaterial( { map: spriteDeleteMap, color: 0xffffff } );
            var spriteDelete = new THREE.Sprite( spriteDeleteMaterial );
            spriteDelete.scale.set(200, 200, 1)
            spriteDelete.position.set(0,200,1100);
            spriteDelete.name = "sprite-delete";
            spriteDelete.visible = false;
            object.add(spriteDelete);

            //add to scene
            scene.add(object)
            lstElement.push({
                name : object.name,
                model : object
            })

            //add to UndoManager
            undoManager.add({
                undo : function(){
                    scene.remove(object);
                    control.detach();
                },
                redo : function(){
                    scene.add(object);
                }
            })
        })
    })

    /*
    *delete all component event dispatch
    */
    $('.btn-delete-all-element').click(function(){
        for(var i in lstElement){
            var model = lstElement[i].model;
            var selected = scene.getObjectByName(model.name);
            scene.remove(selected);
            animate();
        }
        // lstElement = [];
        //add to undoManager
        undoManager.add({
            undo : function(){
                var list = Object.assign(lstElement);
                for(var i in list){
                    scene.add(list[i].model);
                }
            },
            redo : function(){
                var list = Object.assign(lstElement);
                for(var i in list){
                    scene.remove(list[i].model);
                }
            }
        })
    })

    $('#select-type').hide();
    
    /*
    *Manage Elements
    */

    //covering management
    function loadTexture(texture){
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
            textureImage.wrapS = THREE.RepeatWrapping;
            textureImage.wrapT = THREE.RepeatWrapping;

            bumpImage.wrapS = THREE.RepeatWrapping;
            bumpImage.wrapT = THREE.RepeatWrapping;

            var textureMaterial = new THREE.MeshStandardMaterial({
                map : textureImage,
                bumpMap : bumpImage,
                // metalness : 0.2,
                // roughness : 0.4,
            })

            var beforeLstElement =[];
            for(var i in lstElement){
                var item = lstElement[i].model;
                beforeLstElement[i] = [];
                for(var j in item.children){
                    beforeLstElement[i][j] = item.children[j].material
                }
            }
            console.log(beforeLstElement)
            for(var i in lstElement){
                var item = lstElement[i].model;
                for(var j in item.children){
                    if(item.children[j] instanceof THREE.Mesh)
                        item.children[j].material = textureMaterial;
                }
            }

            /////////////////////////////////////////////
            //add to undoManager
            /////////////////////////////////////////////
            undoManager.add({
                undo : function(){
                    for(var i in lstElement){
                        var item = lstElement[i].model;
                        for(var j in item.children){
                            if(item.children[j] instanceof THREE.Mesh)
                            {
                                item.children[j].material = beforeLstElement[i][j];
                            }
                        }
                    }
                },
                redo : function(){
                    for(var i in lstElement){
                        var item = lstElement[i].model;
                        for(var j in item.children){
                            if(item.children[j] instanceof THREE.Mesh)
                                item.children[j].material = textureMaterial;
                        }
                    }
                }
            })
        }, 500);
    }

    //leather management
    $('.corvering').click(function(){
        $(this).parent().find('.corvering').each(function(){
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        loadTexture($(this).data('texture'))
    })

    /*
    *manage color
    */
    //add all colors dom
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
        $(this).parent().find('.select-color-item').each(function(){
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        var color = $(this).data('color');
        var beforeLstElement =[];
        for(var i in lstElement){
            var item = lstElement[i].model;
            beforeLstElement[i] = [];
            for(var j in item.children){
                beforeLstElement[i][j] = item.children[j].material
            }
        }
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
                }
            }
        }
        
        ////////////////////////////////////////////////
        //add to undoManager
        ////////////////////////////////////////////////
        undoManager.add({
            undo : function(){
                for(var i in lstElement){
                    var item = lstElement[i].model;
                    for(var j in item.children){
                        if(item.children[j].name.includes('CG-1') == true)
                        {
                            item.children[j].material = beforeLstElement[i][j];
                        }
                    }
                }
            },
            redo : function(){
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
                        }
                    }
                }
            }
        })
    })
    $('#secondary-color-selector .select-color-item').click(function(){
        $(this).parent().find('.select-color-item').each(function(){
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        var color = $(this).data('color');
        
        var beforeLstElement =[];
        for(var i in lstElement){
            var item = lstElement[i].model;
            beforeLstElement[i] = [];
            for(var j in item.children){
                beforeLstElement[i][j] = item.children[j].material
            }
        }
        
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
                }
            }
        }
        ////////////////////////////////////////////////
        //add to undoManager
        ////////////////////////////////////////////////
        undoManager.add({
            undo : function(){
                for(var i in lstElement){
                    var item = lstElement[i].model;
                    for(var j in item.children){
                        if(item.children[j].name.includes('CG-2') == true)
                        {
                            item.children[j].material = beforeLstElement[i][j];
                        }
                    }
                }
            },
            redo : function(){
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
                        }
                    }
                }
            }
        })
    })
    

    //main webGL engine
    if ( WEBGL.isWebGLAvailable() === false ) {
        document.body.appendChild( WEBGL.getWebGLErrorMessage() );
    }
    var renderer, scene, camera;
    var control;
    var sceneContainer = document.getElementById('canvasSofa');
    var mouse = { x: 0, y: 0 };
    var transformBeforeMovingPos = {x : 0, y : 0, z : 0};
    var transformAfterMovingPos = {x : 0, y : 0, z : 0};
    
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
        
        if ( ! gl.getExtension( 'OES_texture_float' ) ) {
            alert( 'OES_texture_float not supported' );
            throw 'missing webgl extension';
        }
        if ( ! gl.getExtension( 'OES_texture_float_linear' ) ) {
            alert( 'OES_texture_float_linear not supported' );
            throw 'missing webgl extension';
        }
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

        var orbit = new THREE.OrbitControls( camera, renderer.domElement );
    
        // vertical angle control
        orbit.minPolarAngle = -Math.PI / 2;
        orbit.maxPolarAngle = Math.PI / 2 - 0.1;

        orbit.minDistance = 1500;
        orbit.maxDistance = 8000;

        orbit.update();
    
        //transform controls
        control = new THREE.TransformControls( camera, renderer.domElement );
        
        control.addEventListener( 'dragging-changed', function ( event ) {
            orbit.enabled = ! event.value;
            if(event.value == true)
            {
                var currentObject = control.getCurrent();
                transformBeforeMovingPos.x = currentObject.position.x;
                transformBeforeMovingPos.y = currentObject.position.y;
                transformBeforeMovingPos.z = currentObject.position.z;
                console.log('before',transformBeforeMovingPos)
            }
            else{
                var currentObject = control.getCurrent();
                transformAfterMovingPos.x = currentObject.position.x;
                transformAfterMovingPos.y = currentObject.position.y;
                transformAfterMovingPos.z = currentObject.position.z;
                console.log('after',transformAfterMovingPos)

                /////////////////////////////////////////////////
                //add to undoManager
                /////////////////////////////////////////////////
                var localBeforePosition = {};
                localBeforePosition.x = transformBeforeMovingPos.x;
                localBeforePosition.y = transformBeforeMovingPos.y;
                localBeforePosition.z = transformBeforeMovingPos.z;
                console.log('before position',localBeforePosition);

                var localAfterPosition = {};
                localAfterPosition.x = transformAfterMovingPos.x;
                localAfterPosition.y = transformAfterMovingPos.y;
                localAfterPosition.z = transformAfterMovingPos.z;

                undoManager.add({
                    undo : function(){
                        var currentObject = control.getCurrent();
                        
                        if(currentObject instanceof THREE.Group){
                            currentObject.position.x = localBeforePosition.x;
                            currentObject.position.y = localBeforePosition.y;
                            currentObject.position.z = localBeforePosition.z;
                        }
                    },
                    redo : function(){
                        var currentObject = control.getCurrent();
                        console.log(currentObject);
                        if(currentObject instanceof THREE.Group){
                            currentObject.position.x = localAfterPosition.x;
                            currentObject.position.y = localAfterPosition.y;
                            currentObject.position.z = localAfterPosition.z;
                        }
                    }
                })
                console.log(undoManager)
            }
        });
        scene.add(control);

        control.showY = false;
        
        window.addEventListener( 'resize', onResize, false );
        renderer.domElement.addEventListener('mousedown',checkClickedEvent,false);
    }

    function checkClickedEvent(event){
        if(event.button == 0)
        {

            var objects = [];
            for(var i in lstElement){
                for(var j in lstElement[i].model.children)
                {
                    objects.push(lstElement[i].model.children[j])
                }
            }
            mouse.x = ( event.offsetX / renderer.domElement.clientWidth ) * 2 - 1;
            mouse.y = - ( event.offsetY / renderer.domElement.clientHeight ) * 2 + 1;
            
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera( mouse, camera );
            // scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 1000, 0xff0000) );
            var intersects = raycaster.intersectObjects( objects );
            if(intersects.length > 0){
                var item = intersects[0];
                if(item.object instanceof THREE.Sprite)
                {
                    var group = item.object.parent;

                    //rotate operation
                    if(item.object.name == 'sprite-rotate')
                    {
                        group.rotation.z -= Math.PI/2;
                        group.rotation.z %= Math.PI * 2;

                        // re positioning control stripes
                        for(var i in group.children){
                            if(group.children[i] instanceof THREE.Sprite)
                            {
                                var tmp = group.children[i].position.x;
                                group.children[i].position.x = - group.children[i].position.y;
                                group.children[i].position.y = tmp;

                            }
                        }

                        ////////////////////////////////////////////////
                        //add to undoManager
                        ////////////////////////////////////////////////
                        undoManager.add({
                            undo : function(){
                                group.rotation.z += Math.PI/2;
                                group.rotation.z %= Math.PI * 2;

                                for(var i in group.children){
                                    if(group.children[i] instanceof THREE.Sprite)
                                    {
                                        var tmp = group.children[i].position.x;
                                        group.children[i].position.x = group.children[i].position.y;
                                        group.children[i].position.y = -tmp;
                                    }
                                }
                            },
                            redo : function(){
                                group.rotation.z -= Math.PI/2;
                                group.rotation.z %= Math.PI * 2;

                                // re positioning control stripes
                                for(var i in group.children){
                                    if(group.children[i] instanceof THREE.Sprite)
                                    {
                                        var tmp = group.children[i].position.x;
                                        group.children[i].position.x = - group.children[i].position.y;
                                        group.children[i].position.y = tmp;

                                    }
                                }
                            }
                        })
                    }
                    //remove selected sofa
                    else if(item.object.name == 'sprite-delete')
                    {
                        var group = item.object.parent;
                        control.detach();
                        scene.remove(group);
                        ////////////////////////////////////////////////
                        //add to undoManager
                        ////////////////////////////////////////////////
                        undoManager.add({
                            undo : function(){
                                scene.add(group);
                                control.attach(group);
                            },
                            redo : function(){
                                scene.remove(group)
                                control.detach();
                            }
                        })
                    }
                }
                else if(item.object instanceof THREE.Mesh)
                {
                    for(var i in lstElement){
                        for(var j in lstElement[i].model.children)
                        {
                            if(lstElement[i].model.children[j] instanceof THREE.Sprite)
                            {
                                lstElement[i].model.children[j].visible = false;
                            }
                        }
                    }
                    var group = item.object.parent;
                    //show control sprites
                    for(var i in group.children)
                    {
                        if(group.children[i] instanceof THREE.Sprite)
                            group.children[i].visible = true;
                    }

                    //attach to transform gizmo
                    control.attach(group);
                }
            }
            else{
                // for(var i in lstElement){
                //     for(var j in lstElement[i].model.children)
                //     {
                //         if(lstElement[i].model.children[j] instanceof THREE.Sprite)
                //         {
                //             lstElement[i].model.children[j].visible = false;
                //         }
                //     }
                // }
            }
        }
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