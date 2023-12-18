
const container = document.querySelector(".container")
let verticalScrollPosition = window.scrollY;
let horizontalScrollPosition = window.scrollX;
let prevScrollX;
let prevScrollY;
const shapeSize = 100;
let currMouseX;
let currMouseY;
let prevMouseX;
let prevMouseY;

const nonSquares = document.getElementById('non-squares');
const squares = document.getElementById('squares');
const borders = document.getElementById('borders');
const noBorders = document.getElementById('no-borders');

let sqaures = false;

nonSquares.addEventListener('click', () => {
makeShapes();
sqaures = false;
    
})

squares.addEventListener('click', () => {
    makeShapes_old();
        sqaures = true;
    })

borders.addEventListener('click', () => {
    const gridItems = document.querySelectorAll('.container .item');
    let cols = getComputedStyle(container).gridTemplateColumns.split(' ').length;
    // const color = 'royalblue'
    gridItems.forEach((item, index) => {
        // Apply right and bottom border to all items
        item.style.borderRight = '1px solid ' + getRandomColor();
        item.style.borderBottom = '1px solid ' + getRandomColor();

        // Apply top border to the first row items
        if (index < cols) {
            item.style.borderTop = '1px solid ' + getRandomColor();
        }

        // Apply left border to the first item of each row
        if (index % cols === 0) {
            item.style.borderLeft = '1px solid ' + getRandomColor();
        }
    });
});



noBorders.addEventListener('click', () => {
    const shapes = document.querySelectorAll('.item');
    shapes.forEach((shape)=>shape.style.borderStyle = 'none');
})
    
makeShapes();

document.addEventListener('scroll', (e)=> {
// Get the current vertical scroll position
 verticalScrollPosition = window.scrollY;
console.log("Vertical Scroll Position: " + verticalScrollPosition);

// Get the current horizontal scroll position
horizontalScrollPosition = window.scrollX;
console.log("Horizontal Scroll Position: " + horizontalScrollPosition);


if(prevScrollX != horizontalScrollPosition || prevScrollY != verticalScrollPosition) {
    let allShapes = document.querySelectorAll('.shape')
    if (sqaures) {
        animateShapes_old(allShapes)
    } else {
        //  animateShapes(allShapes)
        animatePolygons(allShapes)
        
    }
    prevScrollX = horizontalScrollPosition
    prevScrollY = verticalScrollPosition
    // container.style.borderRadius = verticalScrollPosition + 'px ' + horizontalScrollPosition + 'px ' + verticalScrollPosition + 'px ' + horizontalScrollPosition + 'px'
}

})

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// initate container with multiple shapes
function makeShapes_old() {
    container.innerHTML = '';
    let width = container.offsetWidth
    let height = container.offsetHeight
    let cols = width/shapeSize;
    
    container.style.gridTemplateColumns = `repeat(${Math.ceil(cols)*2}, ${1}fr)`
    console.log("container", container.style)
    for (let i = shapeSize; i < width*height; i+=shapeSize) {
        let item = document.createElement('div')
        item.style.height = shapeSize+'px'
        item.style.width = shapeSize+'px'
        let shape = document.createElement('div')
        shape.classList.add('shape')
        shape.style.backgroundColor = getRandomColor()
        shape.style.borderRadius = verticalScrollPosition + 'px ' + horizontalScrollPosition + 'px ' + verticalScrollPosition + 'px ' + horizontalScrollPosition + 'px'
        shape.style.height = shapeSize+'px'
        shape.style.width = shapeSize+'px'
        item.classList.add('item')
        item.append(shape)
        container.appendChild(item)
    }
}

function morphPolygon(shape) {
    let numberOfSides = parseInt(shape.getAttribute('data-sides'));
    let newPolygon = '';

    for (let j = 0; j < numberOfSides; j++) {
        // Randomly adjust each point within a range
        let angle = 2 * Math.PI / numberOfSides * j;
        let randomFactorX = (Math.random() - 0.5) * 5; // Adjust the range as needed
        let randomFactorY = (Math.random() - 0.5) * 5; // Adjust the range as needed
        let x = 50 + (50 + randomFactorX) * Math.cos(angle);
        let y = 50 + (50 + randomFactorY) * Math.sin(angle);
        newPolygon += `${x}% ${y}%, `;
    }
    newPolygon = newPolygon.slice(0, -2);

    // Update the clip-path
    shape.style.clipPath = `polygon(${newPolygon})`;
}

function animatePolygons(allShapes){
        for(const shape of allShapes){
            morphPolygon(shape);
        }
    
}

