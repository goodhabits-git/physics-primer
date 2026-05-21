const canvas = document.getElementById("accelerationCanvas");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;


//states
let velocity = 0;
let acceleration = 0;

let backgroundOffset = 0;

let draggingAcceleration = false;


//get time
let lastTime = performance.now();


//get mouse position
function getMouseX(event)
{
    const rect = canvas.getBoundingClientRect();
    return event.clientX - rect.left;
}


//listen for mouse click
canvas.addEventListener("mousedown", (e) =>
{
    const mouseX = getMouseX(e);

    const accelTipX = centerX + acceleration * 2;

    const dist = Math.abs(mouseX - accelTipX);

    if (dist < 20)
    {
        draggingAcceleration = true;
    }
});

//listen for mouse move
canvas.addEventListener("mousemove", (e) =>
{
    if (!draggingAcceleration)
    {
        return;
    }

    const mouseX = getMouseX(e);

    // only horizontal acceleration
    acceleration = (mouseX - centerX) * 0.25;
});

//unclicking means we're no longer moving the acc. arrow
canvas.addEventListener("mouseup", () =>
{
    draggingAcceleration = false;
});


//drawing arrows
function drawArrow(startX, startY, length, color)
{
    const endX = startX + length;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;

    // main line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, startY);
    ctx.stroke();

    // arrow head
    const direction = Math.sign(length);

    const headSize = 12;

    ctx.beginPath();

    ctx.moveTo(endX, startY);

    ctx.lineTo(
        endX - direction * headSize,
        startY - headSize / 2
    );

    ctx.lineTo(
        endX - direction * headSize,
        startY + headSize / 2
    );

    ctx.closePath();
    ctx.fill();
}

//draw grid
function drawGrid()
{
    const spacing = 50;

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    const offset = backgroundOffset % spacing;

    for (let x = -spacing; x < canvas.width + spacing; x += spacing)
    {
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, canvas.height);
        ctx.stroke();
    }
}


//draw road
function drawRoad()
{
    ctx.fillStyle = "#222";

    ctx.fillRect(0, centerY - 40, canvas.width, 80);

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;

    const dashSpacing = 80;
    const dashWidth = 40;

    const offset = backgroundOffset % dashSpacing;

    for (let x = -dashSpacing; x < canvas.width + dashSpacing; x += dashSpacing)
    {
        ctx.beginPath();
        ctx.moveTo(x + offset, centerY);
        ctx.lineTo(x + offset + dashWidth, centerY);
        ctx.stroke();
    }
}

//draw car
function drawCar()
{
    ctx.fillStyle = "white";

    ctx.fillRect(centerX - 40, centerY - 20, 80, 40);

    // windshield/front marker
    ctx.fillStyle = "black";

    if (velocity >= 0)
    {
        ctx.fillRect(centerX + 15, centerY - 10, 15, 20);
    }
    else
    {
        ctx.fillRect(centerX - 30, centerY - 10, 15, 20);
    }
}

//every frame
function update(dt)
{
    //change vel
    velocity += acceleration * dt;

    //move background
    backgroundOffset -= velocity * dt * .5;
}


//draw the frame, call our draw functions
function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    drawRoad();

    drawCar();

    // velocity vector
    drawArrow(
        centerX,
        centerY - 70,
        velocity * 0.8,
        "lime"
    );

    // acceleration vector
    drawArrow(
        centerX,
        centerY + 70,
        acceleration * 4,
        "red"
    );

    // labels
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";

    ctx.fillText(
        `Velocity: ${velocity.toFixed(1)} m/s`,
        20,
        30
    );

    ctx.fillText(
        `Acceleration: ${acceleration.toFixed(1)} m/s²`,
        20,
        60
    );

    // velocity label
    ctx.fillStyle = "lime";
    ctx.font = "18px Arial";

    ctx.fillText(
        "Velocity",
        centerX - 40,
        centerY - 95
    );

    // acceleration label
    ctx.fillStyle = "red";

    ctx.fillText(
        "Acceleration",
        centerX - 55,
        centerY + 95
    );

    //Instruction text
    ctx.fillStyle = "black";

    ctx.fillText(
        "Click and drag to apply acceleration!",
        centerX - 140,
        canvas.height - 5
    );
}


//loop through update and draw every frame
function loop(timestamp)
{
    const dt = (timestamp - lastTime) / 1000;

    lastTime = timestamp;

    update(dt);

    draw();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);