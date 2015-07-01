var WIDTH = 1024;
var HEIGHT = 600;
var RADIUS = 1300;

// produces an (x, y) on the screen, above the lighthouse
function randomPosition () {
    var x = Math.random() * (WIDTH - 100);
    var y = Math.random() * (HEIGHT - HEIGHT/3) + HEIGHT; // offset by HEIGHT because of the intro

    return [x, y];
}

function onUp (e) {
    // end a drag

}

(function () {
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { antialias: true });
    document.getElementById("container").appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();
    var GUI = new PIXI.Container();
    var parent = new PIXI.Container();
    var shadow_box = new PIXI.Container();
    var briefcase_contents = new PIXI.Container();
    var background = Game.background.init();

    stage.addChild(background);

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
        debris.on('mousedown', Debris.prototype.onDown);

        Game.briefcase.sprites[key].interactive = true;
        Game.briefcase.sprites[key].on('mousedown', Game.briefcase.onDown);

        position = randomPosition();

        debris.position.set(position[0], position[1]);
        debris.anchor.x = 0.5;
        debris.anchor.y = 0.5;
        debris.visible = false;

        Game.debris[key].position = new PIXI.Point(debris.position.x, debris.position.y);

        foreground.addChild(debris);
        briefcase_contents.addChild(Game.briefcase.sprites[key]);
    });

    GUI.addChild(briefcase_contents);
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
    parent.addChild(GUI);

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

        Game.light.update(dt);
        Game.museum.update(dt);
        Game.briefcase.update(dt);

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

