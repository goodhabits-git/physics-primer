const canvas = document.getElementById("displacementCanvas");
const ctx = canvas.getContext("2d");

//states
let x1 = 225;
let x2 = 525;

let draggingPoint = null;

// ----------------------------

function getMouseX(canvas, event)
{
    const rect = canvas.getBoundingClientRect();
    return event.clientX - rect.left;
}


//listen for click
canvas.addEventListener("mousedown", (e) =>
{
    const mouseX = getMouseX(canvas, e);

    const radius = 10;

    if (Math.abs(mouseX - x1) < radius)
    {
        draggingPoint = "p1";
    }
    else if (Math.abs(mouseX - x2) < radius)
    {
        draggingPoint = "p2";
    }
});

//listen for mouse move
canvas.addEventListener("mousemove", (e) =>
{
    if (!draggingPoint) return;

    const mouseX = getMouseX(canvas, e);

    if (draggingPoint === "p1")
    {
        x1 = mouseX;
    }
    else if (draggingPoint === "p2")
    {
        x2 = mouseX;
    }

    draw();
});

//listen for unclick
window.addEventListener("mouseup", () =>
{
    draggingPoint = null;
});

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // timeline
    ctx.beginPath();
    ctx.moveTo(50, 125);
    ctx.lineTo(750, 125);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.stroke();

    // point 1
    ctx.beginPath();
    ctx.arc(x1, 125, 8, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "14px Arierl";
    ctx.textAlign = "center";

    ctx.fillText("x1",x1,150);

    // point 2
    ctx.beginPath();
    ctx.arc(x2, 125, 8, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "14px Arierl";
    ctx.textAlign = "center";

    ctx.fillText("x2",x2,150);

    ctx.beginPath();
    ctx.moveTo(x1,125);
    ctx.lineTo(x2,125);
    let vectorColor;
    if (x1 < x2) vectorColor = "red";
    else vectorColor = "blue";
    ctx.strokeStyle = vectorColor;
    ctx.strokeWidth = 4;
    ctx.stroke();
    drawArrowHead(ctx, x1, 125, x2, 125, vectorColor);
}

//draw arrow
function drawArrowHead(ctx, x1, y1, x2, y2, color = "red")
{
    const headLength = 20;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
        x2 - headLength * Math.cos(angle - Math.PI / 6),
        y2 - headLength * Math.sin(angle - Math.PI / 6)
    );

    ctx.lineTo(
        x2 - headLength * Math.cos(angle + Math.PI / 6),
        y2 - headLength * Math.sin(angle + Math.PI / 6)
    );

    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
}

//first render
draw();