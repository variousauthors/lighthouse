var bunny;
var WIDTH = 800;
var HEIGHT = 600;
var RADIUS = Math.sqrt(Math.pow(WIDTH/2, 2) + Math.pow(HEIGHT/2, 2)) + Math.max(WIDTH, HEIGHT)/5;

function initBunny (stage) {
    // create a texture from an image path
    var texture = PIXI.Texture.fromImage('images/bunny.png');

    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);

    // center the sprite's anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // move the sprite to the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 150;

    return bunny;
}

function updateBunny () {
    // just for fun, let's rotate mr rabbit a little
    bunny.rotation += 0.1;
}

(function () {
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { antialias: true });
    document.body.appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    stage.interactive = true;

    var graphics = new PIXI.Graphics();

    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.beginFill(0x1099bb, 1);
    graphics.drawRect(0, 0, WIDTH, HEIGHT);

    // set a fill and line style
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(4, 0xffd900, 1);

    // draw a shape
    graphics.moveTo(50,50);
    graphics.lineTo(250, 50);
    graphics.lineTo(100, 100);
    graphics.lineTo(50, 50);
    graphics.endFill();

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

    // make a beam of light
    var light = new PIXI.Graphics();
    stage.addChild(light);
    light.position.x = WIDTH/2 + WIDTH/4;
    light.position.y = HEIGHT/2 + HEIGHT/4;

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

        light.beginFill(0x8bc5ff, 0.4);
        light.moveTo(0, 0);
        light.lineTo(cx_1, cy_1);
        light.lineTo(cx_2, cy_2);
        light.lineTo(0, 0);

        //light.rotation = count * 0.1;

        renderer.render(stage);
        requestAnimationFrame( animate );
    }

    // run the render loop
    animate();
}());

