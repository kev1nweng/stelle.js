/*
  你不是我权衡利弊后的选择，而是我怦然心动后，
  明知不可为而为之的坚定。
  */

" Sei la stella nei mei occhi. "

export class Stelle {
  /**
   * 生成 Stelle 实例
   * @param {string} parent 生成的父元素
   * @param {object} params 生成参数
   * @returns {any}
   */
  constructor(parent, params) {
    this.pnode = document.querySelector(parent);
    if (!this.pnode) this.utils.sendError(`Failed to find element: "${query}" point to nothing! `);
    this.flags.meteor = params.useMeteor ? true : false;
  }

  get utils() {
    const that = this;
    return {
      $qs: (query) => { return document.querySelector(query) },
      $id: (id) => { return document.getElementById(id) },
      sendError: (err, isFatal = false) => {
        const prefix = "[ Stelle ]"
        if (isFatal) throw new Error(`${prefix} ${err}`);
        else console.error(`${prefix} ${err}`);
      },
      drawAStar(starX, starY, starR, starD, starA, ctx) {
        let alphaFrozen;
        ctx.beginPath();
        if (that.flags.bright) {
          alphaFrozen = true;
          ctx.fillStyle = `rgba(75, 141, 44, ${starA})`;
          ctx.arc(starX, starY, starR * 2, 0, 2 * Math.PI);
        } else {
          alphaFrozen = false;
          if (starD) {
            ctx.arc(starX, starY, starR, 0, 2 * Math.PI);
            let gradient = ctx.createRadialGradient(
              starX,
              starY,
              starR * 0.25,
              starX,
              starY,
              starR * 2
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${starA / 2})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(starX, starY, starR * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${starA})`;
            ctx.arc(starX, starY, starR * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  }
  get data() {
    const that = this;
    return {
      numStars: new Number(((that.canvas.width * that.canvas.height) / this.config.explicit["DENSE_INVERSE"]).toFixed(0)),
    }
  }

  pnode = null;
  flags = {
    meteor: false,
    dawn: false,
    bright: false,
  }
  config = {
    runtime: {
      starArray: [],
      initialized: false,
    },
    implicit: {
      "PX_RATIO": window.devicePixelRatio || 1,
    },
    explicit: {
      "DENSE_INVERSE": 2e3,
    }
  }

  init() {
    if (this.config.runtime.initialized) {
      this.utils.sendError("Stelle has already been initialized! ");
      return;
    }
    const element = document.createElement("canvas");
    this.pnode.appendChild(element);
    this.canvas = element;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.pnode.offsetWidth * PX_RATIO;
    this.canvas.height = this.pnode.offsetHeight * PX_RATIO;
    this.canvas.style.width = `${this.pnode.offsetWidth}px`;
    this.canvas.style.height = `${this.pnode.offsetHeight}px`;
    this.ctx.scale(this.config.implicit.PX_RATIO, this.config.implicit.PX_RATIO);
  }
  destroy() { }

  generateStars() {
    for (let i = 0; i < (this.data.numStars); i++) {
      this.config.runtime.starArray.push({
        i: i,
        x: Math.random() * this.canvas.offsetWidth * 1.25 - this.canvas.offsetWidth * 0.125,
        y:
          Math.random() * this.canvas.offsetHeight * 1.25 -
          this.canvas.offsetHeight * 0.125,
        yDist: null,
        radius: Math.random() * 3.5,
        alpha: Math.random() * 0.5,
        vy: Math.random() * 2,
        shakeRate: 0.0025,
        display: false,
      });
    }
  }
  drawStars() { }
}
