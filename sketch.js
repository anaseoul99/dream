
let bg;
let imgs = [];
let animals = [];
let sticks = [];

let song;
let fft;

let isStopped = true;

function preload() {
  bg = loadImage("bg_unicorn.png");

  imgs.push(loadImage("1y.png"));
  imgs.push(loadImage("1y2.png"));
  imgs.push(loadImage("1y3.png"));

  song = loadSound("dream.mp3");
}

function setup() {
  createCanvas(1242, 886);

  song.setVolume(1);

  fft = new p5.FFT();
  fft.setInput(song);

  generateArtwork();
}

function draw() {
  drawBackground();
  drawMagicDust();
  drawAnimals();
}

function generateArtwork() {
  animals = [];
  sticks = [];

  generateLayout();
  generateMagicDust();
}

function drawBackground() {
  imageMode(CORNER);
  image(bg, 0, 0, width, height);
}

// 반짝이는 점 600개
function generateMagicDust() {
  for (let i = 0; i < 600; i++) {
    sticks.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      color: random([
        [255, 190, 215],
        [255, 235, 240],
        [40, 255, 120]
      ]),
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

    fill(
      s.color[0],
      s.color[1],
      s.color[2],
      140
    );

    circle(s.x, s.y, s.size * pulse);
  }
}

// 이미지 동그라미 100개
function generateLayout() {
  animals = [];

  for (let i = 0; i < 100; i++) {
    let img = random(imgs);

    // 이미지 기본 크기
    let scaleValue = random(0.03, 0.06);

    let w = img.width * scaleValue;
    let h = img.height * scaleValue;

    animals.push({
      img: img,

      // 위치 고정
      x: random(width),
      y: random(height),

      w: w,
      h: h,

      // 각자 다른 맥동 리듬
      phase: random(TWO_PI),
      pulseSpeed: random(0.025, 0.055),

      // 작아졌다가 크게 확대
      minScale: 0.3,
      maxScale: random(1.8, 2.2),

      angle: random(-PI / 3, PI / 3)
    });
  }
}

// 이미지가 제자리에서 커졌다 작아짐
function drawAnimals() {
  imageMode(CENTER);
  noTint();

  for (let a of animals) {
    let scaleValue = 1;

    if (!isStopped) {
      let wave =
        (sin(frameCount * a.pulseSpeed + a.phase) + 1) / 2;

      scaleValue = lerp(
        a.minScale,
        a.maxScale,
        wave
      );
    }

    push();

    translate(a.x, a.y);
    rotate(a.angle);

    image(
      a.img,
      0,
      0,
      a.w * scaleValue,
      a.h * scaleValue
    );

    pop();
  }

  noTint();
}

// 클릭: 시작 / 정지 / 재시작
function triggerSound() {
  if (!isStopped) {
    isStopped = true;

    if (song.isPlaying()) {
      song.stop();
    }
  } else {
    generateArtwork();

    isStopped = false;

    userStartAudio();

    song.stop();
    song.play();
  }
}

function mousePressed() {
  triggerSound();
  return false;
}

// Cargo iframe 메시지 연동
window.addEventListener("message", (event) => {
  if (event.data === "triggerSound") {
    triggerSound();
  }
});

// 키보드 단축키
function keyPressed() {
  if (key === "r" || key === "R") {
    saveGif("poison-garden", 8);
  }

  if (key === "s" || key === "S") {
    saveCanvas("poison-garden", "png");
  }
}
