var SofaConfigurator = function(item){
    var lstElement = [];
    var undoManager = new UndoManager();
    var fullItemList = item.components;
    var lstCubeCameras = [];

    ////////////////////////////////////////////
    //Initialize DOM
    ////////////////////////////////////////////
    $('#category-list').hide();
    $('#sofa-config-panel').show();
    $('#canvasSofa').children().remove();
    $('#select-type').children().remove();

    //display all sofa components
    if(item.components){
        $('#select-type').children().remove();
        $('#select-type').append("<h2 style='margin : 0'>Categories</h2>");
        item.components.map((component,i)=>{
            $('#select-type').append(
                "<div class='single-component' cat='"+component.data+"'>"+
                "<img src='models/"+component.thumbImage+"' width='200px'>"+
                "<p>"+component.name+"</p>"+
                "</div>"
            )
        })

        $('#additional-items').children().remove();
        $('#additional-items').append("<h2 style='margin : 0'>Additional Items</h2>");
        item.components.map((component,i)=>{
            $('#additional-items').append(
                "<div class='additional-component hidden' cat='"+component.data+"'>"+
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
        undoManager.undo();
    })

    $('.btn-redo').click(function(){
        undoManager.redo();
    })

    /////////////////////////////////////////////
    //Add component event dispatch
    /////////////////////////////////////////////
    createNewComponent = function(name, fn){
        var loader = new THREE.TDSLoader();
        loader.load("models/"+name,function(object){
            object.rotation.x = -Math.PI / 2;
            object.castShadow = true;
            object.name = name + '-' + Date().toString().replace(/\s/g, '');
            
            var bbox = new THREE.Box3().setFromObject(object);
            
            object.boundingBox = bbox;
            
            //set default material to object
            for(var j in object.children){
                object.children[j].castShadow = true;
                object.children[j].receiveShadow = true;
                if(object.children[j].name.includes('CG-1') || object.children[j].name.includes('CG-2'))
                {
                    object.children[j].material = new THREE.MeshStandardMaterial({
                        color : 0x888888,
                        metalness : 0.4,
                        roughness : 0.5,
                    });
                }
                else if(object.children[j].name.includes('metal')){
                    var tmpBBox = new THREE.Box3().setFromObject(object.children[j])

                    cubeCamera = new THREE.CubeCamera(  1, 100000, 128 );
                    cubeCamera.renderTarget.texture.generateMipmaps = true;
                    cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
                    cubeCamera.position.set((tmpBBox.max.x + tmpBBox.min.x)/2 ,-(tmpBBox.max.z + tmpBBox.min.z)/2,(tmpBBox.min.y + tmpBBox.max.y)/2);

                    object.add(cubeCamera);
                    cubeCamera.update(renderer,scene);
                    lstCubeCameras.push(cubeCamera);

                    object.children[j].material = new THREE.MeshLambertMaterial({
                        color : 'white',
                        // envMap : envMap
                        envMap : cubeCamera.renderTarget.texture,
                        reflectivity : 0.9,
                    })
                    console.log(object.children[j].material)
                }
                else if(object.children[j].name.includes('glass')){
                    object.children[j].material = new THREE.MeshPhongMaterial({
                        color : 'black',
                        transparent : true,
                        opacity : 0.7,
                        metalness : 0.7,
                        roughness : 0,
                        reflectivity : 0.8,
                        shininess : 100,
                        specular : 0xffffff,
                    })
                    console.log('glass material',object.children[j].material);
                }
            }

            
            //add sprites for control handlers
            //sprite for rotate
            var spriteRotateMap = new THREE.TextureLoader().load( 'texture/sprite-rotate.png' );
            var spriteRotateMaterial = new THREE.SpriteMaterial( { map: spriteRotateMap, color: 0xffffff } );
            var spriteRotate = new THREE.Sprite( spriteRotateMaterial );
            spriteRotate.scale.set(200, 200, 1)
            spriteRotate.position.set(0,-200,bbox.max.y+200);
            spriteRotate.name = "sprite-rotate";
            spriteRotate.visible = false;
            object.add(spriteRotate);

            //sprite for delete
            var spriteDeleteMap = new THREE.TextureLoader().load( 'texture/sprite-delete.png' );
            var spriteDeleteMaterial = new THREE.SpriteMaterial( { map: spriteDeleteMap, color: 0xffffff } );
            var spriteDelete = new THREE.Sprite( spriteDeleteMaterial );
            spriteDelete.scale.set(200, 200, 1)
            spriteDelete.position.set(0,200,bbox.max.y+200);
            spriteDelete.name = "sprite-delete";
            spriteDelete.visible = false;
            object.add(spriteDelete);

            //sprite for add
            var currentItem = null;
            for(var i in fullItemList){
                if(fullItemList[i].data == name){
                    currentItem = fullItemList[i];
                    break;
                }
            }
            if(currentItem.combineInfo)
            {
                var combineInfo = currentItem.combineInfo;
                var spriteAddMap = new THREE.TextureLoader().load( 'texture/sprite-add.png' );
                var spriteAddMaterial = new THREE.SpriteMaterial( { map: spriteAddMap, color: 0xffffff } );

                if(combineInfo.leftTop[0] == true)
                {
                    var spriteAddLeft = new THREE.Sprite( spriteAddMaterial );
                    spriteAddLeft.scale.set(200, 200, 1)
                    spriteAddLeft.position.set(0,bbox.max.z + 200 ,100); 
                    spriteAddLeft.name = "sprite-add-left";
                    spriteAddLeft.visible = false;
                    object.add(spriteAddLeft);
                }
                if(combineInfo.rightTop[0] == true)
                {
                    var spriteAddTop = new THREE.Sprite( spriteAddMaterial );
                    spriteAddTop.scale.set(200, 200, 1)
                    spriteAddTop.position.set(bbox.max.x + 200 , 0 ,100); 
                    spriteAddTop.name = "sprite-add-top";
                    spriteAddTop.visible = false;
                    object.add(spriteAddTop);
                }
                if(combineInfo.rightBottom[0] == true)
                {
                    var spriteAddRight = new THREE.Sprite( spriteAddMaterial );
                    spriteAddRight.scale.set(200, 200, 1)
                    spriteAddRight.position.set(0,bbox.min.z - 200 ,100);
                    spriteAddRight.name = "sprite-add-right";
                    spriteAddRight.visible = false;
                    object.add(spriteAddRight);
                }
                if(combineInfo.leftBottom[0] == true)
                {
                    var spriteAddBottom = new THREE.Sprite( spriteAddMaterial );
                    spriteAddBottom.scale.set(200, 200, 1)
                    spriteAddBottom.position.set(bbox.min.x - 200 , 0 ,100); 
                    spriteAddBottom.name = "sprite-add-bottom";
                    spriteAddBottom.visible = false;
                    object.add(spriteAddBottom);
                }
            }
            
            fn(object)
        })
    }
    
    $('.single-component').click(function(){
        var name = $(this).attr('cat');
        createNewComponent(name,function(object){
            //add to scene
            scene.add(object)

            //add to list
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
        });
    })

    $('.additional-component').click(function(){
        var name = $(this).attr('cat');
        console.log('addtional component clicked',name);
        createNewComponent(name,function(object){
            var parentGizmo = combiningParent.boundingBox;
            var parentPosition = combiningParent.position;
            var parentRotation = combiningParent.rotation;
            console.log(parentGizmo)
            console.log(parentPosition)
            console.log(parentRotation)
            console.log(parentGizmo.min.z,object.boundingBox.max.z)
            switch(combiningDirection){
                case 'left'  :
                    if(parentRotation.z == 0) //0deg
                    {
                        console.log(parentGizmo.max.x,object.boundingBox.max.x)
                        object.position.z = -(parentGizmo.max.z - object.boundingBox.min.z)+parentPosition.z;
                        object.position.x = (parentGizmo.max.x - object.boundingBox.max.x) + parentPosition.x;
                    }
                    else if(parentRotation.z == -Math.PI/2) //90deg
                    {
                        object.position.x = (parentGizmo.max.z - object.boundingBox.min.z) + parentPosition.x;
                        object.position.z = (parentGizmo.max.x - object.boundingBox.max.x) + parentPosition.z;
                        object.rotation.z = parentRotation.z
                    }
                    else if(parentRotation.z == -Math.PI) //180deg
                    {
                        object.position.z = (parentGizmo.max.z - object.boundingBox.min.z)+parentPosition.z;
                        object.position.x = -(parentGizmo.max.x - object.boundingBox.max.x) + parentPosition.x;
                        object.rotation.z = parentRotation.z;
                    }
                    else if(parentRotation.z == -Math.PI * 3/2) //270deg
                    {
                        object.position.x = -(parentGizmo.max.z - object.boundingBox.min.z)+parentPosition.x;
                        object.position.z = -(parentGizmo.max.x - object.boundingBox.max.x) + parentPosition.z;
                        object.rotation.z = parentRotation.z
                    }
                    break;
                case 'right' :
                    if(parentRotation.z == 0) //0deg
                    {
                        object.position.z = -(parentGizmo.min.z - object.boundingBox.max.z)+parentPosition.z;
                        object.position.x = (parentGizmo.max.x - object.boundingBox.max.x) + parentPosition.x;
                    }
                    else if(parentRotation.z == -Math.PI/2) //90deg
                    {
                        object.position.x = (parentGizmo.min.z - object.boundingBox.max.z) + parentPosition.x;
                        object.position.z = (parentGizmo.max.x - object.boundingBox.max.x) + parentPosition.z;
                        object.rotation.z = parentRotation.z
                    }
                    else if(parentRotation.z == -Math.PI) //180deg
                    {
                        object.position.z = (parentGizmo.min.z - object.boundingBox.max.z)+parentPosition.z;
                        object.position.x = -(parentGizmo.max.x - object.boundingBox.max.x) + parentPosition.x;
                        object.rotation.z = parentRotation.z;
                    }
                    else if(parentRotation.z == -Math.PI * 3/2) //270deg
                    {
                        object.position.x = -(parentGizmo.min.z - object.boundingBox.max.z)+parentPosition.x;
                        object.position.z = -(parentGizmo.max.x - object.boundingBox.max.x) + parentPosition.z;
                        object.rotation.z = parentRotation.z
                    }
                    break;
                case 'bottom' :
                    if(parentRotation.z == 0) //0deg
                    {
                        object.position.x = (parentGizmo.min.x - object.boundingBox.max.z) + parentPosition.x;
                        object.position.z = (parentGizmo.max.z - object.boundingBox.max.x) + parentPosition.z;
                        object.rotation.z = -Math.PI/2;
                    }
                    else if(parentRotation.z == -Math.PI/2) //90deg
                    {
                        object.position.z = (parentGizmo.min.x - object.boundingBox.max.z) + parentPosition.z;
                        object.position.x = -(parentGizmo.max.z - object.boundingBox.max.x) + parentPosition.x;
                        object.rotation.z = -Math.PI;
                    }
                    else if(parentRotation.z == -Math.PI) //180deg
                    {
                        object.position.x = -(parentGizmo.min.x - object.boundingBox.max.z) + parentPosition.x;
                        object.position.z = -(parentGizmo.max.z - object.boundingBox.max.x) + parentPosition.z;
                        object.rotation.z = -Math.PI * 3/2;
                    }
                    else if(parentRotation.z == -Math.PI * 3/2) //270deg
                    {
                        object.position.z = -(parentGizmo.min.x - object.boundingBox.max.z) + parentPosition.z;
                        object.position.x = +(parentGizmo.max.z - object.boundingBox.max.x) + parentPosition.x;
                        object.rotation.z = 0;
                    }
                    break;
                default:
                    break;
            }
            //add to list
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

    // $('#select-type').hide();
    
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
                metalness : 0.6,
                roughness : 0.3,
            })

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
                    if(item.children[j] instanceof THREE.Mesh && item.children[j].name.includes('metal') == false && item.children[j].name.includes('glass') == false)
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
        var cat = $(this).data('texture');
        //select available colors
        $('#color-selector').find('.select-color-item').each(function(){
            $(this).addClass('hidden')
            $(this).removeClass('one');
            $(this).removeClass('two');
            if($(this).data('cat') == cat)
                $(this).removeClass('hidden');
        })

        //switch active class
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
        let category = lstColor[i];
        for(var j in category.list)
        {
            $('#color-selector').append(
                "<div class='select-color-item hidden' style='background-color : #"+category.list[j]+"' data-color='"+category.list[j]+"' data-cat='"+category.category+"'>"+
                "<span class='tooltip'>"+category.list[j]+"</span>"+
                "</div>"
            );
        }
    }

    //add primary color selection event listeners
    $('#color-selector .select-color-item').click(function(){
        var oneColorSelected = false;
        var twoColorSelected = false;
        $(this).parent().find('.select-color-item').each(function(){
            if($(this).hasClass('one')) oneColorSelected = true;
            if($(this).hasClass('two')) twoColorSelected = true;
            $(this).removeClass('active');
        })

        if(oneColorSelected == false){
            //select primary color
            if($(this).hasClass('two') != true)
            {
                $(this).addClass('one');
                setPrimaryColor($(this).data('color'));
            }
        }
        else if($(this).hasClass('one')){
            $(this).removeClass('one');
        }
        if(oneColorSelected == true && twoColorSelected == false){

            //select secondary color
            if($(this).hasClass('one') != true)
            {
                $(this).addClass('two');
                setSecondaryColor($(this).data('color'));
            }
        }
        else if($(this).hasClass('two')){
            $(this).removeClass('two');
        }
        
    })
    function setPrimaryColor(color){
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
    }
    function setSecondaryColor(color){
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
    }
    
    //main webGL engine
    if ( WEBGL.isWebGLAvailable() === false ) {
        document.body.appendChild( WEBGL.getWebGLErrorMessage() );
    }
    var renderer, scene, camera,cubeCamera1;
    var control;
    var orbit;
    var sceneContainer = document.getElementById('canvasSofa');
    var mouse = { x: 0, y: 0 };
    var transformBeforeMovingPos = {x : 0, y : 0, z : 0};
    var transformAfterMovingPos = {x : 0, y : 0, z : 0};
    var combiningParent = null;
    var combiningDirection = null;
    
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

        //create reflection camera
        cubeCamera1 = new THREE.CubeCamera(  1, 100000, 128 );
        cubeCamera1.position.set(0 ,500,0);
        
        cubeCamera1.renderTarget.texture.generateMipmaps = true;
        cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        scene.add(cubeCamera1);

        // var geometry = new THREE.SphereGeometry( 200, 32, 32 );
        // var material = new THREE.MeshLambertMaterial( {envMap : cubeCamera1.renderTarget.texture , metalness : 0.6, roughness : 0} );
        // var sphere = new THREE.Mesh( geometry, material );
        // sphere.position.set(0,500,0)
        // scene.add( sphere );

        //create orbit for mouse moving
        orbit = new THREE.OrbitControls( camera, renderer.domElement );
    
        // vertical angle control
        orbit.minPolarAngle = -Math.PI / 2;
        orbit.maxPolarAngle = Math.PI / 2 - 0.1;

        orbit.minDistance = 1000;
        orbit.maxDistance = 8000;

        orbit.update();
    
        //transform controls
        control = new THREE.TransformControls( camera, renderer.domElement );
        
        control.addEventListener( 'dragging-changed', function ( event ) {
            orbit.enabled = ! event.value;
            if(event.value == true)
            {
                var currentObject = control.getCurrent();
                if(currentObject instanceof THREE.Group)
                {
                    transformBeforeMovingPos.x = currentObject.position.x;
                    transformBeforeMovingPos.y = currentObject.position.y;
                    transformBeforeMovingPos.z = currentObject.position.z;
                }
            }
            else{
                var currentObject = control.getCurrent();
                if(currentObject instanceof THREE.Group){
                    transformAfterMovingPos.x = currentObject.position.x;
                    transformAfterMovingPos.y = currentObject.position.y;
                    transformAfterMovingPos.z = currentObject.position.z;
                }

                /////////////////////////////////////////////////
                //add to undoManager
                /////////////////////////////////////////////////
                var localBeforePosition = {};
                localBeforePosition.x = transformBeforeMovingPos.x;
                localBeforePosition.y = transformBeforeMovingPos.y;
                localBeforePosition.z = transformBeforeMovingPos.z;

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
                        if(currentObject instanceof THREE.Group){
                            currentObject.position.x = localAfterPosition.x;
                            currentObject.position.y = localAfterPosition.y;
                            currentObject.position.z = localAfterPosition.z;
                        }
                    }
                })
            }
        });
        scene.add(control);

        control.showY = false;
        
        window.addEventListener( 'resize', onResize, false );
        renderer.domElement.addEventListener('mousedown',checkClickedEvent,false);
    }


    //interaction with mouse event
    function checkClickedEvent(event){
        if(event.button == 0 && orbit.enabled == true)
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
                            if(group.children[i] instanceof THREE.Sprite && (group.children[i].name == "sprite-rotate" || group.children[i].name == "sprite-delete"))
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
                                    if(group.children[i] instanceof THREE.Sprite && (group.children[i].name == "sprite-rotate" || group.children[i].name == "sprite-delete"))
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
                                    if(group.children[i] instanceof THREE.Sprite && (group.children[i].name == "sprite-rotate" || group.children[i].name == "sprite-delete"))
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

                    //add component sprite clicked
                    else if(item.object.name.includes('sprite-add') == true){
                        //hide all control handlers
                        for(var i in lstElement){
                            for(var j in lstElement[i].model.children)
                            {
                                if(lstElement[i].model.children[j] instanceof THREE.Sprite)
                                {
                                    lstElement[i].model.children[j].visible = false;
                                }
                            }
                        }
                        control.detach();

                        console.log(item.object.name);
                        $('.custom-nav-item[data-cat="additional"]').trigger('click')

                        //add to left sprite
                        if(item.object.name == 'sprite-add-left'){
                            combiningParent = item.object.parent;
                            combiningDirection = 'left';

                            //collect available components
                            $('.additional-component').addClass('hidden');
                            for(var i in fullItemList){
                                var combineInfo = fullItemList[i].combineInfo;
                                if(combineInfo){
                                    if(combineInfo.rightTop[1] == true){
                                        $('.additional-component[cat="'+fullItemList[i].data+'"]').removeClass('hidden');
                                        continue;
                                    }
                                }
                            }
                        }
                        else if(item.object.name == 'sprite-add-top'){
                        }
                        else if(item.object.name == 'sprite-add-right'){
                            combiningParent = item.object.parent;
                            combiningDirection = 'right';

                            //collect available components
                            $('.additional-component').addClass('hidden');
                            for(var i in fullItemList){
                                var combineInfo = fullItemList[i].combineInfo;
                                if(combineInfo){
                                    if(combineInfo.leftTop[0] == true){
                                        $('.additional-component[cat="'+fullItemList[i].data+'"]').removeClass('hidden');
                                        continue;
                                    }
                                }
                            }
                        }
                        else if(item.object.name == 'sprite-add-bottom'){
                            combiningParent = item.object.parent;
                            combiningDirection = 'bottom';

                            //collect available components
                            $('.additional-component').addClass('hidden');
                            for(var i in fullItemList){
                                var combineInfo = fullItemList[i].combineInfo;
                                if(combineInfo){
                                    if(combineInfo.leftTop[0] == true){
                                        $('.additional-component[cat="'+fullItemList[i].data+'"]').removeClass('hidden');
                                        continue;
                                    }
                                }
                            }
                        }
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
        for(var i in lstCubeCameras){
            lstCubeCameras[i].update(renderer,scene)
        }
    }
}