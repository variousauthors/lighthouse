
var Game = { };
Game.graphics = {};
Game.light = {
    init: function () {
        var graphics = new PIXI.Graphics();
        graphics.position.x = WIDTH/2 + WIDTH/8;
        graphics.position.y = HEIGHT/2 + HEIGHT/4;

        Game.graphics.light = graphics;

        return graphics
    },
    update: function () {
        var step = (2*Math.PI)/48;
        var theta = Game.timer*step;
        var arc = Math.PI/8;
        var light = Game.graphics.light;

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

        Game.graphics.background = graphics;

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

            Game.graphics.hat = sprite;

            return sprite;
        }
    },
    chest: {}
};

Game.museum = {
    init: function () {
        var container = new PIXI.Container();
        var content_container = new PIXI.Container();
        var image_container = new PIXI.Container();

        var box = new PIXI.Graphics();
        var text;

        var width = WIDTH/4;
        var height = HEIGHT;
        var x = WIDTH - width;
        var y = 0;

        container.x = x;
        container.y = y + 10;
        container.width = width - 10;
        container.height = height - 20;

        // the visual box outline and background
        container.addChild(box);
        box.lineStyle(3, 0xFFFFFF, 1);
        box.beginFill(0x292929, 0.5);
        box.drawRoundedRect(0, 0, width - 10, height - 20);

        // where the museum content goes
        container.addChild(content_container);

        // where the image lives
        content_container.addChild(image_container);

        content_container.x = 10;
        content_container.y = 10;

        // text
        var style = {
            font : '14px Arial',
            fill : '#FFFFFF',
            dropShadow : true,
            dropShadowColor : '#000000',
            dropShadowAngle : Math.PI / 6,
            dropShadowDistance : 3,
            wordWrap : true,
            wordWrapWidth : box.width - 20
        };

        dummy = "Normcore tilde squid, Shoreditch polaroid meggings cred Vice street art four dollar toast slow-carb gentrify VHS. Roof party mumblecore synth Shoreditch, tilde squid pork belly swag. Farm-to-table blog Blue Bottle cronut. Deep v Williamsburg McSweeney's Bushwick listicle. Direct trade Portland VHS heirloom fixie, scenester post-ironic you probably haven't heard of them. Etsy keytar art party Williamsburg, wayfarers pickled jean shorts kitsch artisan. Sustainable migas occupy tousled.";
        text = new PIXI.Text(dummy, style);
        text.y = box.height / 3;

        content_container.addChild(text);

        return container;
    }
}
