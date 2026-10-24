//vv1

let bg;
let imgs = [];
let animals = [];
let sticks = [];

let song;
let fft;

let isStopped = true;
let lastTrigger = 0;

function preload() {
  bg = loadImage("bg_unicorn.png");

  imgs.push(loadImage("1y.png"));
  imgs.push(loadImage("1y2.png"));
  imgs.push(loadImage("1y3.png"));

  song = loadSound("dream.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  noStroke();

  song.setVolume(1);

  fft = new p5.FFT();
  fft.setInput(song);

  generateArtwork();
}

function draw() {
  background(255);

  drawBackground();
  drawMagicDust();
  drawAnimals();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateArtwork();
}

function generateArtwork() {
  animals = [];
  sticks = [];

  generateLayout();
  generateMagicDust();
}

function drawBackground() {
  if (!bg || bg.width === 0 || bg.height === 0) {
    return;
  }

  imageMode(CORNER);

  const scaleValue = max(width / bg.width, height / bg.height);
  const drawW = bg.width * scaleValue;
  const drawH = bg.height * scaleValue;
  const offsetX = (width - drawW) / 2;
  const offsetY = (height - drawH) / 2;

  image(bg, offsetX, offsetY, drawW, drawH);
}

function generateMagicDust() {
  const colors = [
    [255, 190, 215],
    [255, 235, 240],
    [40, 255, 120]
  ];

  for (let i = 0; i < 600; i++) {
    sticks.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      color: random(colors),
      phase: random(TWO_PI),
      speed: random(0.02, 0.05)
    });
  }
}

function drawMagicDust() {
  noStroke();

  for (let s of sticks) {
    let pulse = 1;

    if (!isStopped) {
      pulse = 1 + sin(frameCount * s.speed + s.phase) * 0.25;
    }

    fill(s.color[0], s.color[1], s.color[2], 140);
    circle(s.x, s.y, s.size * pulse);
  }
}

function generateLayout() {
  animals = [];

  for (let i = 0; i < 100; i++) {
    const img = random(imgs);
    const scaleValue = random(0.03, 0.06);
    const w = img.width * scaleValue;
    const h = img.height * scaleValue;

    animals.push({
      img: img,
      x: random(width),
      y: random(height),
      w: w,
      h: h,
      phase: random(TWO_PI),
      pulseSpeed: random(0.025, 0.055),
      minScale: 0.3,
      maxScale: random(1.8, 2.2),
      angle: random(-PI / 3, PI / 3)
    });
  }
}

function drawAnimals() {
  imageMode(CENTER);
  noTint();

  for (let a of animals) {
    let scaleValue = 1;

    if (!isStopped) {
      const wave = (sin(frameCount * a.pulseSpeed + a.phase) + 1) / 2;
      scaleValue = lerp(a.minScale, a.maxScale, wave);
    }

    push();
    translate(a.x, a.y);
    rotate(a.angle);
    image(a.img, 0, 0, a.w * scaleValue, a.h * scaleValue);
    pop();
  }

  noTint();
  imageMode(CORNER);
}

function triggerSound() {
  if (!song) return;
  if (millis() - lastTrigger < 400) return;
  lastTrigger = millis();

  if (!isStopped) {
    isStopped = true;

    if (song.isPlaying()) {
      song.stop();
    }
  } else {
    generateArtwork();
    isStopped = false;
    userStartAudio();
    getAudioContext().resume();
    song.play();
  }
}

function mousePressed() {
  triggerSound();
  return false;
}

function touchStarted() {
  triggerSound();
  return false;
}

document.addEventListener("touchstart", (event) => {
  triggerSound();
  event.preventDefault();
}, { passive: false });

window.addEventListener("message", function(event) {
  if (event.data === "triggerSound") {
    triggerSound();
  }
});

function keyPressed() {
  if (key === "r" || key === "R") {
    saveGif("poison-garden", 8);
  }

  if (key === "s" || key === "S") {
    saveCanvas("poison-garden", "png");
  }
}
