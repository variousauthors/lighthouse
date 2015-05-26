
var Game = { };
Game.selected = "hat";
Game.entities = {};
Game.light = {
    init: function () {
        var graphics = new PIXI.Graphics();
        graphics.position.x = WIDTH/2 + WIDTH/8;
        graphics.position.y = HEIGHT/2 + HEIGHT/4;

        Game.entities.light = graphics;

        return graphics
    },
    update: function () {
        var step = (2*Math.PI)/48;
        var theta = Game.timer*step;
        var arc = Math.PI/8;
        var light = Game.entities.light;

        var cx_1 = RADIUS*Math.cos(theta) - 200;
        var cy_1 = RADIUS*Math.sin(theta) - 200;
        var cx_2 = RADIUS*Math.cos(theta + arc) - 200;
        var cy_2 = RADIUS*Math.sin(theta + arc) - 200;

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
        var graphics = new PIXI.Graphics();

        // set a fill and a line style again and draw a rectangle
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.beginFill(0x1099bb, 1);
        graphics.drawRect(0, 0, WIDTH, HEIGHT);

        Game.entities.background = graphics;

        return graphics;
    }
}
Game.lighthouse = {
    init: function () {
        var lighthouse = new PIXI.Sprite.fromImage('images/lighthouse.png');

        lighthouse.x = 270;
        lighthouse.y = 235;
        lighthouse.alpha = 0.3;

        return lighthouse;
    }
}
Game.debris = {
    hat: {
        init: function () {
            var sprite = PIXI.Sprite.fromImage('images/hat.png');

            sprite.position.set(230,264);
            sprite.scale.x = 0.5;
            sprite.scale.y = 0.5;
            sprite.name = "hat";

            Game.entities.hat = sprite;

            return sprite;
        },
        text: "Hello World!"
    },
    chest: {}
};

Game.museum = {
    select: function (name) {
        if (Game.debris[name] === null) { return false; }

        Game.selected = Game.debris[name];
        Game.entities.information.text = Game.selected.text;
    },
    deselect: function () {
        Game.selected = null;
    },
    update: function (dt) {
        var debris = Game.debris[Game.selected];
        var speed = 100;

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
