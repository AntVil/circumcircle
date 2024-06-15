const RESOLUTION = 800;

let points = [
    [0.5, 0.1666],
    [0.7886, 0.6666],
    [0.2113, 0.6666]
]

let dragPointIndex = -1;

let canvas;
let ctxt;

window.onload = () => {
    canvas = document.getElementById("canvas");
    canvas.width = RESOLUTION;
    canvas.height = RESOLUTION;
    ctxt = canvas.getContext("2d");

    canvas.addEventListener("mousedown", (e) => {
        let rect = canvas.getBoundingClientRect();
        let x = e.offsetX / rect.width;
        let y = e.offsetY / rect.height;

        let index = -1;
        let minDistance = Infinity;
        for(let i=0;i<points.length;i++) {
            let distance = Math.hypot(points[i][0] - x, points[i][1] - y);
            if(distance < minDistance) {
                minDistance = distance;
                index = i;
            }
        }
        dragPointIndex = index;
    });

    canvas.addEventListener("mouseup", (e) => {
        dragPointIndex = -1;
    });

    canvas.addEventListener("mousemove", (e) => {
        if(dragPointIndex === -1) {
            return;
        }

        let rect = canvas.getBoundingClientRect();
        points[dragPointIndex] = [
            e.offsetX / rect.width,
            e.offsetY / rect.height
        ];
    });

    loop();
}

function loop() {
    ctxt.clearRect(0, 0, canvas.width, canvas.height);

    ctxt.save();
    ctxt.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);

    ctxt.lineWidth = 0.01;

    let [cx, cy, r] = computeCircumcircle(points);

    // circumcircle
    ctxt.strokeStyle = "#AAA";
    ctxt.beginPath();
    ctxt.arc(cx, cy, r, 0, 2 * Math.PI);
    ctxt.stroke();

    // center point
    ctxt.fillStyle = "#AAA";
    ctxt.beginPath();
    ctxt.arc(cx, cy, 0.01, 0, 2 * Math.PI);
    ctxt.fill();

    ctxt.fillStyle = "#000";
    for (let [px, py] of points) {
        ctxt.beginPath();
        ctxt.arc(px, py, 0.01, 0, 2 * Math.PI);
        ctxt.fill();
    }

    ctxt.restore();

    requestAnimationFrame(loop);
}

function computeCircumcircle(points) {
    // dx * x + dy * y + c = 0
    let [fdx, fdy, fc] = computeBisector(points[0][0], points[0][1], points[1][0], points[1][1]);
    let [gdx, gdy, gc] = computeBisector(points[0][0], points[0][1], points[2][0], points[2][1]);

    // intersection of bisectors
    let x = (fdy * gc - gdy * fc) / (gdy * fdx - fdy * gdx);
    let y = (fdx * gc - gdx * fc) / (gdx * fdy - fdx * gdy);

    let r = Math.hypot(x - points[0][0], y - points[0][1]);

    return [x, y, r];
}

function computeBisector(x1, y1, x2, y2) {
    return [
        // dx
        x1 - x2,
        // dy
        y1 - y2,
        // c
        (x2 - x1) * (x1 + x2) / 2 + (y2 - y1) * (y1 + y2) / 2
    ];
}
