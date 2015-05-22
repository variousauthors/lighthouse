
var Game = { };
Game.graphics = {};
Game.light = {
    init: function (graphics) {
        var graphics = new PIXI.Graphics();
        graphics.position.x = WIDTH/2 + WIDTH/4;
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
    init: function (graphics) {
        var graphics = new PIXI.Graphics();
        // set a fill and a line style again and draw a rectangle
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.beginFill(0x1099bb, 1);
        graphics.drawRect(0, 0, WIDTH, HEIGHT);

        Game.graphics.background = graphics;

        return graphics;
    }
}
Game.debris = {
    hat: {
        init: function (graphics) {
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
