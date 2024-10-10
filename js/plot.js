const canvas = document.getElementById('plotCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const margin = 60;

// Function to draw the axes with labels and ticks
function drawAxes() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    // Draw Y-axis
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);

    // Draw X-axis
    ctx.lineTo(width - margin, height - margin);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add labels to axes
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText('Input Size', width / 2, height - 10); // X-axis label
    ctx.textAlign = 'right';
    ctx.fillText('Time', margin - 30, height / 2); // Y-axis label


    // Draw ticks and labels for X-axis (scale from 10 to 100)
    for (let i = 10; i <= 100; i += 10) {
        const xPos = margin + ((width - margin * 2) / 100) * i;
        ctx.moveTo(xPos, height - margin);
        ctx.lineTo(xPos, height - margin + 5);
        ctx.fillText(i, xPos, height - margin + 20); // X-axis labels
    }

    // Draw ticks and labels for Y-axis (scale from 10 to 100)
    for (let i = 10; i <= 100; i += 10) {
        const yPos = height - margin - ((height - margin * 2) / 100) * i;
        ctx.moveTo(margin, yPos);
        ctx.lineTo(margin - 5, yPos);
        ctx.fillText(i, margin - 15, yPos + 5); // Y-axis labels
    }

    ctx.stroke();
}

// Function to draw the linear function y = x
function drawLinearFunction() {
    ctx.beginPath();
    ctx.moveTo(margin, height - margin); // Starting point (0, 0)

    // Draw the line y = x (from 10 to 100)
    for (let x = 10; x <= 100; x += 1) {
        const y = x; // y = x, since we want to draw a linear function
        const canvasX = margin + ((width - margin * 2) / 100) * x;
        const canvasY = height - margin - ((height - margin * 2) / 100) * y;
        ctx.lineTo(canvasX, canvasY);
    }

    ctx.strokeStyle = '#007bff'; // Blue color for the linear line
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to plot random points above and below the linear function
async function plotRandomPoints() {
    for (let i = 0; i < 20; i++) {
        const x = getRandomInt(10, 100); // Random x within the 10-100 range
        const y = getRandomInt(10, 100); // y value is above or below y = x

        const canvasX = margin + ((width - margin * 2) / 100) * x;
        const canvasY = height - margin - ((height - margin * 2) / 100) * y;

        // Draw a point (circle) at the random position
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff0000'; // Red for points
        ctx.fill();

        // Wait for a short delay before plotting the next point
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Helper function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Button click event to draw the plot and points
document.getElementById('plotButton').addEventListener('click', () => {
    drawAxes(); // Draw axes first
    drawLinearFunction(); // Plot the linear function y = x
    plotRandomPoints(); // Plot random points with delay
});
