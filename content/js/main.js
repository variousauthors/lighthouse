var arrow_keys = ["Left", "Right"];
var current = 1, previous = 1;
var positions, start_positions, end_positions;
var $content;
var frame_rate = 1/30;
var animate = false, accumulate;
var EPSILON = 0.01;

var initialize = function () {
    var positions = [0, 0, 0]
    // ensure the content-space keeps its height
    // TODO do this right
    $content_space.style.height = "" + (window.innerHeight - (20 + $title.clientHeight + $footer.clientHeight)) + "px";

    // initialize the screens with their positions
    positions.forEach(function (el, index) {
        var offset = index - current;

        positions[index] = offset * window.innerWidth;
    });

    return positions;
};

var lerp = function (t, b, c, d) {
    return c * t/d + b;
};

Math.easeInOutCubic = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t + b;
    t -= 2;
    return c/2*(t*t*t + 2) + b;
};

var update = function () {
    var done = false;
    accumulate = accumulate + frame_rate;

    if (animate === true) {
        done = true;
        positions.forEach(function (el, i) {
            var delta;

            positions[i] = Math.easeInOutCubic(accumulate, start_positions[i], end_positions[i] - start_positions[i], 1);
            delta = positions[i] - end_positions[i];

            if (delta > EPSILON || delta < -EPSILON) {
                done = false;
            } else {
                positions[i] = end_positions[i];
            }

            $content[i].style.left = "" + parseInt(positions[i]) + "px";
        });

        if (done === true) {
            animate = false;
            $content[previous].classList.add("hidden");
        }
    }
};

window.addEventListener("load", function () {
    positions = [0, 0, 0];

    $content = document.querySelectorAll(".content");
    $content_space = document.querySelector(".content-space");
    $title = document.querySelector(".title");
    $footer = document.querySelector(".footer");

    $content[current].classList.remove("hidden");

    positions = initialize();
    setInterval(update, 1000*frame_rate);

    document.addEventListener("keydown", function (e) {
        if (arrow_keys.indexOf(e.key) === -1) { return true; }
        if (e.key === "Left" && current == 0) { return true; }
        if (e.key === "Right" && current == (positions.length - 1)) { return true; }

        previous = current;
        animate = false;
        accumulate = 0;

        // save the start positions for the animation
        start_positions = positions;

        if (e.key === "Left") {
            current = Math.max(current - 1, 0);
        } else if (e.key === "Right") {
            current = Math.min(current + 1, positions.length - 1);
        }

        // show the new current
        $content[current].classList.remove("hidden");

        // save the end positions for the animation
        end_positions = initialize();

        animate = true;
    });

    window.addEventListener("resize", function (e) {
        positions = initialize();
    });
});
