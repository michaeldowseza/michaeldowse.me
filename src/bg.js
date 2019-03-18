class Background {
  constructor(canvasSelector) {
    this.canvasSelector = canvasSelector;
  }

  init() {
    // Init Canvas
    this.canvas = this.getCanvas();
    this.canvas.onmousemove = e => {
      const rect = e.target.getBoundingClientRect();

      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    };

    this.resize();
    this.scroll();

    this.ctx = this.canvas.getContext('2d');

    // Init particles
    this.circles = [];
    for (let x = 0; x < Math.min(this.width * 0.5, 500); x++) {
      const circle = new Circle();
      circle.init(this.width, this.height);

      this.circles.push(circle);
    }
  }

  getCanvas() {
    return document.getElementById(this.canvasSelector);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.target = { x: 0, y: this.height };

    this.canvas.width = this.width - 24;
    this.canvas.height = this.height;
  }

  scroll() {
    this.isAnimating = window.scrollY <= this.height;
  }

  render() {
    if (this.isAnimating) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.circles.forEach(circle => {
        circle.render(this.ctx, this.width, this.height, this.mouseX, this.mouseY);
      });
    }

    requestAnimationFrame(this.render.bind(this));
  }
}

class Circle {
  constructor() {
    this.pos = {};
    this.alpha = 0;
    this.velocity = 0;
    this.scale = 1;
  }

  init(screenWidth, screenHeight) {
    this.pos.x = Math.random() * screenWidth;
    this.pos.y = screenHeight + Math.random() * 100;
    this.alpha = 0.1 + Math.random() * 0.3;
    this.scale = 0.1 + Math.random() * 0.3;
    this.velocity = Math.random();
  }

  isMouseOver(mouseX, mouseY) {
    const sensitivity = 20;

    return (
      this._inRange(this.pos.x, this.pos.x, mouseX, sensitivity) &&
      this._inRange(this.pos.y, this.pos.y, mouseY, sensitivity)
    );
  }

  _inRange(lower, upper, value, sensitivity) {
    return lower - sensitivity <= value && upper + sensitivity >= value;
  }

  render(ctx, screenWidth, screenHeight, mouseX, mouseY) {
    if (this.alpha <= 0) {
      this.init(screenWidth, screenHeight);
    }

    this.pos.y -= this.velocity;
    this.alpha -= 0.0005;

    if (this.pos.y < screenHeight / 2) {
      this.alpha -= 0.01;
    }

    if (this.isMouseOver(mouseX, mouseY)) {
      this.alpha += 0.05;
      this.alpha = Math.min(this.alpha, 1);
    }

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.scale * 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
  }
}

const bg = new Background('hero-canvas');
bg.init();
bg.render();

window.addEventListener('resize', () => bg.resize());
window.addEventListener('scroll', () => bg.scroll());
