var WIDTH = 800;
var HEIGHT = 600;
var RADIUS = Math.sqrt(Math.pow(WIDTH/2, 2) + Math.pow(HEIGHT/2, 2)) + Math.max(WIDTH, HEIGHT)/5;
var light, triangle;

function onDown (e) {
    var target = e.target;
    var point = e.data.getLocalPosition(target);

    if (! light.containsPoint(point)) { return false; }

    console.log("CLICKY");
}

(function () {
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { antialias: true });
    document.body.appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    stage.interactive = true;
    stage.on('mousedown', onDown);

    var background = new PIXI.Graphics();

    // set a fill and a line style again and draw a rectangle
    background.lineStyle(2, 0x0000FF, 1);
    background.beginFill(0x1099bb, 1);
    background.drawRect(0, 0, WIDTH, HEIGHT);

    stage.addChild(background);

    // make a beam of light
    light = new PIXI.Graphics();
    light.position.x = WIDTH/2 + WIDTH/4;
    light.position.y = HEIGHT/2 + HEIGHT/4;
    stage.addChild(light);

    triangle = new PIXI.Graphics();

    // set a fill and line style
    triangle.beginFill(0xFF3300);
    triangle.lineStyle(4, 0xffd900, 1);

    // draw a shape
    triangle.moveTo(50,50);
    triangle.lineTo(250, 50);
    triangle.lineTo(100, 100);
    triangle.lineTo(50, 50);
    triangle.endFill();
    triangle.interactive = true;

    stage.addChild(triangle);

    var graphics = new PIXI.Graphics();

    // draw a rounded rectangle
    graphics.lineStyle(2, 0xFF00FF, 1);
    graphics.beginFill(0xFF00BB, 0.25);
    graphics.drawRoundedRect(150, 450, 300, 100, 15);
    graphics.endFill();

    // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.lineStyle(0);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(470, 90,60);
    graphics.endFill();

    // draw a thing?
    graphics.moveTo(50,50);
    graphics.lineTo(250, 50);
    graphics.lineTo(100, 100);
    graphics.lineTo(50, 50);
    graphics.endFill();

    stage.mask = light;
    stage.addChild(graphics);

    var count = 0;

    function animate() {
        var step = (2*Math.PI)/48;
        var theta = count*step;
        var arc = Math.PI/8;

        var cx_1 = RADIUS*Math.cos(theta) - 200;
        var cy_1 = RADIUS*Math.sin(theta) - 200;
        var cx_2 = RADIUS*Math.cos(theta + arc) - 200;
        var cy_2 = RADIUS*Math.sin(theta + arc) - 200;

        count += 0.1;

        light.clear();

        light.beginFill(0xFFFFFF, 0.4);
        light.moveTo(0, 0);
        light.lineTo(cx_1, cy_1);
        light.lineTo(cx_2, cy_2);
        light.lineTo(0, 0);
        light.endFill();
        light.hitArea = light.getBounds();

        renderer.render(stage);
        requestAnimationFrame( animate );
    }

    // when the light leaves one half of the screen, the objects on that half get shuffled about

    // when the player clicks on an object, if it is visible, they get the museum entry

    // run the render loop
    animate();
}());

