var degrees,degrees2,radius,camera,renderer,scene,material,geometry,r2,rotate;

var myCanvas;
var ctx;
var prefix;

var rCube, rCubeGlow;

var rCubes;

var mirrors;

var axes;

var projector, INTERSECTED, mousePosition, projector;
var ray;
var mouseMoveAxis, movingByMouse = false;
var record = true;
var closestCube;
var intersects, selectedCube;

var mouseDown = false,downPoint;

var rotatingCube = false;
var rotationAxis = 'y';
var layer = 2;
var instantRotate = false;
var cubeDegrees = 0,intervalSpeed=10;
var xStart=0, xEnd=3, yStart=0, yEnd=3,zStart=0,zEnd=3;
var rotDir=1;
var increment;
var randomizeMoves;
var doStoredMoves;
var doMoves;
var black;
var colors;
var specialMoves;

var storedMoves,moves;

function init() 
{
    prefix = "";
    rotate = true;
    myCanvas = $('#myCanvas')[0];
    setSpeed();

    storedMoves = new Array();
    moves = new Array();
    rCubes = new Array();
    addSpecialMoves();
    radius = 150;
    r2 = 10;
    degrees = -45;
    degrees2 = -90;
    randomizeMoves = 50;
    mousePosition = { x: 0, y: 0 };
    doStoredMoves = false;
    doMoves = false;
    black = new THREE.Color(0x222222);

    var r = getRadians(getAntiDraw(degrees));

    if(Detector.canvas)
    {
        renderer = new THREE.CanvasRenderer( { canvas: myCanvas } );
    }
    else if(Detector.webgl)
    {
        renderer = new THREE.WebGLRenderer( { canvas: myCanvas } );
    }
    else
    {
        alert("No renderer supported by your browser. Please use the latest version of firefox of google chrome.");
    }
    
    colors = {
    white: new THREE.Color(0xffffff),
    blue: new THREE.Color(0x00bfff),
    yellow: new THREE.Color(0xffff00),
    orange: new THREE.Color(0xff8c00),
    red: new THREE.Color(0xff0000),
    green: new THREE.Color(0x008000)};

    camera = new THREE.PerspectiveCamera(45, myCanvas.width / myCanvas.height, 0.1, 10000);
    camera.position.set(radius*Math.cos(r), 60, radius*Math.sin(r));
    camera.lookAt(new THREE.Vector3(0, -15, 0));
    scene = new THREE.Scene();

    scene.add(camera);

    renderer.setSize( myCanvas.width, myCanvas.height );

    projector = new THREE.Projector();
    
    axes = new Array();

    rCube = new Array();
    
    for(var x=xStart;x<xEnd;x++)
    {
        rCube[x] = new Array();
        for(var y=yStart;y<yEnd;y++)
        {
            rCube[x][y] = new Array();

            for(var z=zStart;z<zEnd;z++)
            {
                var geometry = new THREE.CubeGeometry( 20, 20, 20 );

                for ( var i = 0; i < geometry.faces.length; i ++ ) 
                {
                    if(z===0)
                    {
                        if(i===4)
                        {geometry.faces[ i ].color.setHex( 0xff0000 );}
                        else if(i===0&&x===2)
                        {geometry.faces[ i ].color.setHex( 0xffffff );}
                        else if(i===1&&x===0)
                        {geometry.faces[ i ].color.setHex( 0x00bfff );}
                        else if(i===2&&y===0)
                        {geometry.faces[ i ].color.setHex( 0xffff00 );}
                        else if(i===3&&y===2)
                        {geometry.faces[ i ].color.setHex( 0xff8c00 );}
                        else
                        {geometry.faces[ i ].color.setHex( 0x222222 );}
                    }

                    if(z===1)
                    {
                        if(i===0&&x===2)
                        {geometry.faces[ i ].color.setHex( 0xffffff );}
                        else if(i===1&&x===0)
                        {geometry.faces[ i ].color.setHex( 0x00BFFF );}
                        else if(i===2&&y===0)
                        {geometry.faces[ i ].color.setHex( 0xffff00 );}
                        else if(i===3&&y===2)
                        {geometry.faces[ i ].color.setHex( 0xFF8C00 );}
                        else
                        {geometry.faces[ i ].color.setHex( 0x222222 );}
                    }

                    if(z===2)
                    {
                        if(i===5)
                        {geometry.faces[ i ].color.setHex( 0x008000 );}
                        else if(i===0&&x===2)
                        {geometry.faces[ i ].color.setHex( 0xffffff );}
                        else if(i===1&&x===0)
                        {geometry.faces[ i ].color.setHex( 0x00BFFF );}
                        else if(i===2&&y===0)
                        {geometry.faces[ i ].color.setHex( 0xffff00 );}
                        else if(i===3&&y===2)
                        {geometry.faces[ i ].color.setHex( 0xFF8C00 );}
                        else
                        {geometry.faces[ i ].color.setHex( 0x222222 );}
                    }
                }
                geometry.colorsNeedUpdate = true;

                var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );
                
                rCube[x][y][z] = new Array();
                rCube[x][y][z][0] = new THREE.Mesh( geometry, material );
                rCube[x][y][z][0].position.x = 21*(x-1);
                rCube[x][y][z][0].position.y = 21*(y-1)*-1;
                rCube[x][y][z][0].position.z = 21*(z-1)*-1;
                

                rCube[x][y][z][1] = [rCube[x][y][z][0].position.x,rCube[x][y][z][0].position.y,rCube[x][y][z][0].position.z];

                scene.add( rCube[x][y][z][0] );
                rCubes.push( rCube[x][y][z][0] );

            }
        }
    }
    
    var geometryGlow = new THREE.CubeGeometry(22,22,22);
    var materialGlow = new THREE.MeshBasicMaterial( { color: 0xcccccc, transparent:true, opacity:0.5 } );
    
    rCubeGlow = new THREE.Mesh(geometryGlow, materialGlow);

    renderer.render( scene, camera );

    setInterval(function() 
    {
        if(rotatingCube&&rotate&&!instantRotate)
        {
            if(doMoves)
            {
                doRotateByMoves();
            }
            else if(doStoredMoves)
            {
                doRotateStoredMoves();
            }
            else
            {
                doRotate();
            }
        }
    }, intervalSpeed);

    myCanvas.addEventListener( 'mousemove', onMouseMove, false ); 
    myCanvas.addEventListener( 'mousedown', onMouseDown, false );
    myCanvas.addEventListener( 'mouseover', onMouseEnter, false ); 
    myCanvas.addEventListener( 'mouseout', onMouseLeave, false );

    myCanvas.addEventListener( 'mouseup', onMouseUp, false );
    document.addEventListener( 'mouseup', onMouseUp, false );
    
    //planes
    
    mirrors = new Array();
    mirrors[0] = new Array();
    mirrors[1] = new Array();
    mirrors[2] = new Array();
    
    for(var x=0;x<3;x++)
    {
        mirrors[0][x] = new Array();
        mirrors[1][x] = new Array();
        mirrors[2][x] = new Array();
        
        for(var y=0;y<3;y++)
        {
            var planeGeometry = new THREE.PlaneGeometry(10,10,1,1);
            var planeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors,side: THREE.DoubleSide } );
            mirrors[0][x][y] = new THREE.Mesh(planeGeometry,planeMaterial);
            mirrors[0][x][y].rotation.y = getRadians(90);
            mirrors[0][x][y].position.x = -85;
            mirrors[0][x][y].position.y = 11*(1-x);
            mirrors[0][x][y].position.z = 11*(1-y)+25;
            
            planeGeometry = new THREE.PlaneGeometry(10,10,1,1);
            planeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors,side: THREE.DoubleSide } );
            mirrors[1][x][y] = new THREE.Mesh(planeGeometry,planeMaterial);
            mirrors[1][x][y].position.x = 11*(1-y)+25;;
            mirrors[1][x][y].position.y = 11*(1-x);
            mirrors[1][x][y].position.z = -85;
            
            planeGeometry = new THREE.PlaneGeometry(8,8,1,1);
            planeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors,side: THREE.DoubleSide } );
            mirrors[2][x][y] = new THREE.Mesh(planeGeometry,planeMaterial);
            mirrors[2][x][y].rotation.x = getRadians(-90);
            mirrors[2][x][y].position.x = 9*(1-y);
            mirrors[2][x][y].position.z = 9*(1-x);
            mirrors[2][x][y].position.y = -90;
            
            scene.add(mirrors[0][x][y]);
            scene.add(mirrors[1][x][y]);
            scene.add(mirrors[2][x][y]);
        }
    }
    
    setMirrorColors();

    randomizeCube();
    reset();

    animate();

    $(document).keydown(function(e) 
    {
        var pressedKey = e.keyCode;

        //alert(pressedKey);
        var glowPosition;
        if(selectedCube){glowPosition = rCubeGlow.position.toArray()}

        if(pressedKey===37)
        {
            if(selectedCube)
            {
                var thisRotDir = 1;
                
                thisRotDir = glowPosition[0]>0||glowPosition[2]>0?thisRotDir:(glowPosition[0]===0&&glowPosition[2]===0?thisRotDir:(thisRotDir*-1));
                
                if(glowPosition[1]>0)
                {
                    rotateCube(thisRotDir,1,'y');
                }
                else if(glowPosition[1]===0)
                {
                    rotateCube(thisRotDir,0,'y');
                }
                else if(glowPosition[1]<0)
                {
                    rotateCube(thisRotDir,-1,'y');
                }
            }
            else
            {
                rotateCube(1,2,'y');
            }
        }
        else if(pressedKey===38)
        {
            if(selectedCube)
            {
                if(mousePosition.x>=myCanvas.width/2)
                {
                    if(glowPosition[2]>0)
                    {
                        rotateCube(1,1,'z');
                    }
                    else if(glowPosition[2]===0)
                    {
                        rotateCube(1,0,'z');
                    }
                    else if(glowPosition[2]<0)
                    {
                        rotateCube(1,-1,'z');
                    }
                }
                else
                {
                    if(glowPosition[0]>0)
                    {
                        rotateCube(1,1,'x');
                    }
                    else if(glowPosition[0]===0)
                    {
                        rotateCube(1,0,'x');
                    }
                    else if(glowPosition[0]<0)
                    {
                        rotateCube(1,-1,'x');
                    }
                }
            }
            else
            {
                if(mousePosition.x>=myCanvas.width/2)
                {
                    rotateCube(1,2,"z");
                }
                else
                {
                    rotateCube(1,2,"x");
                }
            }
            
            
        }
        else if(pressedKey===39)
        {
            if(selectedCube)
            {
                var thisRotDir = -1;
                
                thisRotDir = glowPosition[0]>0||glowPosition[2]>0?thisRotDir:(glowPosition[0]===0&&glowPosition[2]===0?thisRotDir:(thisRotDir*-1));
                
                if(glowPosition[1]>0)
                {
                    rotateCube(thisRotDir,1,'y');
                }
                else if(glowPosition[1]===0)
                {
                    rotateCube(thisRotDir,0,'y');
                }
                else if(glowPosition[1]<0)
                {
                    rotateCube(thisRotDir,-1,'y');
                }
                
                
            }
            else
            {
                rotateCube(-1,2,'y');
            }
        }
        else if(pressedKey===40)
        {
            if(selectedCube)
            {
                if(mousePosition.x>=myCanvas.width/2)
                {
                    if(glowPosition[2]>0)
                    {
                        rotateCube(-1,1,'z');
                    }
                    else if(glowPosition[2]===0)
                    {
                        rotateCube(-1,0,'z');
                    }
                    else if(glowPosition[2]<0)
                    {
                        rotateCube(-1,-1,'z');
                    }
                }
                else
                {
                    if(glowPosition[0]>0)
                    {
                        rotateCube(-1,1,'x');
                    }
                    else if(glowPosition[0]===0)
                    {
                        rotateCube(-1,0,'x');
                    }
                    else if(glowPosition[0]<0)
                    {
                        rotateCube(-1,-1,'x');
                    }
                }
            }
            else
            {
                if(mousePosition.x>=myCanvas.width/2)
                {
                    rotateCube(-1,2,"z");
                }
                else
                {
                    rotateCube(-1,2,"x");
                }
            }
        }
        else if(pressedKey===77)
        {
            if(!$('#setMirrorsCB').prop('checked'))
            {$('#setMirrorsCB').prop('checked',true);}
            else
            {$('#setMirrorsCB').prop('checked',false);}
            
            setMirrors();
        }
    });

};

