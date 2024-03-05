//The preload function loads files, such as images and sound, before the setup() function is initiated. Setup() will not initiate until all files loaded into preload() are ready. 
function preload() {
  img = loadImage('BeeLeft.png'); //image of the bees flying right
  img1 = loadImage('BeeRight.png'); //image of the bees flying left
  swarm = loadSound('swarm.mp3'); //swarming sfx
}

//global variables - these variables can be accessed by any function
let video; //video variable for live video camera capture
let poseNet; //brings in poseNet from the ml5.js library
let poses = []; //the array for poses
let rightCircles = []; //the array for rightCircles
let leftCircles = []; //the array for leftCircles
let easing = 0.02; //easing variable - creates lag for when the bees follow user
let participant; //YOU
let img; //BeeLeft.png file from preload
let img1; //BeeRight.png file from preload
let pose; //variable for poses
let d; //distance - used to enlarge or shrink size of bees depending on users proximity to video source
let swarm; //swarm.mp3 file from preload


//setup() is a function that is run only once at the start of the program. As the name suggests, it sets up the program
function setup() {
  createCanvas(640, 480); //creates a screen where the program runs 640x480
  video = createCapture(VIDEO); //enables video capture
  video.hide(); //hides one video screen 
  poseNet = ml5.poseNet(video, modelLoaded); //brings PoseNet in from ml5 library
  poseNet.on('pose', gotPoses); //initializes PoseNet
  //filling in the array
  for (let i = 0; i < 100; i++) { 
    rightCircles[i] = new rightCircle(); //fills in the rightCircle array
  }
  for (let i = 0; i < 100; i++) {
    leftCircles[i] = new leftCircle(); //fills in the leftCircle array
  }
}

function gotPoses(poses) {
  //if the length of the poses array is greater than 0, participant is true
  if (poses.length > 0) { 
    pose = poses[0].pose;
    participant = true; 
  }
  //if the length of the poses array is equal to 0, participant is false
  if (poses.length == 0) {
    participant = false;
  }
}

function modelLoaded() {
  //lets me know that the model is loaded and ready
  console.log('poseNet ready');
}

function draw() { //this function loops 60x a second while the program is running
  image(video, 0, 0); //shows the video being captured

  // if (pose) {
  //   let eyeR = pose.rightEye; //right eye
  //   let eyeL = pose.leftEye; //left eye
  //   d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y); //calculates the distance between right eye and left eye points, adjusting the size of the bees accordingly
  // } else {
  //   d = 25; //when there is no participant d = 50
  // }

  if (participant) {
    if (!swarm.isLooping()) {
      swarm.loop() //plays sound when there is a participant
    }
  } else {
    swarm.stop(); //stops sound when there is no participant
  }


  //calling the methods
  for (let i = 0; i < rightCircles.length; i++) {
    rightCircles[i].show(15, 20); //executes the show rightCircle show method
    rightCircles[i].move(); //executes the move rightCircle method
  }
  for (let i = 0; i < leftCircles.length; i++) {
    leftCircles[i].show(15, 20); //executes the show leftCircle method
    leftCircles[i].move(); //executes the move leftCircle method
  }
}

//classes
class rightCircle {
  constructor() {
    //positions the bee at the start of the program
    this.x = random(0, 640); 
    this.y = random(0, 480);
  }

  show(w, h) {
    //shows the bee image at the x, y coordinate with a width (w) and height (h) determined by the distance equation
    image(img, this.x, this.y, w, h);
  }

  move() {
    if (participant == true) {
      
      //creates swarm
      //animates bees and adjusts the positioning of the bees as the participant moves around and creates a lag in the movement through easing
      let targetX = pose.nose.x;
      let dx = targetX - this.x; 
      this.x += (dx * easing) + random(-20, 20);

      let targetY = pose.nose.y - 125;
      let dy = targetY - this.y;
      this.y += (dy * easing) + random(-20, 20);

    }

    if (participant == false) {
      
      //movement when there is no swarm
      //keeps the bees moving right
      this.x = this.x + random(1, 7);
      this.y = this.y - random(-3, 3);

      //resets the circle moving right when they cross the edge
      if (this.x > 640) {
        this.x = 0 + random(-300, 0);

      }
    }
  }
}

class leftCircle {
  constructor() {
    //positions the bees at the start of the program
    this.x = random(0, 640);
    this.y = random(0, 480);
  }

  show(w, h) {
    //shows the bee image at the x, y coordinate with a width (w) and height (h) determined by the distance equation
    image(img1, this.x, this.y, w, h);
  }

  move() {
    if (participant == true) {

      //creates swarm
      //animates bees and adjusts the positioning of the bees as the participant moves around and creates a lag in the movement through easing
      let targetX = pose.nose.x;
      let dx = targetX - this.x;
      this.x += (dx * easing) + random(-20, 20);

      let targetY = pose.nose.y - 125;
      let dy = targetY - this.y;
      this.y += (dy * easing) + random(-20, 20);

    }

    if (participant == false) {

      //movement when there is no swarm
      //keeps the circles moving left
      this.x = this.x - random(1, 5);
      this.y = this.y + random(-3, 3);

      //resets the circles moving left when they cross the edge
      if (this.x < 0) {
        this.x = 640 + random(0, 300);
      }
    }
  }
}