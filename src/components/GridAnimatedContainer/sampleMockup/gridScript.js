
// the entire container that we want to animate with the grid thingy
const gridAnimator = document.getElementById("gridAnimator");

// Of the 2 identical layers
// We grab the top layer 
const gridTopLayer = document.getElementById("gridTopLayer");


// const rect = gridAnimator.getBoundingClientRect();
// console.log(rect);


// the current coordinate of where the user is pointing
let targetX = 0;
let targetY = 0;


// The actual circle postion ( Should lag behind the cursor ) 
let currentX = 0;
let currentY = 0;

// visibility / transparency
let alpha = 1;
let inside = false;

function getCursorLocationWithinElement( evt ) {

  /*
    This event can take on 2 forms 
    mouse event using mouse on PC
    touch event using touch enabled devices
    
    So on computers and dev tooling, i wont focus much on it
    And for the first iteration, the control will default to the else block
  */



  // get the dimensions of the animation container
  const rect = gridAnimator.getBoundingClientRect();
  
  let clientX, clientY;

  if (evt.touches && evt.touches.length > 0) {
    
    clientX = evt.touches[0].clientX;
    clientY = evt.touches[0].clientY;
  
  } else {
    // if you arent on touch screen and youre on PC
    
    clientX = evt.clientX;
    clientY = evt.clientY;
    console.log(`clientX: ${clientX} | clientY: ${clientY}`);
    
  }
  
  targetX = clientX - rect.left;
  targetY = clientY - rect.top;
  inside = true;
  
}



// --------------- CURSOR EVENTS AND MOUSE ( NOT TOUCH DEVICE ) --------------

gridAnimator.addEventListener(
  // track movements with in the element
  "mousemove",
  getCursorLocationWithinElement
);


// tell the DOM that the pointer is nolonger in the element space
gridAnimator.addEventListener(
  // when the mouse leaves the element
  "mouseleave",

  // when the pointer leaves, notify our flag that it is out
  () => {
    inside = false;
  }
);
// ----------------------------------------------------------------------------



// ----------------------- TOUCH SCREEN DEVICES -------------------------------

// repeat but for touch enabled devices
gridAnimator.addEventListener(
  // On start of the touch action
  "touchstart",
  getCursorLocationWithinElement
);

gridAnimator.addEventListener(
  // When youre moving around the element
  "touchmove",
  getCursorLocationWithinElement
);

gridAnimator.addEventListener(
  // When user stops touching the screen
  "touchend",
  () => {
    inside = false;
  }
);

// ------------------------------------------------------------------------------

/* 
this create an interpolation from one point to another
hence its calcs a path to follow smoothly
to avoid snapping from point A to B
*/
function linearInterpolate (oldPosition, newPosition, timeTakeForTransition){
  return oldPosition + (newPosition - oldPosition) * timeTakeForTransition;
}

function animate() {
  currentX = linearInterpolate(currentX, targetX, 0.015);
  currentY = linearInterpolate(currentY, targetY, 0.015);

  if (inside) {
    alpha = linearInterpolate(alpha, 1, 0.1); // fade in
  } else {
    alpha = linearInterpolate(alpha, 0, 0.05); // fade out
  }

  gridTopLayer.style.setProperty("--x", `${currentX}px`);
  gridTopLayer.style.setProperty("--y", `${currentY}px`);
  gridTopLayer.style.setProperty("--alpha", `${alpha.toFixed(2)}`);

  requestAnimationFrame(animate);
}

animate();