function randomOrientation()
{
    for(var i=0;i<3;i++)
    {
        var random2 = Math.floor(Math.random()*3+1);

        var arg0=1,arg1=2,arg2="x";

        if(random2===2){arg2="y";}else if(random2===3){arg2="z";}

        record = false;
        rotateCubeInstantly(arg0,arg1,arg2);     
        record = true;
    }
}

function addSpecialMoves()
{
    //checkboard
    var specialMove = new Array();
    specialMove = addSpecialMove({dir:-1,layer:0,axis:"x"},specialMove);
    specialMove = addSpecialMove({dir:-1,layer:0,axis:"x"},specialMove);
    specialMove = addSpecialMove({dir:-1,layer:0,axis:"y"},specialMove);
    specialMove = addSpecialMove({dir:-1,layer:0,axis:"y"},specialMove);
    specialMove = addSpecialMove({dir:-1,layer:0,axis:"z"},specialMove);
    specialMove = addSpecialMove({dir:-1,layer:0,axis:"z"},specialMove);
    
    specialMoves = {checkboard: specialMove};
}

function doSpecialMove(specialMoves,instant)
{
    if(moves.length===0&&rotate&&!rotatingCube&&!movingByMouse)
    {
        for(var i=0;i<specialMoves.length;i++)
        {
            moves.push(cloneMove(specialMoves[i]));
        }
    }
    
    rotateCubeByMoves(instant);
}

