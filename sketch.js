let capture;
let photoStage = 0;
let headImage;
let img;
let showLiveFeed = true;
let message = "";
let messageColor = "black";
let buttonWidth = 90;
let buttonHeight = 50;
let buttonY;
let margin = 20;
let button1X;
let button2X;
let buttonCapture;

function preload() {
  headImage = loadImage('PASEK3.png');
}

function setup() {
  createCanvas(1920, 1080);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  textSize(20);

  buttonY = height / 2 - buttonHeight / 2;
  button1X = width - 210;
  button2X = width - 110;

  let xOffset = (width - 640) / 2;
  let yOffset = (height - 480) / 2;

  buttonCapture = createButton('Zrób zdjęcie');
  buttonCapture.position(xOffset + 640 / 2 - buttonCapture.width / 2, yOffset + 480 + 10);
  buttonCapture.mousePressed(takePhoto);
  styleButton(buttonCapture, '#E30613');
}

function draw() {
  background(255);
  image(headImage, 0, 0, 1920, 220);

  let xOffset = (width - 640) / 2;
  let yOffset = (height - 480) / 2;

  if (showLiveFeed) {
    image(capture, xOffset, yOffset, 640, 480);
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    ellipse(width / 2, height / 2, 200, 300);
  } else {
    image(img, xOffset, yOffset, 640, 480);
    if (message) {
      fill(messageColor);
      noStroke();
      textSize(20);
      textAlign(CENTER, CENTER);
      text(message, xOffset + 320, yOffset + 480 - 30);
    }
  }

  // Draw the instruction text regardless of the showLiveFeed state
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textStyle(BOLDITALIC);
  text('Umieść twarz w zaznaczonym miejscu i naciśnij "Zrób zdjęcie"', width / 2, yOffset - 30);

  drawButton(button1X, buttonY, buttonWidth, buttonHeight, "Cofnij", '#FFB3B3');
  drawButton(button2X, buttonY, buttonWidth, buttonHeight, "Dalej", '#E30613');
}

function takePhoto() {
  if (showLiveFeed) {
    img = capture.get();
    if (photoStage === 0) {
      img.filter(BLUR, 3);
      showMessage("Zdjęcie jest rozmyte, proszę zrobić kolejne.", "red");
    } else if (photoStage === 1) {
      img = increaseBrightness(img, 150);
      showMessage("Zdjęcie jest prześwietlone, proszę zrobić kolejne.", "red");
    } else if (photoStage === 2) {
      img.filter(BLUR, 3);
      img = increaseBrightness(img, 150);
      showMessage("Zdjęcie jest świetnie wykonane!", "green");
    }
    showLiveFeed = false;
    photoStage++;
  } else {
    showLiveFeed = true;
    message = "";
  }
}

function increaseBrightness(img, amount) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    img.pixels[i] = min(img.pixels[i] + amount, 255);
    img.pixels[i + 1] = min(img.pixels[i + 1] + amount, 255);
    img.pixels[i + 2] = min(img.pixels[i + 2] + amount, 255);
  }
  img.updatePixels();
  return img;
}

function showMessage(msg, color) {
  message = msg;
  messageColor = color;
}

function drawButton(x, y, w, h, label, baseColor) {
  let hoverColor = lerpColor(color(baseColor), color(0), 0.2);
  if (isMouseOver(x, y, w, h)) {
    fill(hoverColor);
  } else {
    fill(baseColor);
  }
  noStroke();
  rect(x, y, w, h);
  fill(255);
  textStyle(NORMAL);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function isMouseOver(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function mousePressed() {
  if (isMouseOver(button2X, buttonY, buttonWidth, buttonHeight)) {
    window.open('https://buzizuzi.github.io/podpiss/', '_self');
  }
}

function styleButton(button, baseColor) {
  button.style('background-color', baseColor);
  button.style('border', 'none');
  button.style('color', 'white');
  button.style('padding', '15px 32px');
  button.style('text-align', 'center');
  button.style('text-decoration', 'none');
  button.style('display', 'inline-block');
  button.style('font-size', '20px');
  button.style('margin', '4px 2px');
  button.style('transition-duration', '0.4s');
  button.style('cursor', 'pointer');

  button.mouseOver(() => button.style('background-color', lerpColor(color(baseColor), color(0), 0.2)));
  button.mouseOut(() => button.style('background-color', baseColor));
}
