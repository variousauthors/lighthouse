var WIDTH = 1024;
var HEIGHT = 600;
var RADIUS = Math.sqrt(Math.pow(WIDTH/2, 2) + Math.pow(HEIGHT/2, 2)) + Math.max(WIDTH, HEIGHT)/5;

function onDown (e) {
    var target = e.target;
    var point = e.data.getLocalPosition(target);

    if (! Game.graphics.light.containsPoint(point)) { return false; }

    console.log("YESS");
}

(function () {
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { antialias: true });
    document.body.appendChild(renderer.view);

    var parent = new PIXI.Container();
    // create the root of the scene graph
    var stage = new PIXI.Container();

    var background = Game.background.init();
    stage.addChild(background);

    // make a beam of light
    var light = Game.light.init();
    stage.addChild(light);

    // make a hat (triangle)
    var triangle = Game.debris.hat.init();

    triangle.interactive = true;
    triangle.on('mousedown', onDown);

    stage.addChild(triangle);

    var museum = Game.museum.init();
    var lighthouse_shadow = Game.lighthouse.init();
    var lighthouse_light = Game.lighthouse.init();
    lighthouse_light.alpha = 1;

    stage.mask = light;

    stage.addChild(lighthouse_light);

    parent.addChild(lighthouse_shadow);
    parent.addChild(stage);
    parent.addChild(museum);

    Game.timer = 0;

    function animate() {
        Game.timer += 0.1;

        Game.light.update();

        renderer.render(parent);
        requestAnimationFrame( animate );
    }

    // when the light leaves one half of the screen, the objects on that half get shuffled about

    // when the player clicks on an object, if it is visible, they get the museum entry

    // run the render loop
    animate();
}());