function addSpecialMove(newMove,specialMove)
{
    if(specialMove.length===0)
    {
        specialMove.push(newMove);
    }
    else
    {
        var prevMove = specialMove[specialMove.length-1];
        
        if(!(prevMove.dir===newMove.dir*-1&&prevMove.layer===newMove.layer&&prevMove.axis===newMove.axis))
        {
            specialMove.push(newMove);
        }
        else
        {
            specialMove.pop();
        }
    }
    
    return specialMove;
}

function setMirrorColors()
{
    for(var x=0;x<3;x++)
    {
        for(var y=0;y<3;y++)
        {
            for(var z=0;z<3;z++)
            {
                var thisCube = rCube[x][y][z][0];
                var cubeX = thisCube.position.x;
                var cubeY = thisCube.position.y;
                var cubeZ = thisCube.position.z;
                
                if(cubeX<0)
                {
                    var faceColor = thisCube.geometry.faces[1].color.clone();
                    var thisX = cubeY===0?(1):(cubeY>0?(0):(2));
                    var thisY = cubeZ===0?(1):(cubeZ>0?(0):(2));
                    mirrors[0][thisX][thisY].geometry.faces[0].color = faceColor;
                    mirrors[0][thisX][thisY].geometry.colorsNeedUpdate = true;
                }
                if(cubeZ<0)
                {
                    var faceColor = thisCube.geometry.faces[5].color.clone();
                    var thisX = cubeY===0?(1):(cubeY>0?(0):(2));
                    var thisY = cubeX===0?(1):(cubeX>0?(0):(2));
                    mirrors[1][thisX][thisY].geometry.faces[0].color = faceColor;
                    mirrors[1][thisX][thisY].geometry.colorsNeedUpdate = true;
                }
                if(cubeY<0)
                {
                    var faceColor = thisCube.geometry.faces[3].color.clone();
                    var thisX = cubeZ===0?(1):(cubeZ>0?(0):(2));
                    var thisY = cubeX===0?(1):(cubeX>0?(0):(2));
                    mirrors[2][thisX][thisY].geometry.faces[0].color = faceColor;
                    mirrors[2][thisX][thisY].geometry.colorsNeedUpdate = true;
                }
            }
        }
    }
}

function bothSides3(geometry)
{
    var faceArray = new Array();

    for(var v=0;v<geometry.faces.length;v++)
    {
        var face = geometry.faces[v];
        var a = face.a;
        var b = face.b;
        var c = face.c;
        var normal = face.normal;
        var vertexNormals = face.vertexNormals;
        var color = face.color;
        var vertexColors = face.vertexColors;
        var vertexTangents = face.vertexTangents;
        var materialIndex = face.materialIndex;
        var centroid = face.centroid;
        var constructor = face.constructor;
        var clone = face.clone;

        var face2 = new THREE.Face3();
        face2.a = c;
        face2.b = b;
        face2.c = a;
        face2.normal = normal;
        face2.vertexNormals = vertexNormals;
        face2.color = color;
        face2.vertexColors = vertexColors;
        face2.vertexTangents = vertexTangents;
        face2.materialIndex = materialIndex;
        face2.centroid = centroid;
        face2.constructor = constructor;
        face2.clone = clone;

        faceArray[faceArray.length] = face2;
    }

    for(var i=0;i<faceArray.length;i++)
    {
        geometry.faces.push(faceArray[i]);
    }

    //return geometry;
}

function getPos(e)
{
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 

    var xOffSet = $("#canvasTD")[0].offsetLeft;
    var yOffSet = $("#canvasTD")[0].offsetTop;
    x -= xOffSet;
    y -= yOffSet;
    xOffSet = $("#mainTable")[0].offsetLeft;
    yOffSet = $("#mainTable")[0].offsetTop;
    x -= xOffSet;
    y -= yOffSet;
    xOffSet = myCanvas.offsetLeft;
    yOffSet = myCanvas.offsetTop;
    x -= xOffSet;
    y -= yOffSet;

    return {x: x, y: y};
}

function getAntiDraw(degrees){return 360-degrees;}

function getRadians(degrees){return (Math.PI/180)*degrees;}

function getDegrees(radians){return (radians*180)/Math.PI;}

function onMouseMove(event)
{
    
    if(!doMoves)
    {
        var pos = getPos(event);
        mousePosition = pos;
        var pointB = {x:pos.x,y:(myCanvas.height-pos.y)};
        if(mouseDown)
        {
            if(downPoint.x!==pointB.x||downPoint.y!==pointB.y)
            {
                mouseDown = false;

                moveDir(downPoint,pointB);
            }
        }
        else if(movingByMouse)
        {
            checkAndMoveDir(downPoint,pointB);
        }

        //scene.remove(rCubeGlow);
        if(!movingByMouse&&!rotatingCube)
        {
            var intersects = getIntersects(event);
            if(intersects.length>0)
            {
                var selectedCube = getSelectedCube(intersects);
                var thisPos = selectedCube.position.toArray();
                var x = thisPos[0], y = thisPos[1], z=thisPos[2];

                rCubeGlow.position.set(x,y,z);
                scene.add(rCubeGlow);
            }
        }
    }
    
    if(getIntersects(event).length===0)
    {scene.remove(rCubeGlow);}
}

function setGlowCube(sX,sY,sZ)
{
    for(var x=0;x<3;x++)
    {
        for(var y=0;y<3;y++)
        {
            for(var z=0;z<3;z++)
            {
                var thisGlowCube = rCubeGlow[x][y][z];
                
                var pos = thisGlowCube.position.toArray();
                var tX = pos[0], tY = pos[1], tZ=pos[2];
                
                if(tX===sX&&tY===sY&&tZ===sZ)
                {
                    scene.add(thisGlowCube);
                }
            }
        }
    }
}

