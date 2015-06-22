var WIDTH = 1024;
var HEIGHT = 600;
var RADIUS = 1200;

// produces an (x, y) on the screen, above the lighthouse
function randomPosition () {
    var x = Math.random() * (WIDTH - 100);
    var y = Math.random() * (HEIGHT - HEIGHT/3) + HEIGHT; // offset by HEIGHT because of the intro

    return [x, y];
}

function onDown (e) {
    var target = e.target;
    var point = e.data.getLocalPosition(target.parent);

    if (Game.selected) {
        Game.museum.deselect();
    }

    if (! Game.entities.light.containsPoint(point)) {
        return false;
    }

    Game.museum.select(target.name);
}

(function () {
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { antialias: true });
    document.body.appendChild(renderer.view);

    var parent = new PIXI.Container();
    var shadow_box = new PIXI.Container();
    // create the root of the scene graph
    var stage = new PIXI.Container();

    var background = Game.background.init();
    stage.addChild(background);
    background.interactive = true;
    background.on("mousedown", onDown);

    var title = Game.title.init();
    stage.addChild(title);

    // make a beam of light
    var light = Game.light.init();
    stage.addChild(light);

    var foreground = new PIXI.Container();

    // initialize the debris
    Object.keys(Game.debris).forEach(function (key, index) {
        var debris = Game.debris[key].init();
        var position;

        debris.interactive = true;
        debris.on('mousedown', onDown);

        position = randomPosition();

        debris.position.set(position[0], position[1]);
        debris.anchor.x = 0.5;
        debris.anchor.y = 0.5;
        debris.visible = false;

        Game.debris[key].position = new PIXI.Point(debris.position.x, debris.position.y);

        foreground.addChild(debris);
    });

    stage.addChild(foreground);
    Game.foreground = foreground;

    var museum = Game.museum.init();
    var lighthouse_shadow = Game.lighthouse.init();
    var lighthouse_light = Game.lighthouse.init();
    lighthouse_light.alpha = 1;

    stage.mask = light;

    stage.addChild(lighthouse_light);

    shadow_box.addChild(lighthouse_shadow);

    parent.addChild(stage);
    parent.addChild(shadow_box);
    parent.addChild(museum);

    Game.parent = parent;
    Game.stage = stage;
    Game.shadow_box = shadow_box;
    Game.timer = 0;
    Game.tic = 0;
    Game.wave = 0;
    Game.shuffle = true;

    function animate() {
        var dt = 0.016;
        var next = (Game.timer + dt) % 1;

        if (Game.intro.playing == true) {
            Game.intro.update(dt);
        }

        if (next < Game.timer) {
            Game.tic += 1;

            // every fourth tic
            if ((Game.tic % (Game.light.rate)) == 0) {
                Game.shuffle = true;
            }
        }

        // TODO this should move into an update function
        Game.foreground.children.forEach(function (object, index) {
            var debris = Game.debris[object.name];
            var position;
            var rnd = ((Math.random() * 10)|0) % (Game.foreground.children.length/2);

            if (debris !== undefined) {
                if (Game.shuffle === true) {
                    if (rnd == 0) {
                        // shuffle the debris
                        position = randomPosition();

                        debris.position.set(position[0], position[1]);
                        object.position.set(position[0], position[1]);

                        object.visible = true;
                    } else {
                        object.visible = false;
                    }
                } else {
                    var reach = object.height/10;

                    // the object bobs up and down gently
                    // debris.position stores the objects coords sans bob
                    var y = reach * Math.sin(Game.wave*2*Math.PI);
                    var theta = 0.1*Math.sin(Game.wave*2*Math.PI);

                    object.position.set(debris.position.x, debris.position.y + y);
                    object.rotation = theta;
                }
            }
        });

        Game.light.update(dt);
        Game.museum.update(dt);

        Game.wave = (Game.wave + dt/4) % 1;
        Game.timer = next;
        Game.shuffle = false;

        renderer.render(parent);
        requestAnimationFrame( animate );
    }

    // objects positioned randomly about the screen such that they are in front of the lighthouse
    // there shouldn't always be objects on every pass, make it random
    //
    // every time the light passes behind the lighthouse, shuffle all objects

    animate();
}());

