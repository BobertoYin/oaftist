// A Point is an Object with an x and y-coordinate
// var Point = {x: Number, y: Number}

// generatePoints: Number -> Canvas
// draws three random points on the grid
function generatePoints (size, dot, partition) {
    const increment = size / partition;
    // clears the canvas
    ctx.clearRect(0, 0, size, size);
    // re-draws the grid lines
    drawGridLines(size, partition);
    // generates three new points
    let points = [newPoint(partition),newPoint(partition),newPoint(partition)];
    // if any two points are at the same coordinate, generate a new set of points
    while (isEquivalent(points[0],points[1]) || isEquivalent(points[1],points[2]) || isEquivalent(points[0],points[2])) {
        points = [newPoint(partition),newPoint(partition),newPoint(partition)];
    }
    // draws the shape
    pointToShape(points, increment);
    // draws each point
    points.forEach(point => pointToDot(point, dot, increment));
    // calculates the area and displays it to the user
    const area = calculateArea(points).toString();
    let units;
    if (area === "1.0") {
        units = " Unit".concat("2".sup());
    } else {
        units = " Units".concat("2".sup());
    }
    document.getElementById("triangleArea").innerHTML = "Area: ".concat(area).concat(units);
}

// drawGridLines: Integer Integer -> Canvas
// partitions the canvas into a Number X Number grid
function drawGridLines (size, split) {
    const mainSize = size;
    const increment = size / split;
    // draw all of the lines
    while (size >= 0) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.moveTo(size, 0);
        ctx.lineTo(size, mainSize);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.moveTo(0, size);
        ctx.lineTo(mainSize, size);
        ctx.closePath();
        ctx.stroke();
        size = size - increment;
    }
}

// isEquivalent: Object Object -> Boolean
// determines if two objects are equivalent
function isEquivalent(a, b) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
        return false;
    }
    for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

// newPoint: Integer Integer -> Point
// returns a random point along the partition coordinates
function newPoint (partition) {
    return {
        x: getRndInteger(0, partition),
        y: getRndInteger(0, partition)
    };
}

// getRndInteger: Integer Integer -> Integer
// generates a random number between an inclusive min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// pointToShape: [Array of Point] -> Canvas
// draws a shape using given points as vertices
function pointToShape (points, increment) {
    const origin = points[0];
    const rest = points.slice(1,points.length);
    ctx.beginPath();
    ctx.strokeStyle = "#e60000";
    ctx.lineWidth = 3;
    ctx.moveTo((increment * origin.x), (increment * origin.y));
    rest.forEach(point => ctx.lineTo((increment * point.x), (increment * point.y)));
    ctx.closePath();
    ctx.stroke();
}

// pointToDot: Point Integer -> Canvas
// draws a point as a dot on the canvas
function pointToDot (point, dot, increment) {
    const newX = increment * point.x;
    const newY = increment * point.y;
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.arc(newX, newY, dot, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
}

// calculateArea: [Array of Point] -> Float
// calculates the area of a triangle based on its points
function calculateArea (points) {
    const AB = pointDist(points[0],points[1]);
    const BC = pointDist(points[1],points[2]);
    const AC = pointDist(points[0],points[2]);
    const l = ((AC ** 2) - (BC ** 2) - (AB ** 2)) / (-2 * BC);
    const h = Math.sqrt(Math.abs(((AB ** 2) - (l ** 2))));
    const area = 0.5 * h * BC;
    // round to two decimal places
    return area.toFixed(1);
}

// pointDist: Point Point -> Float
// takes two points and calculates the distance between them
function pointDist (a,b) {
    const x1 = a.x;
    const y1 = a.y;
    const x2 = b.x;
    const y2 = b.y;
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
}

// recognize the necessary I/O elements
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const triangleButton = document.getElementById("triangleButton");
const slider = document.getElementById("gridSlider");

// declare canvas and partition size
const canvasSize = canvas.width;
var partitionSize = slider.value;
const dotSize = 4;

// draw grid lines and display grid size
drawGridLines(canvasSize, partitionSize);
document.getElementById("gridSize").innerHTML = "Grid size: ".concat(partitionSize.toString());

// generate points on button press
triangleButton.onclick = function () {generatePoints(canvasSize, dotSize, partitionSize)};

// change grid partitions when slider is moved
slider.oninput = function () {
    partitionSize = this.value;
    // clears the canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // redraws the grid lines
    drawGridLines(canvasSize, partitionSize);
    // update grid size
    document.getElementById("gridSize").innerHTML = "Grid size: ".concat(partitionSize.toString());
    // clears the area of the triangle display
    document.getElementById("triangleArea").innerHTML = "Area: N/A";
};