function checkAndMoveDir(point1,point2)
{
    var x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y;
    var deltaX = (x2-x1);
    var deltaY = (y2-y1);

    var cubeX, cubeY, cubeZ;

    if(closestCube!==false)
    {
        cubeX = closestCube.position.x;
        cubeY = closestCube.position.y;
        cubeZ = closestCube.position.z;
    }

    var thisRotDir;
    var thisLayer;
    var threshhold = 20;

    if(mouseMoveAxis==="x")
    {
        if(deltaY>threshhold)
        {
            thisRotDir = 1;
            movingByMouse = false;
        }
        else if(deltaY<-threshhold)
        {
            thisRotDir = -1;
            movingByMouse = false;
        }

        if(closestCube!==false)
        {
            if(cubeX>0)
            {
                thisLayer = 1;
            }
            else if(cubeX===0)
            {
                thisLayer = 0;
            }
            else
            {
                thisLayer = -1;
            }  
        }
        else
        {
            thisLayer = 2;
        }
                           
    }
    else if(mouseMoveAxis==="z")
    {
        if(deltaY>threshhold)
        {
            thisRotDir = 1;
            movingByMouse = false;
        }
        else if(deltaY<-threshhold)
        {
            thisRotDir = -1;
            movingByMouse = false;
        }

        if(closestCube!==false)
        {
            if(cubeZ>0)
            {
                thisLayer = 1;
            }
            else if(cubeZ===0)
            {
                thisLayer = 0;
            }
            else
            {
                thisLayer = -1;
            }  
        }
        else
        {
            thisLayer = 2;
        }

    }
    else if(mouseMoveAxis==="y")
    {
        if(deltaX>threshhold)
        {
            thisRotDir = -1;
            movingByMouse = false;
        }
        else if(deltaX<-threshhold)
        {
            thisRotDir = 1;
            movingByMouse = false;
        }
        
        if(cubeX<=0&&cubeZ<=0)
        {
            if(((cubeX<0&&cubeZ===0)||(cubeX===0&&cubeZ<0))||(cubeX<0&&cubeZ<0))
            {
                thisRotDir = thisRotDir*-1;
            }
        }

        if(closestCube!==false)
        {
            if(cubeY>0)
            {
                thisLayer = 1;
            }
            else if(cubeY===0)
            {
                thisLayer = 0;
            }
            else
            {
                thisLayer = -1;
            }  
        }
        else
        {
            thisLayer = 2;
        }
    }

    if(!movingByMouse){rotateCube(thisRotDir,thisLayer,mouseMoveAxis);}
}

function moveDir(point1, point2)
{
    var x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y;
    var deltaX = (x2-x1);
    var deltaY = (y2-y1);
    var angle = deltaX!==0?(getDegrees(Math.atan(deltaY/deltaX))):(deltaY>0?90:-90);

    if(angle===90||angle===-90)
    {
        if(x1<myCanvas.width/2)
        {
            mouseMoveAxis = "x";
        }
        else if(x1>myCanvas.width/2)
        {
            mouseMoveAxis = "z";
        }
    }
    else
    {
        mouseMoveAxis = "y";
    }
    movingByMouse = true;

}

function onMouseUp()
{
    mouseDown = false;
    movingByMouse = false;
}

function getIntersects(event)
{
    var pos = getPos(event);

    vector = new THREE.Vector3((pos.x/myCanvas.width)*2-1,-(pos.y/myCanvas.height)*2+1,0.5);

    projector.unprojectVector( vector, camera );

    ray = new THREE.Raycaster( camera.position,vector.sub(camera.position).normalize() );

    intersects = ray.intersectObjects(rCubes);
    
    if(intersects.length>0){selectedCube = getSelectedCube(intersects);}
    else{selectedCube = false;}

    return ray.intersectObjects(rCubes);
}

function getSelectedCube(intersects)
{
    return intersects[0].object;
}

function onMouseDown(event)
{
    if(!rotatingCube)
    {
        var pos = getPos(event);
        
        var intersects = getIntersects(event);

        mouseDown = true;
        downPoint = {x:pos.x,y:myCanvas.width-pos.y-200};

        if(intersects.length>0)
        {
            closestCube = getSelectedCube(intersects);
        }
        else
        {
            closestCube = false;
        }
    }
}

function onMouseEnter()
{
    window.scrollTo(0, 0);
    $("body").css("overflow", "hidden");
}

function onMouseLeave()
{
    $("body").css("overflow-y", "auto")
    scene.remove(rCubeGlow);
}

function animate() 
{
    requestAnimationFrame( animate );

    render();
}

function render() 
{
    renderer.render( scene, camera );
}

function setMirrors()
{
    if($('#setMirrorsCB').prop('checked'))
    {
        for(var x=0;x<3;x++)
        {
            for(var y=0;y<3;y++)
            {
                scene.add(mirrors[0][x][y]);
                scene.add(mirrors[1][x][y]);
                scene.add(mirrors[2][x][y]);
            }
        }
    }
    else
    {
        for(var x=0;x<3;x++)
        {
            for(var y=0;y<3;y++)
            {
                scene.remove(mirrors[0][x][y]);
                scene.remove(mirrors[1][x][y]);
                scene.remove(mirrors[2][x][y]);
            }
        }
    }
}

function reset()
{
    $('#setMirrorsCB').prop('checked',false);setMirrors();
}

function addStoredMove(newMove)
{
    if(storedMoves.length===0)
    {
        storedMoves.push(newMove);
    }
    else
    {
        var prevMove = storedMoves[storedMoves.length-1];
        
        if(!(prevMove.dir===newMove.dir*-1&&prevMove.layer===newMove.layer&&prevMove.axis===newMove.axis))
        {
            storedMoves.push(newMove);
        }
        else
        {
            storedMoves.pop();
        }
    }
}

function addMove(newMove)
{
    if(moves.length===0)
    {
        moves.push(newMove);
    }
    else
    {
        var prevMove = moves[moves.length-1];
        
        if(!(prevMove.dir===newMove.dir*-1&&prevMove.layer===newMove.layer&&prevMove.axis===newMove.axis))
        {
            moves.push(newMove);
        }
        else
        {
            moves.pop();
        }
    }
}

function cloneMove(move)
{
    return {dir:move.dir,layer:move.layer,axis:move.axis};
}

