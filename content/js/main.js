var WIDTH = 1024;
var HEIGHT = 600;
var RADIUS = Math.sqrt(Math.pow(WIDTH/2, 2) + Math.pow(HEIGHT/2, 2)) + Math.max(WIDTH, HEIGHT)/5;

// produces an (x, y) on the screen, above the lighthouse
function randomPosition () {
    var x = Math.random() * (WIDTH - 100);
    var y = Math.random() * (HEIGHT - HEIGHT/3);

    return [x, y];
}

function onDown (e) {
    var target = e.target;
    var point = e.data.getLocalPosition(target);

    Game.museum.deselect();

    if (! Game.entities.light.containsPoint(point)) {
        return false;
    }

    Game.museum.select(target.name);
}

(function () {
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { antialias: true });
    document.body.appendChild(renderer.view);

    var parent = new PIXI.Container();
    // create the root of the scene graph
    var stage = new PIXI.Container();

    var background = Game.background.init();
    stage.addChild(background);
    background.interactive = true;
    background.on("mousedown", onDown);

    // make a beam of light
    var light = Game.light.init();
    stage.addChild(light);

    // initialize the debris
    Object.keys(Game.debris).forEach(function (key, index) {
        var debris = Game.debris[key].init();
        var position;

        debris.interactive = true;
        debris.on('mousedown', onDown);

        position = randomPosition();

        debris.position.set(position[0], position[1]);

        stage.addChild(debris);
    });

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
    Game.tic = 0;

    function animate() {
        var dt = 0.016;
        var next = (Game.timer + dt) % 1;

        // whenever the game timer
        if (next < Game.timer) {
            Game.tic += 1;
            console.log(Game.tic);
        } else {
        }

        Game.light.update(dt);
        Game.museum.update(dt);

        Game.timer = next;

        renderer.render(parent);
        requestAnimationFrame( animate );
    }

    // objects positioned randomly about the screen such that they are in front of the lighthouse
    // there shouldn't always be objects on every pass, make it random
    //
    // every time the light passes behind the lighthouse, shuffle all objects

    animate();
}());