function makeShapes() {
    container.innerHTML = '';
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let cols = width/shapeSize;
    // container.style.gridTemplateColumns = `repeat(${Math.floor(cols)}, ${shapeSize}px)`;
    container.style.gridTemplateColumns = `repeat(${Math.ceil(cols)*2}, ${1}fr)`

    for (let i = shapeSize; i < width*height; i+=shapeSize) {
        let shape = document.createElement('div');
        let item = document.createElement('div');
        item.style.height = shapeSize+'px';
        item.style.width = shapeSize+'px';

        shape.classList.add('shape');
        shape.style.backgroundColor = getRandomColor();
        shape.style.borderRadius = verticalScrollPosition + 'px ' + horizontalScrollPosition + 'px ' + verticalScrollPosition + 'px ' + horizontalScrollPosition + 'px';
        shape.style.height = shapeSize+'px';
        shape.style.width = shapeSize+'px';

        // Set the number of sides for the polygon
        let numberOfSides = Math.floor(Math.random() * 10) + 3; // Change 10 to the maximum number of sides you want, +3 ensures at least a triangle
        shape.setAttribute('data-sides', numberOfSides.toString());

        // Create the polygon
        let polygon = '';
        for(let j = 0; j < numberOfSides; j++) {
            let angle = 2 * Math.PI / numberOfSides * j;
            let x = 50 + 50 * Math.cos(angle);
            let y = 50 + 50 * Math.sin(angle);
            polygon += `${x}% ${y}%, `;
        }
        polygon = polygon.slice(0, -2); // Remove the trailing comma and space

        // Set the shape of the div to the polygon
        shape.style.clipPath = `polygon(${polygon})`;
        item.classList.add('item');
        item.appendChild(shape);

        container.appendChild(item);
    }
}


function adjustContainerHeight() {
    var viewportHeight = window.innerHeight;

    // Get the position of the bottom of the container
    var rect = container.getBoundingClientRect();
    var containerBottomPos = rect.bottom;

    // Check if the bottom of the container is less than the viewport height
    if (containerBottomPos < viewportHeight) {
        // Set the new height of the container
        container.style.height = (rect.height + (viewportHeight - containerBottomPos) + 100) + 'px';

    }
}

// Run the function initially and also every time the window resizes
adjustContainerHeight();
window.onresize = adjustContainerHeight;


function animateShapes_old(allShapes){
    for(const shape of allShapes){
        let currBorderRadius = shape.style.borderRadius.split(" ");
        let newBorderRadius = currBorderRadius.map(radius => {
            let value = parseInt(radius);
            let sign = Math.random() >= 0.5 ? 1 : -1;
            return (value + sign * Math.random() * 10) + "px"; // Change 10 to the range you want
        });
        shape.style.borderRadius = newBorderRadius.join(" ");
    }
    
}

function animateShapes(allShapes){
    console.log("allShapes", allShapes);
    for(const shape of allShapes){
        // Split the current border radius values, or use a default value if not defined
        let currBorderRadius = shape.style.borderRadius.split(" ");
        if (currBorderRadius.length === 0 || currBorderRadius[0] === "") {
            // Initialize with a default value for all radii if none are defined
            currBorderRadius = ["0px", "0px", "0px", "0px", "/0px", "0px", "0px", "0px"];
        } else if (currBorderRadius.length < 8) {
            // Add default values for missing radii
            while(currBorderRadius.length < 8) {
                currBorderRadius.push("0px");
            }
        }

        console.log("currBorderRadius", currBorderRadius);

        // Map each radius to a new value with a random change
        let newBorderRadius = currBorderRadius.map((radius, index) => {
            let value = parseInt(radius);
            let sign = Math.random() >= 0.5 ? 1 : -1;
            // Customize the range of change for each corner if needed
            let change = (index < 4 ? Math.random() * 10 : Math.random() * 3);
            return (value + sign * change) + "px";
        });


        // Apply the new border radius values to the shape
        shape.style.borderRadius = newBorderRadius.join(" ");
        console.log("shape.style.borderRadius", shape.style.borderRadius)
    }
}


function setupMousePositionListener() {
    document.addEventListener('mousemove', function(e) {
        currMouseX = e.clientX;
        currMouseY = e.clientY;
        console.log('Mouse X: ' + e.clientX + ', Mouse Y: ' + e.clientY);

        prevMouseX = currMouseX;
        prevMouseY = currMouseY;
    });
}


// functions i need
//    randomcolor
//  scroll pos

// get the dimensions of the viewport
// check if scrolling
// if schrolling tie the border radius to the scroll position
// as i scroll change the shape of the border raduses
// always fill infinetely the rest of the viewport with different shapes