function rotateCube(dir,newLayer,newRotationAxis)
{
    if(rotate&&!rotatingCube&&!movingByMouse&&!doMoves)
    {
        addStoredMove({dir:dir*-1,layer:newLayer,axis:newRotationAxis});
        $('#speedSelect').prop('disabled',true);
        $('.otherButton').prop('disabled',true);
        $('.directionButton').prop('disabled',true);
        $('.otherButton').removeClass('glow');
        $('.directionButton').removeClass('glow');
        
        layer = newLayer;
        rotationAxis = newRotationAxis;

        rotDir=dir;
        rotatingCube = true;
    }
}

function rotateCubeInstantly(dir,newLayer,newRotationAxis)
{
    if(rotate&&!rotatingCube&&!movingByMouse)
    {
        if(record){addStoredMove({dir:dir*-1,layer:newLayer,axis:newRotationAxis});};
        $('#speedSelect').prop('disabled',true);
        $('.otherButton').prop('disabled',true);
        $('.directionButton').prop('disabled',true);
        $('.otherButton').removeClass('glow');
        $('.directionButton').removeClass('glow');
        layer = newLayer;
        rotationAxis = newRotationAxis;
        
        instantRotate = true;
        rotDir=dir;
        rotatingCube = true;
        
        doInstantRotate();
    }
}

function rotateCubeReverse(userCalled)
{
    if(!isCubeSolved())
    {
        if(rotate&&!rotatingCube&&!movingByMouse)
        {
            if(storedMoves.length>0)
            {
                scene.remove(rCubeGlow);
                var nextMove = storedMoves.pop();
                var dir = (nextMove.dir);
                var newLayer = nextMove.layer;
                var newRotationAxis = nextMove.axis;

                $('#speedSelect').prop('disabled',true);
                $('.otherButton').prop('disabled',true);
                $('.directionButton').prop('disabled',true);
                $('.otherButton').removeClass('glow');
                $('.directionButton').removeClass('glow');

                layer = newLayer;
                rotationAxis = newRotationAxis;

                doStoredMoves = true;
                rotDir=dir;
                rotatingCube = true;

                doRotateStoredMoves();
            }
        }
    }
    else
    {
        if(userCalled)
        {
            alert("The cube is already solved! :)");
        }
        if(storedMoves.length>0){storedMoves = new Array();}
    }
    
}

function isCubeSolved()
{    
    for(var x=-1;x<2;x=x+2)
    {
        var faceColors = new Array();
        
        for(var y=-1;y<2;y++)
        {
            for(var z=-1;z<2;z++)
            {
                thisCube = getCubeByPosition(x,y,z);
                
                if(x===-1)
                {
                    faceColors.push(thisCube.geometry.faces[1].color.clone());
                }
                else if(x===1)
                {
                    faceColors.push(thisCube.geometry.faces[0].color.clone());
                }
            }
        }
        
        if(!compareColorArray(faceColors)){return false;}
    }
    
    for(var y=-1;y<2;y=y+2)
    {
        var faceColors = new Array();
        
        for(var x=-1;x<2;x++)
        {
            for(var z=-1;z<2;z++)
            {
                thisCube = getCubeByPosition(x,y,z);
                
                if(y===-1)
                {
                    faceColors.push(thisCube.geometry.faces[3].color.clone());
                }
                else if(y===1)
                {
                    faceColors.push(thisCube.geometry.faces[2].color.clone());
                }
            }
        }
        
        if(!compareColorArray(faceColors)){return false;}
    }
    
    for(var z=-1;z<2;z=z+2)
    {
        var faceColors = new Array();
        
        for(var x=-1;x<2;x++)
        {
            for(var y=-1;y<2;y++)
            {
                thisCube = getCubeByPosition(x,y,z);
                
                if(z===-1)
                {
                    faceColors.push(thisCube.geometry.faces[5].color.clone());
                }
                else if(z===1)
                {
                    faceColors.push(thisCube.geometry.faces[4].color.clone());
                }
            }
        }
        
        if(!compareColorArray(faceColors)){return false;}
    }
    
    return true;
}

function isFaceSolved(axis,layer)
{
    var mainFaceColors = new Array();
    var sideAxis1Colors1 = new Array();
    var sideAxis1Colors2 = new Array();
    var sideAxis2Colors1 = new Array();
    var sideAxis2Colors2 = new Array();
    
    if(axis==="x")
    {        
        for(var y=-1;y<2;y++)
        {
            for(var z=-1;z<2;z++)
            {
                thisCube = getCubeByPosition(layer,y,z);
                
                if(layer===-1)
                {
                    mainFaceColors.push(thisCube.geometry.faces[1].color.clone());
                }
                else if(layer===1)
                {
                    mainFaceColors.push(thisCube.geometry.faces[0].color.clone());
                }
                
                if(z===1)
                {
                    sideAxis1Colors1.push(thisCube.geometry.faces[4].color.clone());
                }
                else if(z===-1)
                {
                    sideAxis1Colors2.push(thisCube.geometry.faces[5].color.clone());
                }
                
                if(y===1)
                {
                    sideAxis2Colors1.push(thisCube.geometry.faces[2].color.clone());
                }
                else if(y===-1)
                {
                    sideAxis2Colors2.push(thisCube.geometry.faces[3].color.clone());
                }
            }
        }
    }
    else if(axis==="y")
    {        
        for(var x=-1;x<2;x++)
        {
            for(var z=-1;z<2;z++)
            {
                thisCube = getCubeByPosition(x,layer,z);
                
                if(layer===-1)
                {
                    mainFaceColors.push(thisCube.geometry.faces[3].color.clone());
                }
                else if(layer===1)
                {
                    mainFaceColors.push(thisCube.geometry.faces[2].color.clone());
                }
                
                if(z===1)
                {
                    sideAxis1Colors1.push(thisCube.geometry.faces[4].color.clone());
                }
                else if(z===-1)
                {
                    sideAxis1Colors2.push(thisCube.geometry.faces[5].color.clone());
                }
                
                if(x===1)
                {
                    sideAxis2Colors1.push(thisCube.geometry.faces[0].color.clone());
                }
                else if(x===-1)
                {
                    sideAxis2Colors2.push(thisCube.geometry.faces[1].color.clone());
                }
            }
        }
    }
    else if(axis==="z")
    {        
        for(var x=-1;x<2;x++)
        {
            for(var y=-1;y<2;y++)
            {
                thisCube = getCubeByPosition(x,y,layer);
                
                if(layer===-1)
                {
                    mainFaceColors.push(thisCube.geometry.faces[5].color.clone());
                }
                else if(layer===1)
                {
                    mainFaceColors.push(thisCube.geometry.faces[4].color.clone());
                }
                
                if(y===1)
                {
                    sideAxis1Colors1.push(thisCube.geometry.faces[2].color.clone());
                }
                else if(y===-1)
                {
                    sideAxis1Colors2.push(thisCube.geometry.faces[3].color.clone());
                }
                
                if(x===1)
                {
                    sideAxis2Colors1.push(thisCube.geometry.faces[0].color.clone());
                }
                else if(x===-1)
                {
                    sideAxis2Colors2.push(thisCube.geometry.faces[1].color.clone());
                }
            }
        }
    }
    
    if(layer!==0)
    {
        if(!compareColorArray(mainFaceColors)){return false;}
    }

    if(!compareColorArray(sideAxis1Colors1)){return false;}
    if(!compareColorArray(sideAxis1Colors2)){return false;}
    if(!compareColorArray(sideAxis2Colors1)){return false;}
    if(!compareColorArray(sideAxis2Colors2)){return false;}
    
    return true;
}

