("use strict");
document.addEventListener("DOMContentLoaded", function () {
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  let canvas, ctx, w, h;
  let fireworksMax = 5;
  let numberOfParticles = randomNumber(15, 90);
  let fireworks = [],
    particles = [];
  let hue = 0;
  let timeEnd = 1;
  let fireworksChance = 0.2;
  let particleSettings = {
    gravity: 0.02,
  };
  let terrifyingExplosion = document.querySelector("#explosionSound");
  let HappyNewYear = document.querySelector("#HappyNewYear");
  function init() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    resizeReset();
    animationLoop();
  }
  function resizeReset() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    // let grd = ctx.createLinearGradient(w, 900, w, 0);
    // grd.addColorStop(0.3, "#03002466");
    // grd.addColorStop(1, "#000000c2");
    // ctx.fillStyle = grd;
    ctx.fillStyle = "#dc9999c2";
    ctx.fillRect(0, 0, w, h);
  }
  function animationLoop() {
    timeEnd = randomNumber(35, 90);
    particleSettings.gravity = Math.random() * 0.05;
    if (fireworks.length < fireworksMax && Math.random() < fireworksChance) {
      fireworks.push(new Firework());
      hue += 25;
    }
    ctx.globalCompositeOperation = "source-over";
    // ctx.fillStyle = "#030506";
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    drawScene();
    arrayCleanup();
    requestAnimationFrame(animationLoop);
  }
  function explosionSound() {
    terrifyingExplosion.play();
    HappyNewYear.play();
  }
  function drawScene() {
    fireworks.map((firework) => {
      firework.update();
      firework.draw();
    });
  }
  function arrayCleanup() {
    let dump1 = [],
      dump2 = [];
    fireworks.map((firework) => {
      if (firework.alpha > 0) {
        dump1.push(firework);
      } else {
        firework.alpha = 1;
        createFireworks(firework.x, firework.y);
      }
    });
    fireworks = dump1;
    let repeatExplosions;
    particles.map((item, i) => {
      if (item.move) {
        dump2.push(item);
        item.draw();
        repeatExplosions = setTimeout(() => {
          item.radial = randomNumber(0.4, 0.9) * 10;
          item.draw();
        }, 15);
      }
      if (item.ttl <= 0 || particles > 200) {
        particles.splice(i, 1);
      }
    });
    particles = dump2;
    clearTimeout(repeatExplosions);
  }
  function createFireworks(x, y) {
    let color = `rgb(${randomNumber(100, 255)},
  ${randomNumber(0, 255)},${randomNumber(0, 255)})`;
    for (let i = 0; i < numberOfParticles; i++) {
      let particle = new Particle(x, y);
      particle.color = color;
      let vy = Math.sqrt(25 - particle.vx * particle.vx);
      // let vy = Math.hypot(particle.vy, particle.vx);
      if (Math.abs(particle.vy) > vy) {
        particle.vy = particle.vy > 0 ? vy : -vy;
      }
      particles.push(particle);
    }
    explosionSound();
  }
  function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
  class Firework {
    constructor() {
      this.x = getRandomInt(w * 0.2, w * 0.8);
      this.y = h;
      this.targetY = getRandomInt(h * 0.01, h * 0.5);
      this.hue = hue;
      this.alpha = 1;
      this.tick = 0;
      this.ttl = getRandomInt(120, 180);
      this.drawP = this.ttl;
      this.size = getRandomInt(2, 4);
    }
    draw() {
      if (this.tick <= this.ttl) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
        ctx.fill();
        ctx.closePath();
      }
    }
    update() {
      let progress = 1 - (this.ttl - this.tick) / this.ttl;
      let dx = (Math.random() - 0.5) * 4;
      this.x += dx;
      this.y = h - (h - this.targetY) * easeOutQuart(progress);
      this.alpha = 1 - easeOutQuart(progress);
      this.tick++;
      this.drawP--;
    }
  }
  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  function Particle(x, y) {
    this.radial = randomNumber(0.2, 0.9) * 8;
    this.x = x;
    this.y = y;
    this.al = 1;
    this.ttl = timeEnd;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.draw = function () {
      this.ttl--;
      this.al -= 0.016;
      this.x += this.vx / 2;
      this.y += this.vy / 2;
      this.vy += particleSettings.gravity;
      ctx.save();
      ctx.beginPath();
      ctx.scale(0.5, 0.5);
      ctx.translate(this.x * 2, this.y * 2);
      ctx.arc(0, 0, this.radial, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${getRandomInt(20, 255)},
       ${getRandomInt(0, 255)},${getRandomInt(0, 255)}, ${this.al})`;
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };
    this.move = function () {
      if (this.ttl === 0) {
        return false;
      }
      return true;
    };
  }
  window.addEventListener("resize", resizeReset);
  init();
});
