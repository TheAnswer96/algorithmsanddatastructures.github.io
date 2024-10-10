// Common Elements and Variables
const inputVectorElements = {
    bruteForce: document.getElementById('input-vector'),
    dnc: document.getElementById('input-vector-dnc'),
    dp: document.getElementById('input-vector-dp')
};

const outputMaxSumElements = {
    bruteForce: document.getElementById('output-max-sum'),
    dnc: document.getElementById('output-max-sum-dnc'),
    dp: document.getElementById('output-max-sum-dp')
};

const maxStartElements = {
    bruteForce: document.getElementById('max-start'),
    dnc: document.getElementById('max-start-dnc'),
    dp: document.getElementById('max-start-dp')
};

const maxEndElements = {
    bruteForce: document.getElementById('max-end'),
    dnc: document.getElementById('max-end-dnc'),
    dp: document.getElementById('max-end-dp')
};

const startButtons = {
    bruteForce: document.getElementById('start'),
    dnc: document.getElementById('start-dnc'),
    dp: document.getElementById('start-dp')
};

const restartButtons = {
    bruteForce: document.getElementById('restart'),
    dnc: document.getElementById('restart-dnc'),
    dp: document.getElementById('restart-dp')
};

const delayInputs = {
    bruteForce: document.getElementById('delay'),
    dnc: document.getElementById('delay-dnc'),
    dp: document.getElementById('delay-dp')
};

const comparisonCountElements = {
    dnc: document.getElementById('comparison-count-dnc'),
    dp: document.getElementById('comparison-count-dp')
};

let delay = 500; // Default delay
let inputVectors = {
    bruteForce: [],
    dnc: [],
    dp: []
};

// Function to generate a random input vector of size 10
function generateRandomVector(type) {
    inputVectors[type] = Array.from({ length: 10 }, () => Math.floor(Math.random() * 21) - 10);
    visualizeVector(inputVectorElements[type], inputVectors[type]);

    // Reset outputs
    outputMaxSumElements[type].textContent = '';
    maxStartElements[type].textContent = '';
    maxEndElements[type].textContent = '';
    // if (type !== 'bruteForce') {
    //     comparisonCountElements[type].textContent = '0'; // Reset comparison count for DNC and DP
    // }
}

// Function to update delay from input
function updateDelay(type) {
    delay = Number(delayInputs[type].value);
}

// Helper function to visualize the vector in cells
function visualizeVector(container, vector, highlightStart = null, highlightEnd = null, highlightClass = 'highlight') {
    container.innerHTML = ''; // Clear the container
    vector.forEach((num, index) => {
        const cell = document.createElement('div');
        cell.classList.add('vector-cell');
        cell.textContent = num;

        // Highlight the current subarray
        if (highlightStart !== null && index >= highlightStart && index <= highlightEnd) {
            cell.classList.add(highlightClass);
        }
        container.appendChild(cell);
    });
}

