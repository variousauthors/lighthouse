
var Game = { };
Game.splash = new Howl({
    volume: 0.7,
    urls: [ 'sources/audio/mp3/splash.mp3', 'sources/audio/ogg/splash.ogg' ]
});
Game.selected = null;
Game.entities = {};
Game.sprites = {};
Game.light = {
    rate: 14,
    timer: 0,
    init: function () {
        var graphics = new PIXI.Graphics();
        graphics.position.x = 780;
        graphics.position.y = 863; // adding HEIGHT again to offset for the intro

        Game.entities.light = graphics;

        return graphics
    },
    update: function (dt) {
        Game.light.timer += (dt / Game.light.rate) % 1;
        var theta = Game.light.timer*(2*Math.PI) + (7/8)*Math.PI;
        var arc = Math.PI/6;
        var light = Game.entities.light;

        var cx_1 = RADIUS*Math.cos(theta);
        var cy_1 = RADIUS*Math.sin(theta);
        var cx_2 = RADIUS*Math.cos(theta + arc);
        var cy_2 = RADIUS*Math.sin(theta + arc);

        light.clear();

        light.beginFill(0xFFFFFF, 0.4);
        light.moveTo(0, 0);
        light.lineTo(cx_1, cy_1);
        light.lineTo(cx_2, cy_2);
        light.lineTo(0, 0);
        light.endFill();
        light.hitArea = light.getBounds();
    }
}
Game.background = {
    init: function () {
        var ocean = new PIXI.Sprite.fromImage('sources/images/ocean.png');
        // set a fill and a line style again and draw a rectangle

        Game.entities.background = ocean;
        ocean.interactive = true;
        ocean.buttonMode = true;
        ocean.defaultCursor = "url(/sources/images/fishhook_tiny.png) 4 30, none";

        return ocean;
    }
}
Game.lighthouse = {
    init: function () {
        var lighthouse = new PIXI.Sprite.fromImage('sources/images/briefcase_top.png');

        // magic numbers to line up with the briefcase_bottom
        lighthouse.x = 474;
        lighthouse.y = 743;
        lighthouse.alpha = 0.6;

        Game.entities.lighthouse = lighthouse;

        return lighthouse;
    }
}

Game.title = {
    init: function () {
        var title = new PIXI.Sprite.fromImage('sources/images/conch_small.png');

        title.x = 150;
        Game.entities.title = title;

        return title;
    }
}

function Debris (name, ear_x, ear_y) {
    this.name = name;
    this.text = this.name + "TEXT";
    this.audio = null;
    this.ear_x = ear_x;
    this.ear_y = ear_y;
}

Debris.prototype = {
    onMove: function onMove (e) {
        var target = e.target;
        var name = target.name;
        var point, debris;

        if (name === undefined) { return false; }

        if (Game.sprites[name].held === true) {
            debris = Game.sprites[name];
            point = e.data.getLocalPosition(Game.stage.parent); // relative to the stage container
            debris.position.set(point.x, point.y);
        }
    },
    onUp: function onUp (e) {
        var target = e.target;
        var name = target.name;
        var point, debris;

        if (name === undefined) { return false; }

        point = e.data.getLocalPosition(Game.stage.parent); // relative to the stage container

        if (Game.sprites[name].held === true) {
            debris = Game.sprites[name];

            if (Game.entities.briefcase.containsPoint(point)) {
                Game.briefcase.collect(name);
            } else {
                Game.splash.play();

                if (Game.selected) {
                    Game.selected.audio.fadeOut(0.0, 3000, function () {
                        this.volume(1);
                        this.stop();
                    }.bind(Game.selected.audio));
                }
            }

            Game.stage.parent.removeChild(debris);
            Game.stage.addChild(debris);
            debris.held = false;
            debris.visible = false;
        }

    },
    onDown: function onDown (e) {
        var target = e.target;
        var name = target.name;
        var point;

        if (name === undefined) { return false; }

        point = e.data.getLocalPosition(Game.stage.parent); // relative to the stage container

        if (Game.entities.light.containsPoint(point)) {
            // toggle position between briefcase and the sea
            if (Game.sprites[name].visible === true) {
                Game.briefcase.collect(name);
            }
        }

        // TODO clicking on an ear in the briefcase will cause selection
        // Game.museum.select(target.name);
    },
    onEarDown: function onEarDown (e) {
        e.stopPropagation();
        Game.briefcase.select(this.parent.name);
    },
    init: function () {
        var ear = new PIXI.Sprite.fromImage('sources/images/ear_tiny.png');
        ear.interactive = true;
        ear.buttonMode = true;
        ear.x = this.ear_x;
        ear.y = this.ear_y;
        ear.defaultCursor = "url(/sources/images/conch_tiny.png) 30 20, none";
        ear.on('mousedown', Debris.prototype.onEarDown);

        Game.sprites[this.name] = PIXI.Sprite.fromImage('sources/images/' + this.name + '_small.png');
        Game.briefcase.sprites[this.name] = PIXI.Sprite.fromImage('sources/images/' + this.name + '_tiny.png');

        Game.sprites[this.name].name = this.name;
        Game.sprites[this.name].held = false;
        Game.sprites[this.name].visible = true;
        Game.sprites[this.name].interactive = true;
        Game.sprites[this.name].buttonMode = true;
        Game.sprites[this.name].defaultCursor = "url(/sources/images/fishhook_tiny.png) 4 30, none";

        Game.briefcase.sprites[this.name].addChild(ear);
        Game.briefcase.sprites[this.name].name = this.name;
        Game.briefcase.sprites[this.name].visible = false;
        Game.briefcase.sprites[this.name].interactive = true;
        // TODO for now button mode is false, see https://github.com/GoodBoyDigital/pixi.js/issues/1920
        // we are not able to have nested cursor styles
        Game.briefcase.sprites[this.name].buttonMode = false;
        Game.briefcase.sprites[this.name].defaultCursor = "grab";

        this.audio = new Howl({
            volume: 0.7,
            urls: [ 'sources/audio/mp3/' + this.name + '.mp3', 'sources/audio/ogg/' + this.name + '.ogg' ]
        });

        return Game.sprites[this.name];
    }
}