function compareColorArray(faceColors)
{
    var initColor = faceColors[0];
    
    for(var i=1;i<faceColors.length;i++)
    {
        if(!compareColors(initColor,faceColors[i])){return false;}
    }
    
    if(faceColors.length===0){return false;}
    return true;
}

function rotateCubeByMoves(instant)
{
    if(rotate&&!rotatingCube&&!movingByMouse)
    {
        if(moves.length>0)
        {
            scene.remove(rCubeGlow);
            var nextMove = moves[0];
            moves.splice(0,1);
            var dir = (nextMove.dir);
            var newLayer = nextMove.layer;
            var newRotationAxis = nextMove.axis;
            
            if(!instant){addStoredMove({dir:dir*-1,layer:newLayer,axis:newRotationAxis});};
            
            $('#speedSelect').prop('disabled',true);
            $('.otherButton').prop('disabled',true);
            $('.directionButton').prop('disabled',true);
            $('.otherButton').removeClass('glow');
            $('.directionButton').removeClass('glow');

            layer = newLayer;
            rotationAxis = newRotationAxis;

            doMoves = true;
            rotDir=dir;
            rotatingCube = true;
            
            
            doRotateByMoves(instant);
        }
    }
}

function doRotateStoredMoves()
{
    cubeDegrees-=increment*rotDir;
    for(var x=xStart;x<xEnd;x++)
    {
        for(var y=yStart;y<yEnd;y++)
        {
            for(var z=zStart;z<zEnd;z++)
            {

                if(rotationAxis==='x')
                {
                    if(layer===1&&rCube[x][y][z][0].position.x>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.x===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.x<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
                else if(rotationAxis==='y')
                {
                    if(layer===1&&rCube[x][y][z][0].position.y>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.y===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.y<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
                else if(rotationAxis==='z')
                {
                    if(layer===1&&rCube[x][y][z][0].position.z>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.z===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.z<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
            }
        }
    }
    
    if(cubeDegrees===-90*rotDir)
    {
        rotatingCube = false;
        cubeDegrees=0;
        
        if(storedMoves.length>0)
        {
            rotateCubeReverse();
        }
        else
        {
            doStoredMoves = false;
        }
    }

    render();
}

function doRotateByMoves(instant)
{
    if(instant)
    {
        cubeDegrees=-90*rotDir;
    }
    else
    {
        cubeDegrees-=increment*rotDir;
    }
    
    for(var x=xStart;x<xEnd;x++)
    {
        for(var y=yStart;y<yEnd;y++)
        {
            for(var z=zStart;z<zEnd;z++)
            {

                if(rotationAxis==='x')
                {
                    if(layer===1&&rCube[x][y][z][0].position.x>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.x===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.x<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
                else if(rotationAxis==='y')
                {
                    if(layer===1&&rCube[x][y][z][0].position.y>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.y===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.y<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
                else if(rotationAxis==='z')
                {
                    if(layer===1&&rCube[x][y][z][0].position.z>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.z===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.z<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
            }
        }
    }
    
    if(cubeDegrees===-90*rotDir)
    {
        rotatingCube = false;
        cubeDegrees=0;
        
        if(moves.length>0)
        {
            rotateCubeByMoves(instant);
        }
        else
        {
            doMoves = false;
        }
    }

    render();
}

function cheat(type)
{
    if(type==='solve')
    {
        $('#reverseSolve').prop('hidden',false);
    }
}

function doRotate()
{
    cubeDegrees-=increment*rotDir;

    for(var x=xStart;x<xEnd;x++)
    {
        for(var y=yStart;y<yEnd;y++)
        {
            for(var z=zStart;z<zEnd;z++)
            {

                if(rotationAxis==='x')
                {
                    if(layer===1&&rCube[x][y][z][0].position.x>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.x===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.x<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
                else if(rotationAxis==='y')
                {
                    if(layer===1&&rCube[x][y][z][0].position.y>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.y===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.y<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
                else if(rotationAxis==='z')
                {
                    if(layer===1&&rCube[x][y][z][0].position.z>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.z===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.z<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
            }
        }
    }

    if(cubeDegrees===-90*rotDir)
    {
        rotatingCube = false;
        cubeDegrees=0;
    }

    render();
}

function doInstantRotate()
{
    cubeDegrees=-90*rotDir;

    for(var x=xStart;x<xEnd;x++)
    {
        for(var y=yStart;y<yEnd;y++)
        {
            for(var z=zStart;z<zEnd;z++)
            {

                if(rotationAxis==='x')
                {
                    if(layer===1&&rCube[x][y][z][0].position.x>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.x===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.x<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
                else if(rotationAxis==='y')
                {
                    if(layer===1&&rCube[x][y][z][0].position.y>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.y===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.y<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
                else if(rotationAxis==='z')
                {
                    if(layer===1&&rCube[x][y][z][0].position.z>0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===0&&rCube[x][y][z][0].position.z===0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===-1&&rCube[x][y][z][0].position.z<0)
                    {
                        act(x,y,z);
                    }
                    else if(layer===2)
                    {
                        act(x,y,z);
                    }
                }
            }
        }
    }

    if(cubeDegrees===-90*rotDir)
    {
        rotatingCube = false;
        cubeDegrees=0;
        instantRotate = false;
    }

    render();
}

function setSpeed()
{
    var newIncrement = parseInt($('#speedSelect option:selected').val());
    increment = newIncrement;
    
    $('#speedSelect').blur();
}

function getNoneBlackCubeColors(cube)
{
    var colors = 0;
    var faces = cube.geometry.faces;
    
    var faceColors = new Array();
    
    for(var x=0;x<faces.length;x++)
    {
        var faceColor = faces[x].color.clone();
        if(!compareColors(faceColor,black))
        {
            faceColors.push({index:x,color:faceColor});
        }
    }
    
    return faceColors;
}

function getCubeByPosition(cubeX,cubeY,cubeZ)
{
    var found = false;
    
    for(var x=0;x<3;x++)
    {
        for(var y=0;y<3;y++)
        {
            for(var z=0;z<3;z++)
            {
                var thisX = rCube[x][y][z][0].position.x;
                var thisY = rCube[x][y][z][0].position.y;
                var thisZ = rCube[x][y][z][0].position.z;
                
                if(((cubeX>0&&thisX>0)||(cubeX===0&&thisX===0)||(cubeX<0&&thisX<0))&&
                   ((cubeY>0&&thisY>0)||(cubeY===0&&thisY===0)||(cubeY<0&&thisY<0))&&
                   ((cubeZ>0&&thisZ>0)||(cubeZ===0&&thisZ===0)||(cubeZ<0&&thisZ<0)))
                {
                    return rCube[x][y][z][0];
                }
            }
        }
    }
    
    return found;
}

function getCubeByColors(targetColors)
{
    var found = false;
    
    for(var x=0;x<3;x++)
    {
        for(var y=0;y<3;y++)
        {
            for(var z=0;z<3;z++)
            {
                var thisCube = rCube[x][y][z][0];
                var noneBlackColors = getNoneBlackCubeColors(thisCube);
                var thisColors = new Array();
                for(var i=0;i<noneBlackColors.length;i++)
                {thisColors.push(noneBlackColors[i].color);}
                
                var foundCube = true;
                
                if(thisColors.length===targetColors.length)
                {
                    for(var i=0;i<targetColors.length;i++)
                    {
                        if(!colorInColors(targetColors[i],thisColors))
                        {
                            foundCube = false;
                        }
                    }
                }
                else{foundCube = false;}
                
                if(foundCube){return thisCube;}
            }
        }
    }
    
    return found;
}

function colorInColors(targetColor,theseColors)
{
    for(var i=0;i<theseColors.length;i++)
    {
        if(compareColors(targetColor,theseColors[i]))
        {
            return true;
        }
    }
    
    return false;
}

function compareColors(color1,color2)
{
    var rgb1 = color1.getRGB();
    var rgb2 = color2.getRGB();
    
    if(rgb1.r===rgb2.r&&rgb1.g===rgb2.g&&rgb1.b===rgb2.b)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function act(x,y,z)
{
    var thisCube = rCube[x][y][z][0];

    if(thisCube)
    {
        var thisInit = rCube[x][y][z][1];

        var axisA, axisB, adjustIndex;


        if(rotationAxis==='x')
        {
            axisA = 2; axisB = 1; adjustIndex = 0;
        }
        else if(rotationAxis==='y')
        {
            axisA = 0; axisB = 2; adjustIndex = 1;
        }
        else if(rotationAxis==='z')
        {
            axisA = 0; axisB = 1; adjustIndex = 2;
        }

        var initA = thisInit[axisA];
        var initB = thisInit[axisB];
        var radians = 0;

        if(initA>0)
        {
            if(initB===0){radians = getRadians(getAntiDraw(cubeDegrees));}
            else if(initB>0){radians = getRadians(getAntiDraw(cubeDegrees-45));}
            else if(initB<0){radians = getRadians(getAntiDraw(cubeDegrees+45));}
        }
        else if(initA<0)
        {
            if(initB===0){radians = getRadians(getAntiDraw(cubeDegrees-180));}
            else if(initB>0){radians = getRadians(getAntiDraw(cubeDegrees-135));}
            else if(initB<0){radians = getRadians(getAntiDraw(cubeDegrees+135));}
        }
        else if(initA===0)
        {
            if(initB>0){radians = getRadians(getAntiDraw(cubeDegrees-90));}
            else if(initB<0){radians = getRadians(getAntiDraw(cubeDegrees+90));}
        }


        if(rotationAxis==='x')
        {

            var thisRadius = Math.sqrt(Math.pow(thisCube.position.y,2)+Math.pow(thisCube.position.z,2));
            thisCube.position.z = thisRadius*Math.cos(radians);
            thisCube.position.y = thisRadius*Math.sin(radians);
            thisCube.rotation.x = getRadians(cubeDegrees);
        }
        else if(rotationAxis==='y')
        {
            var thisRadius = Math.sqrt(Math.pow(thisCube.position.x,2)+Math.pow(thisCube.position.z,2));
            thisCube.position.x = thisRadius*Math.cos(radians);
            thisCube.position.z = thisRadius*Math.sin(radians);
            thisCube.rotation.y = getRadians(cubeDegrees);
        }
        else if(rotationAxis==='z')
        {
            var thisRadius = Math.sqrt(Math.pow(thisCube.position.x,2)+Math.pow(thisCube.position.y,2));
            thisCube.position.x = thisRadius*Math.cos(radians);
            thisCube.position.y = thisRadius*Math.sin(radians);
            thisCube.rotation.z = getRadians(-1*cubeDegrees);
        }
        if(selectedCube&&!doMoves){scene.add(rCubeGlow);}
        if(cubeDegrees===-90*rotDir)
        {
            thisCube.position.x = Math.round(thisCube.position.x);
            thisCube.position.y = Math.round(thisCube.position.y);
            thisCube.position.z = Math.round(thisCube.position.z);

            thisInit[0] = Math.round(thisCube.position.x);
            thisInit[1] = Math.round(thisCube.position.y);
            thisInit[2] = Math.round(thisCube.position.z);

            if(rotationAxis==='x')
            {
                thisCube.rotation.x = getRadians((cubeDegrees+(90*rotDir)));
            }
            else if(rotationAxis==='y')
            {
                thisCube.rotation.y = getRadians((cubeDegrees+(90*rotDir)));
            }
            else if(rotationAxis==='z')
            {
                thisCube.rotation.z = getRadians(-1*(cubeDegrees+(90*rotDir)));
            }
            adjustCube(thisCube,rotationAxis,rotDir);
            setMirrorColors();
            $('#speedSelect').prop('disabled',false);
            $('.otherButton').prop('disabled',false);
            $('.directionButton').prop('disabled',false);
            $('.otherButton').addClass('glow');
            $('.directionButton').addClass('glow');
        }
    }                            
}

function setBlack(face)
{
    face.color.setHex(0x222222);
}

function adjustCube(cube,rotAxis,rotDir)
{
    var colors = getCubeColors(cube);
    var faces = cube.geometry.faces;

    var position = cube.position;
    var x = position.x, y = position.y, z = position.z;

    if(rotAxis==='x')
    {
        if(rotDir===1)
        {
            if(z>0)
            {
                faces[4].color = colors[3];

                if(y>0)
                {
                    faces[2].color = colors[4];
                    setBlack(faces[3]);

                }
                else if(y===0)
                {
                    setBlack(faces[3]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[5];
                    setBlack(faces[5]);
                }
            }
            else if(z===0)
            {
                if(y>0)
                {
                    faces[2].color = colors[4];
                    setBlack(faces[4]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[5];
                    setBlack(faces[5]);
                }
            }
            else if(z<0)
            {
                faces[5].color = colors[2];

                if(y>0)
                {
                    faces[2].color = colors[4];
                    setBlack(faces[4]);
                }
                else if(y===0)
                {
                    setBlack(faces[2]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[5];
                    setBlack(faces[2]);
                }
            }
        }
        else if(rotDir===-1)
        {
            if(z>0)
            {
                faces[4].color = colors[2];

                if(y>0)
                {
                    faces[2].color = colors[5];
                    setBlack(faces[5]);

                }
                else if(y===0)
                {
                    setBlack(faces[2]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[4];
                    setBlack(faces[2]);
                }
            }
            else if(z===0)
            {
                if(y>0)
                {
                    faces[2].color = colors[5];
                    setBlack(faces[5]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[4];
                    setBlack(faces[4]);
                }
            }
            else if(z<0)
            {
                faces[5].color = colors[3];

                if(y>0)
                {
                    faces[2].color = colors[5];
                    setBlack(faces[3]);
                }
                else if(y===0)
                {
                    setBlack(faces[3]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[4];
                    setBlack(faces[4]);
                }
            }
        }
    }
    else if(rotAxis==='y')
    {
        if(rotDir===1)
        {
            if(x>0)
            {
                faces[0].color = colors[5];

                if(z>0)
                {
                    faces[4].color = colors[0];
                    setBlack(faces[5]);

                }
                else if(z===0)
                {
                    setBlack(faces[5]);
                }
                else if(z<0)
                {
                    faces[5].color = colors[1];
                    setBlack(faces[1]);
                }
            }
            else if(x===0)
            {
                if(z>0)
                {
                    faces[4].color = colors[0];
                    setBlack(faces[0]);
                }
                else if(z<0)
                {
                    faces[5].color = colors[1];
                    setBlack(faces[1]);
                }
            }
            else if(x<0)
            {
                faces[1].color = colors[4];

                if(z>0)
                {
                    faces[4].color = colors[0];
                    setBlack(faces[0]);
                }
                else if(z===0)
                {
                    setBlack(faces[4]);
                }
                else if(z<0)
                {
                    faces[5].color = colors[1];
                    setBlack(faces[4]);
                }
            }
        }
        else if(rotDir===-1)
        {
            if(x>0)
            {
                faces[0].color = colors[4];

                if(z>0)
                {
                    faces[4].color = colors[1];
                    setBlack(faces[1]);

                }
                else if(z===0)
                {
                    setBlack(faces[4]);
                }
                else if(z<0)
                {
                    faces[5].color = colors[0];
                    setBlack(faces[4]);
                }
            }
            else if(x===0)
            {
                if(z>0)
                {
                    faces[4].color = colors[1];
                    setBlack(faces[1]);
                }
                else if(z<0)
                {
                    faces[5].color = colors[0];
                    setBlack(faces[0]);
                }
            }
            else if(x<0)
            {
                faces[1].color = colors[5];

                if(z>0)
                {
                    faces[4].color = colors[1];
                    setBlack(faces[5]);
                }
                else if(z===0)
                {
                    setBlack(faces[5]);
                }
                else if(z<0)
                {
                    faces[5].color = colors[0];
                    setBlack(faces[0]);
                }
            }
        }
    }
    else if(rotAxis==='z')
    {
        if(rotDir===1)
        {
            if(x>0)
            {
                faces[0].color = colors[3];

                if(y>0)
                {
                    faces[2].color = colors[0];
                    setBlack(faces[3]);

                }
                else if(y===0)
                {
                    setBlack(faces[3]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[1];
                    setBlack(faces[1]);
                }
            }
            else if(x===0)
            {
                if(y>0)
                {
                    faces[2].color = colors[0];
                    setBlack(faces[0]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[1];
                    setBlack(faces[1]);
                }
            }
            else if(x<0)
            {
                faces[1].color = colors[2];

                if(y>0)
                {
                    faces[2].color = colors[0];
                    setBlack(faces[0]);
                }
                else if(y===0)
                {
                    setBlack(faces[2]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[1];
                    setBlack(faces[2]);
                }
            }
        }
        else if(rotDir===-1)
        {
            if(x>0)
            {
                faces[0].color = colors[2];

                if(y>0)
                {
                    faces[2].color = colors[1];
                    setBlack(faces[1]);

                }
                else if(y===0)
                {
                    setBlack(faces[2]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[0];
                    setBlack(faces[2]);
                }
            }
            else if(x===0)
            {
                if(y>0)
                {
                    faces[2].color = colors[1];
                    setBlack(faces[1]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[0];
                    setBlack(faces[0]);
                }
            }
            else if(x<0)
            {
                faces[1].color = colors[3];

                if(y>0)
                {
                    faces[2].color = colors[1];
                    setBlack(faces[3]);
                }
                else if(y===0)
                {
                    setBlack(faces[3]);
                }
                else if(y<0)
                {
                    faces[3].color = colors[0];
                    setBlack(faces[0]);
                }
            }
        }
    }
    cube.geometry.colorsNeedUpdate = true;
}

function randomizeCube()
{
    if(!rotatingCube)
    {
        if(isCubeSolved())
        {
            randomOrientation();
        }
        else
        {
            doSpecialMove(storedMoves.reverse(),true);
            storedMoves = new Array();
        }
        for(var i=0;i<randomizeMoves;i++)
        {
            var random0 = Math.floor(Math.random()*2+1);
            var random1 = Math.floor(Math.random()*4+1);
            var random2 = Math.floor(Math.random()*3+1);

            var arg0=1,arg1=2,arg2="x";

            if(random0===2){arg0=-1;}
            if(random1===1){arg1=-1;}else if(random1===2){arg1=0;}else if(random1===3){arg1=1;}
            if(random2===2){arg2="y";}else if(random2===3){arg2="z";}

            rotateCubeInstantly(arg0,arg1,arg2);       
        }
    }
    
}

function getCubeColors(cube)
{
    var colors = new Array();

    for(var i=0;i<6;i++)
    {
        colors[i] = cube.geometry.faces[i].color.clone();
    }

    return colors;
}

function setFaceColor(face,color)
{
    var newColor = color.clone();
    face.color = newColor;
}