// Delay function for visualization
function delayFunc(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Brute Force Algorithm
async function bruteForceMaxSubarray() {
    let maxSum = Number.NEGATIVE_INFINITY;
    let bestStart = 0;
    let bestEnd = 0;

    // Iterate over every starting point
    for (let start = 0; start < inputVectors.bruteForce.length; start++) {
        let currentSum = 0;

        // Iterate over every subarray that starts from the 'start' index
        for (let end = start; end < inputVectors.bruteForce.length; end++) {
            currentSum += inputVectors.bruteForce[end];

            // Visualize the current subarray
            visualizeVector(inputVectorElements.bruteForce, inputVectors.bruteForce, start, end);

            // Check if the current subarray's sum is better than the best so far
            if (currentSum > maxSum) {
                maxSum = currentSum;
                bestStart = start;
                bestEnd = end;

                // Update the maximum sum and indices displayed below the vector
                maxStartElements.bruteForce.textContent = bestStart;
                maxEndElements.bruteForce.textContent = bestEnd;
                outputMaxSumElements.bruteForce.textContent = maxSum;
            }
            // Wait for delay before proceeding to the next step
            await delayFunc(delay);
        }
    }
    highlightComparison(inputVectorElements.bruteForce, [0, 9], '#f0f0f0');
    await highlightComparison(inputVectorElements.bruteForce, Array.from({ length: bestEnd - bestStart + 1 }, (_, i) => bestStart + i), '#28a745'); // Highlight best subarray
}

// Event listeners for Brute Force
startButtons.bruteForce.addEventListener('click', () => {
    bruteForceMaxSubarray();
});
restartButtons.bruteForce.addEventListener('click', () => {
    generateRandomVector('bruteForce');
});

// Event listeners for DNC and DP
for (const type of ['dnc', 'dp']) {
    delayInputs[type].addEventListener('input', () => updateDelay(type));
    startButtons[type].addEventListener('click', async () => {
        if (type === 'dnc') {
            await startDivideAndConquer();
        } else {
            await startDynamicProgramming();
        }
    });
    restartButtons[type].addEventListener('click', () => {
        generateRandomVector(type);
    });
}

// Function to find max crossing subarray
function findMaxCrossingSubarray(arr, low, mid, high) {
    let leftSum = Number.NEGATIVE_INFINITY;
    let sum = 0;
    let maxLeft = mid;

    for (let i = mid; i >= low; i--) {
        sum += arr[i];
        if (sum > leftSum) {
            leftSum = sum;
            maxLeft = i;
        }
    }

    let rightSum = Number.NEGATIVE_INFINITY;
    sum = 0;
    let maxRight = mid + 1;

    for (let j = mid + 1; j <= high; j++) {
        sum += arr[j];
        if (sum > rightSum) {
            rightSum = sum;
            maxRight = j;
        }
    }

    return [maxLeft, maxRight, leftSum + rightSum];
}

// Divide and Conquer Algorithm
async function divideAndConquerMaxSubarray(arr, low, high) {
    if (low === high) {
        return [low, high, arr[low]]; // Base case
    }

    const mid = Math.floor((low + high) / 2);
    visualizeVector(inputVectorElements.dnc, inputVectors.dnc, low, high, 'highlight-split');
    await delayFunc(delay);
    
    const [leftLow, leftHigh, leftSum] = await divideAndConquerMaxSubarray(arr, low, mid);
    const [rightLow, rightHigh, rightSum] = await divideAndConquerMaxSubarray(arr, mid + 1, high);
    const [crossLow, crossHigh, crossSum] = findMaxCrossingSubarray(arr, low, mid, high);

    if (leftSum >= rightSum && leftSum >= crossSum) {
        return [leftLow, leftHigh, leftSum];
    } else if (rightSum >= leftSum && rightSum >= crossSum) {
        return [rightLow, rightHigh, rightSum];
    } else {
        return [crossLow, crossHigh, crossSum];
    }
}

// Visualization function for Divide and Conquer
async function startDivideAndConquer() {
    const [low, high, maxSum] = await divideAndConquerMaxSubarray(inputVectors.dnc, 0, inputVectors.dnc.length - 1);
    visualizeVector(inputVectorElements.dnc, inputVectors.dnc, low, high, 'highlight-best');
    maxStartElements.dnc.textContent = low;
    maxEndElements.dnc.textContent = high;
    outputMaxSumElements.dnc.textContent = maxSum;
}

// Highlight comparison function
async function highlightComparison(container, indices, color) {
    container.querySelectorAll('.vector-cell').forEach((cell, index) => {
        cell.classList.remove('highlight-comparison'); // Remove previous highlights
        if (indices.includes(index)) {
            cell.style.backgroundColor = color; // Highlight current element
        }
    });
    await delayFunc(delay); // Wait for a moment to visualize
}

// Dynamic Programming Algorithm
async function kadaneMaxSubarray(arr) {
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];
    let start = 0;
    let end = 0;
    let s = 0;

    await highlightComparison(inputVectorElements.dp, [0], '#ffbe0b'); // Highlight the initial cell

    for (let i = 1; i < arr.length; i++) {

        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        if (maxEndingHere != arr[i]){
            await highlightComparison(inputVectorElements.dp, [i], '#17a2b8'); // Highlight the cell being considered
        }
        else {
            await highlightComparison(inputVectorElements.dp, [i], '#ffbe0b'); // Highlight the cell being considered
        }


        if (maxEndingHere > maxSoFar) {
            maxSoFar = maxEndingHere;
            start = s;
            end = i;
            // await highlightComparison(inputVectorElements.dp, [s, i], '#80ed99'); // Highlight best subarray found
        }

        if (maxEndingHere < 0) {
            maxEndingHere = 0;
            s = i + 1; // Reset start position
            await highlightComparison(inputVectorElements.dp, [s], '#ffbe0b'); // Highlight best subarray found
        }
    }

    return [start, end, maxSoFar];
}

// Visualization function for Dynamic Programming
async function startDynamicProgramming() {
    const [low, high, maxSum] = await kadaneMaxSubarray(inputVectors.dp);
    await highlightComparison(inputVectorElements.dp, Array.from({ length: high - low + 1 }, (_, i) => low + i), '#28a745'); // Highlight best subarray
    maxStartElements.dp.textContent = low;
    maxEndElements.dp.textContent = high;
    outputMaxSumElements.dp.textContent = maxSum;
}

// Initial setup
generateRandomVector('bruteForce');
generateRandomVector('dnc');
generateRandomVector('dp');
