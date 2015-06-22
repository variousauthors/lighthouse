
var Game = { };
Game.selected = null;
Game.entities = {};
Game.light = {
    rate: 14,
    timer: 0,
    init: function () {
        var graphics = new PIXI.Graphics();
        graphics.position.x = WIDTH/2 + WIDTH/8;
        graphics.position.y = HEIGHT/2 + HEIGHT/4 + HEIGHT; // adding HEIGHT again to offset for the intro

        Game.entities.light = graphics;

        return graphics
    },
    update: function (dt) {
        Game.light.timer += (dt / Game.light.rate) % 1;
        var theta = Game.light.timer*(2*Math.PI) + Math.PI;
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
        var lighthouse = new PIXI.Sprite.fromImage('sources/images/ocean.png');
        // set a fill and a line style again and draw a rectangle

        Game.entities.background = lighthouse;

        return lighthouse;
    }
}
Game.lighthouse = {
    init: function () {
        var lighthouse = new PIXI.Sprite.fromImage('sources/images/lighthouse.png');

        lighthouse.x = 270;
        lighthouse.y = 235 + HEIGHT ;
        lighthouse.alpha = 0.3;

        return lighthouse;
    }
}

Game.title = {
    init: function () {
        var title = new PIXI.Sprite.fromImage('sources/images/title.png');

        return title;
    }
}

Game.debris = {
    hat: {
        init: function () {
            var sprite = PIXI.Sprite.fromImage('sources/images/hat_small.png');
            sprite.name = "hat";

            Game.entities.hat = sprite;

            return sprite;
        },
        text: "HAT TEXT",
        audio: new Howl({
            urls: [ 'sources/audio/mp3/hat.mp3', 'sources/audio/ogg/hat.ogg' ]
        })
    },
    apple: {
        init: function () {
            var sprite = PIXI.Sprite.fromImage('sources/images/apple_small.png');
            sprite.name = "apple";

            Game.entities.apple = sprite;

            return sprite;
        },
        text: "APPLE TEXT",
        audio: new Howl({
            urls: [ 'sources/audio/mp3/apple.mp3', 'sources/audio/ogg/apple.ogg' ]
        })
    },
    whale: {
        init: function () {
            var sprite = PIXI.Sprite.fromImage('sources/images/whale_small.png');
            sprite.name = "whale";

            Game.entities.whale = sprite;

            return sprite;
        },
        text: "WHALE TEXT",
        audio: new Howl({
            urls: [ 'sources/audio/mp3/whale.mp3', 'sources/audio/ogg/whale.ogg' ]
        })
    },
    goldfish: {
        init: function () {
            var sprite = PIXI.Sprite.fromImage('sources/images/goldfish_small.png');
            sprite.name = "goldfish";

            Game.entities.goldfish = sprite;

            return sprite;
        },
        text: "goldfish TEXT",
        audio: new Howl({
            urls: [ 'sources/audio/mp3/goldfish.mp3', 'sources/audio/ogg/goldfish.ogg' ]
        })
    },
    goldfish: {
        init: function () {
            var sprite = PIXI.Sprite.fromImage('sources/images/goldfish_small.png');
            sprite.name = "goldfish";

            Game.entities.goldfish = sprite;

            return sprite;
        },
        text: "goldfish TEXT",
        audio: new Howl({
            urls: [ 'sources/audio/mp3/goldfish.mp3', 'sources/audio/ogg/goldfish.ogg' ]
        })
    }
};

Game.museum = {
    select: function (name) {
        if (Game.debris[name] === undefined) { return false; }

        Game.selected = Game.debris[name];
        Game.entities.information.text = Game.selected.text;

        if (Game.selected.audio !== undefined) {
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

        if (Game.selected === null) {
            if (Game.entities.dialogueBox.position.y <= (HEIGHT + 1)) {
                // tween the menu into place
                Game.entities.dialogueBox.position.y += speed*dt
            }

        } else if (Game.entities.dialogueBox.position.y > (HEIGHT - Game.entities.dialogueBox.height - 10)) {

            // tween the menu into place
            Game.entities.dialogueBox.position.y -= speed*dt
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
    playing: true,
    timer: -5,
    start: false,
    update: function (dt) {
        if (Game.intro.timer < 0) {
            // wait

        } else {
            if (Game.intro.start === false) {
                Game.intro.start = true;

                // reset the light timer so that it makes a second pass right away
                Game.light.timer = 0;
            }

            if (Game.stage.position.y > -600) {
                Game.stage.position.set(Game.stage.position.x, Game.stage.position.y - 100*dt);
                Game.shadow_box.position.set(Game.shadow_box.position.x, Game.shadow_box.position.y - 100*dt);
            }
        }

        Game.intro.timer += dt;
    }
}
