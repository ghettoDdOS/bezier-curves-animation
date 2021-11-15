const config = {
  waveSpeed: 0.3,
  wavesToBlend: 4,
  curvesNum: 40,
  framesToMove: 120,
};
class waveNoise {
  constructor() {
    this.waveSet = [];
  }
  addWaves(requiredWaves) {
    for (let i = 0; i < requiredWaves; i++)
      this.waveSet.push(Math.random() * 360);
  }
  getWave() {
    let blendedWave = 0;
    this.waveSet.forEach((e) => {
      blendedWave += Math.sin((e / 180) * Math.PI);
    });
    return (blendedWave / this.waveSet.length + 1) / 2;
  }
  update() {
    this.waveSet.forEach((e, i) => {
      let r = Math.random() * (i + 1) * config.waveSpeed;
      this.waveSet[i] = (e + r) % 360;
    });
  }
}
class Animation {
  constructor() {
    this.cnv = null;
    this.context = null;
    this.size = {
      width: 0,
      height: 0,
      cx: 0,
      cy: 0,
    };
    this.controls = [];
    this.controlsNum = 5;
    this.framesCounter = 0;
    this.typeForStart = 0.7;
    this.typeForEnd = 0.5;
  }

  init() {
    this.createCanvas();
    this.createControls();
    this.updateAnimation();
  }
  createCanvas() {
    this.cnv = document.createElement("canvas");
    this.ctx = this.cnv.getContext("2d");
    this.setCanvasSize();
    window.addEventListener("resize", () => {
      this.setCanvasSize();
    });
    document.body.appendChild(this.cnv);
  }
  setCanvasSize() {
    this.size.width = this.cnv.width = window.innerWidth;
    this.size.height = this.cnv.height = window.innerHeight;
    this.size.cx = this.size.width / 2;
    this.size.cy = this.size.height / 2;
  }
  createControls() {
    for (let i = 0; i < this.controlsNum + config.curvesNum; i++) {
      let control = new waveNoise();
      control.addWaves(config.wavesToBlend);
      this.controls.push(control);
    }
  }
  updateCurves() {
    let c = this.controls;
    console.log(c.length);
    let _controlX1 = c[0].getWave() * this.size.width;
    let _controlY1 = c[1].getWave() * this.size.height;
    let _controlX2 = c[2].getWave() * this.size.width;
    for (let i = 0; i < config.curvesNum; ++i) {
      let _controlY2 = c[3 + i].getWave();
      let curveParam = {
        startX: 0,
        startY: this.getYPlacmentType(this.typeForStart, i),
        controlX1: _controlX1,
        controlY1: _controlY1,
        controlX2: _controlX2,
        controlY2: _controlY2 * this.size.height,
        endX: this.size.width,
        endY: this.getYPlacmentType(this.typeForEnd, i),
        alpha: _controlY2,
      };
      this.drawCurve(curveParam);
    }
  }
  drawCurve({
    startX,
    startY,
    controlX1,
    controlY1,
    controlX2,
    controlY2,
    endX,
    endY,
    alpha,
  }) {
    this.ctx.strokeStyle = `rgba(233, 43, 252, ${alpha})`;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.bezierCurveTo(
      controlX1,
      controlY1,
      controlX2,
      controlY2,
      endX,
      endY
    );
    this.ctx.stroke();
  }
  updateCanvas() {
    this.ctx.fillStyle = "rgb(22, 22, 25)";
    this.ctx.fillRect(0, 0, this.size.width, this.size.height);
  }
  updateControls() {
    this.controls.forEach((e) => e.update());
  }
  getYPlacmentType(type, i) {
    if (type > 0.6) {
      return (this.size.cy / config.curvesNum) * i;
    } else if (type > 0.4) {
      return this.size.height;
    } else if (type > 0.2) {
      return this.size.cy;
    } else {
      return 0;
    }
  }
  //   updateFrameCounter() {
  //     this.framesCounter = (this.framesCounter + 1) % config.framesToMove;
  //     if (this.framesCounter === 0) {
  //       this.typeForStart = Math.random();
  //       this.typeForEnd = Math.random();
  //     }
  //   }
  updateAnimation() {
    // this.updateFrameCounter();
    this.updateCanvas();
    this.updateCurves();
    this.updateControls();
    window.requestAnimationFrame(() => this.updateAnimation());
  }
}

window.onload = () => {
  new Animation().init();
};