Game.debris = {
    hat: new Debris("hat", 50, 20),
    apple: new Debris("apple", 67, 20),
    whale: new Debris("whale", 58, 10),
    goldfish: new Debris("goldfish", 30, 10),
    book: new Debris("book", 22, 29),
    chest_of_drawers: new Debris("chest_of_drawers", 70, 13),

};

Game.museum = {
    update: function (dt) {
        var debris = Game.debris[Game.selected];
        var keys = Object.keys(Game.sprites);

        for (i = 0; i < keys.length; i++) {
            var object = Game.sprites[keys[i]];
            var debris = Game.debris[object.name];
            var position, rnd;

            // the object's cursor should always be the same as the background's
            object.defaultCursor = Game.entities.background.defaultCursor;

            if (debris !== undefined && Game.briefcase.sprites[object.name].visible === false && object.held === false) {
                rnd = ((Math.random() * 10)|0) % (Game.foreground.children.length/2);

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
        }
    },
    init: function () {
        var container = new PIXI.Container();
        var content_container = new PIXI.Container();
        var image_container = new PIXI.Container();

        var box = new PIXI.Graphics();
        var image_frame = new PIXI.Graphics();
        var text;

        var width = WIDTH;
        var height = HEIGHT/3;
        var x = 0;
        var y = HEIGHT + 1;

        var image_height = height - 40;
        var image_width = width/5;

        container.x = x;
        container.y = y;
        container.width = width;
        container.height = height;

        // the visual box outline and background
        container.addChild(box);
        box.lineStyle(3, 0xFFFFFF, 1);
        box.beginFill(0x292929, 0.5);
        box.drawRoundedRect(10, 0, width - 20, height);
        box.endFill();

        // where the museum content goes
        container.addChild(content_container);

        content_container.x = 10;
        content_container.y = 20;

        // where the image lives
        content_container.addChild(image_container);
        image_container.addChild(image_frame);
        image_frame.lineStyle(3, 0xFFFFFF, 1);
        image_frame.drawRect(20, 0, image_width, image_height);

        // text
        var style = {
            font : '14px Arial',
            fill : '#FFFFFF',
            dropShadow : true,
            dropShadowColor : '#000000',
            dropShadowAngle : Math.PI / 6,
            dropShadowDistance : 3,
            wordWrap : true,
            wordWrapWidth : box.width - image_width - 50
        };

        dummy = "Normcore tilde squid, Shoreditch polaroid meggings cred Vice street art four dollar toast slow-carb gentrify VHS. Roof party mumblecore synth Shoreditch, tilde squid pork belly swag. Farm-to-table blog Blue Bottle cronut. Deep v Williamsburg McSweeney's Bushwick listicle. Direct trade Portland VHS heirloom fixie, scenester post-ironic you probably haven't heard of them. Etsy keytar art party Williamsburg, wayfarers pickled jean shorts kitsch artisan. Sustainable migas occupy tousled.";
        text = new PIXI.Text(dummy, style);
        text.x = image_width + 40;
        text.y = 0;

        content_container.addChild(text);

        Game.entities.information = text;
        Game.entities.dialogueBox = container;

        return container;
    }
}

Game.intro = {
    waves: new Howl({
        urls: [ 'sources/audio/mp3/waves.mp3', 'sources/audio/ogg/waves.ogg' ],
        loop: true
    }),
    playing: true,
    timer: -7,
    start: false,
    update: function (dt) {
        var briefcase;

        if (Game.intro.timer < 0) {
            // wait

        } else {
            if (Game.intro.waves._activeNode() === null) {
                Game.intro.waves.fadeIn(0.1, 3000);
            }

            if (Game.intro.start === false) {
                Game.intro.start = true;

                // reset the light timer so that it makes a second pass right away
                Game.light.timer = 0;

                Game.entities.title.visible = false;
            }

            if (Game.stage.position.y > -600) {
                Game.stage.position.set(Game.stage.position.x, Game.stage.position.y - 100*dt);
                Game.shadow_box.position.set(Game.shadow_box.position.x, Game.shadow_box.position.y - 100*dt);
            }

            briefcase = Game.entities.briefcase;
            if (briefcase.position.y > (HEIGHT - 200)) {
                briefcase.position.set(briefcase.position.x, briefcase.position.y - 100*dt);
            }
            if (briefcase.position.x < -60) {
                briefcase.position.set(briefcase.position.x + 100*dt, briefcase.position.y);
            }
        }

        Game.intro.timer += dt;
    }
}

Game.briefcase = {
    weight: 0,
    capacity: 3,
    sprites: {},
    init: function () {
        var briefcase = new PIXI.Sprite.fromImage('sources/images/briefcase_bottom.png');
        // set a fill and a line style again and draw a rectangle
        briefcase.y = 2*HEIGHT - 200;
        briefcase.x = WIDTH - 550;

        Game.entities.briefcase = briefcase;

        return briefcase;
    },
    // put something into the briefcase
    collect: function (name) {
        if (Game.debris[name] === undefined) { return false; }

        if (Game.briefcase.weight < Game.briefcase.capacity) {
            Game.sprites[name].visible = false;
            Game.briefcase.sprites[name].visible = true;
            Game.briefcase.weight += 1;
        } else {
            // too full!
        }

        if (Game.briefcase.weight === Game.briefcase.capacity) {
            Game.entities.background.defaultCursor = "url(/sources/images/conch_tiny.png) 30 20, none";
        }
    },
    // toss something into the sea
    reject: function (name) {
        if (Game.debris[name] === undefined) { return false; }

        if (Game.briefcase.weight > 0) {
            Game.briefcase.sprites[name].visible = false;
            Game.briefcase.weight -= 1;
            Game.entities.background.defaultCursor = "url(/sources/images/fishhook_tiny.png) 4 30, none";
        }
    },
    select: function (name) {
        if (Game.debris[name] === undefined) { return false; }

        Game.selected = Game.debris[name];
        Game.entities.information.text = Game.selected.text;

        if (Game.selected.audio !== undefined && Game.selected.audio._activeNode() === null) {
            Game.selected.audio.play();
        }
    },
    deselect: function () {
        if (Game.selected.audio !== undefined) {
            Game.selected.audio.fadeOut(0.0, 3000, function () {
                this.volume(1);
                this.stop();
            }.bind(Game.selected.audio));
        }

        Game.selected = null;
    },
    update: function (dt) {
        var debris = Game.debris[Game.selected];
        var speed = 1000;
        var keys, i;

        /*
        if (Game.selected === null) {
            if (Game.entities.dialogueBox.position.y <= (HEIGHT + 1)) {
                // tween the menu into place
                Game.entities.dialogueBox.position.y += speed*dt
            }

        } else if (Game.entities.dialogueBox.position.y > (HEIGHT - Game.entities.dialogueBox.height - 10)) {

            // tween the menu into place
            Game.entities.dialogueBox.position.y -= speed*dt
        }*/

        var keys = Object.keys(Game.briefcase.sprites);
        var offset_x = 0;

        for (i = 0; i < keys.length; i++) {
            var object = Game.briefcase.sprites[keys[i]];
            var debris = Game.debris[object.name];
            var position, rnd;

            if (debris !== undefined && Game.sprites[object.name].visible === false) {
                if (object.visible) {
                    // add the object to the briefcase display
                    object.position.set(Game.entities.briefcase.x + 130 + offset_x, HEIGHT - (object.height + 60));
                    offset_x += object.width + 10;

                }
            }
        }
    },
    onDown: function onDownBriefcase (e) {
        var target = e.target;
        var name = target.name;
        var point, debris;

        if (name === undefined) { return false; }

        point = e.data.getLocalPosition(Game.stage.parent); // relative to the stage container

        if (Game.briefcase.sprites[name].visible === true) { // if the object is in the briefcase
            Game.briefcase.reject(name);

            debris = Game.sprites[name];

            Game.stage.removeChild(debris);
            Game.stage.parent.addChild(debris);

            debris.position.set(point.x, point.y);
            debris.visible = true;
            debris.held = true;

        }

        // TODO clicking on an ear in the briefcase will cause selection
        // Game.museum.select(target.name);

    }


}
