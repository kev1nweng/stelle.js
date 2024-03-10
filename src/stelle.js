/*
  你不是我权衡利弊后的选择，而是我怦然心动后，
  明知不可为而为之的坚定。
  */

" Sei la stella nei mei occhi. ";

export class Stelle {
  /**
   * 生成 Stelle 实例
   * @param {string} parent 生成的父元素
   * @param {object} params 生成参数
   * @returns {any}
   */
  constructor(parent, params) {
    this.pnode = document.querySelector(parent);
    if (!this.pnode)
      this.utils.sendError(
        `Failed to find element: "${query}" point to nothing! `
      );
    this.flags.meteor = params.useMeteor ? true : false;
    this.flags.distortion = params.useDistortion ? true : false;
  }

  get utils() {
    const that = this;
    return {
      $qs: (query) => {
        return document.querySelector(query);
      },
      $id: (id) => {
        return document.getElementById(id);
      },
      sendError: (err, isFatal = false) => {
        const prefix = "[ Stelle ]";
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
      },
      rangeMap(g, as, ae, ts, te) {
        if (ts >= te || as >= ae || g < as || g > ae) {
          if (false) {
            console.log(
              "Unresolvable map:",
              as,
              "|",
              g.toFixed(2),
              "|",
              ae,
              "=>",
              ts,
              te
            );
          }
          return g > ae ? te : ts;
        }
        let deltaT, deltaA, k;
        deltaT = te - ts;
        deltaA = ae - as;
        k = deltaT / deltaA;
        return ts + (g - as) * k;
      },
    };
  }
  get data() {
    const that = this;
    return {
      numStars: new Number(
        (
          (that.canvas.width * that.canvas.height) /
          this.config.explicit["DENSE_INVERSE"]
        ).toFixed(0)
      ),
    };
  }

  pnode = null;
  flags = {
    meteor: false,
    dawn: false,
    bright: false,
    distortion: false,
  };
  config = {
    runtime: {
      starArray: [],
      initialized: false,
    },
    implicit: {
      PX_RATIO: window.devicePixelRatio || 1,
    },
    explicit: {
      DENSE_INVERSE: 2e3,
    },
  };

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
    this.ctx.scale(
      this.config.implicit.PX_RATIO,
      this.config.implicit.PX_RATIO
    );
  }
  destroy() { }

  generateStars() {
    for (let i = 0; i < this.data.numStars; i++) {
      this.config.runtime.starArray.push({
        i: i,
        x:
          Math.random() * this.canvas.offsetWidth * 1.25 -
          this.canvas.offsetWidth * 0.125,
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
  drawStars() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < numStars; i++) {
      const star = this.config.runtime.starArray[i];
      let alpha;
      if (!alphaFrozen) {
        alpha = star.alpha - Math.random() * star.alpha * 0.2;
      } else {
        alpha = star.alpha + 0.4;
      }
      star.x -= 0.25;
      if (star.x + star.radius * 2 <= -this.canvas.offsetWidth * 0.125) {
        star.x = this.canvas.offsetWidth * 1.125 - star.radius * 2;
      }
      const yDistDelta =
        (1 -
          Math.sin(
            this.utils.rangeMap(
              star.x,
              -this.canvas.offsetWidth * 0.125 - 7,
              this.canvas.offsetWidth * 1.125 + 7,
              Math.PI / 4,
              Math.PI * (3 / 4)
            )
          )) *
        ((this.canvas.offsetWidth * 2) / Math.PI) *
        this.utils.rangeMap(
          Math.abs(star.y - this.canvas.offsetHeight / 2),
          0,
          (this.canvas.offsetHeight * 1.125) / 2,
          0,
          1
        );
      star.yDist = this.flags.distortion
        ? star.y +
        (star.y <= this.canvas.offsetHeight / 2 ? -yDistDelta : yDistDelta)
        : star.y;
      if (star.yDist > this.canvas.offsetHeight / 2) {
        alpha *=
          1 -
          (star.y - this.canvas.offsetHeight / 2) /
          (this.canvas.offsetHeight / 2);
      }
      if (specs.counter.isBrightMode) {
        star.y -= star.vy;
        if (i % 2 == 1) {
          star.x += Math.sin((Date.now() * star.shakeRate) / 4) * 2;
        } else {
          star.x -= Math.sin((Date.now() * star.shakeRate) / 4) * 2;
        }
        star.y -= 5;
        if (star.y + star.radius * 2 < 0) {
          star.y = this.canvas.offsetHeight + star.radius * 2;
        }
      }
      this.utils.drawAStar(
        star.x,
        star.y,
        star.radius,
        star.display,
        alpha,
        ctx
      );
      this.ctx.fill();
    }
    this.drawLines.payload(ctx);
    if (this.flags.debug)
      debug.showDiagData.payload(ctx, {
        numStars: this.data.numStars,
        w: this.canvas.offsetWidth * PX_RATIO,
        h: this.canvas.offsetHeight * PX_RATIO,
        fps: 0,
        bright: this.flags.bright,
        di: this.config.explicit.DENSE_INVERSE,
      });
  }
  drawLines = {
    scanFrame: 0,
    scanU: window.innerHeight,
    scanD: window.innerHeight * 1.5,
    payload(ctx) {
      ctx.strokeStyle = null;
      ctx.lineWidth = 1;
      let connectionArray = [];
      if (this.scanFrame >= 36 && this.scanFrame <= 86) {
        console.log("Drawing connection frame");
        for (let k = 0; k < numStars; k++) {
          if (starArray[k].y >= this.scanU && starArray[k].y <= this.scanD) {
            connectionArray.push(starArray[k]);
            if (starArray[k].y >= (this.scanU + this.scanD) / 2)
              starArray[k].display = true;
          }
        }
        for (let x = 0; x < connectionArray.length; x++) {
          for (let y = 0; y < connectionArray.length; y++) {
            if (y !== x && y <= 6) {
              let startPoint = connectionArray[x];
              let endPoint = connectionArray[y];
              let lineAlpha =
                window.innerHeight /
                1e3 /
                Math.abs(startPoint.y - (this.scanU + this.scanD) / 2);
              ctx.beginPath();
              ctx.globalAlpha = lineAlpha;
              ctx.strokeStyle = `rgb(255, 255, 255)`;
              ctx.moveTo(startPoint.x, startPoint.yDist);
              ctx.lineTo(endPoint.x, endPoint.yDist);
              ctx.stroke();
            }
          }
        }
        this.scanU -= window.innerHeight / 32;
        this.scanD -= window.innerHeight / 32;
        ctx.globalAlpha = 1;
      }
      if (this.scanFrame <= Number.MAX_SAFE_INTEGER) this.scanFrame++;
    },
    payloadScorpius(ctx) {
      ctx.strokeStyle = null;
      ctx.lineWidth = null;
      let starA, starB;
      for (let s = 0; s < scorpius.stars.length; s++) {
        if (scorpius.stars[s].lineTo) {
          starA = {
            x:
              scorpius.spec.center.x +
              scorpius.stars[s].dx * scorpius.spec.scale.k,
            y:
              scorpius.spec.center.y -
              scorpius.stars[s].dy * scorpius.spec.scale.k,
          };
          starB = {
            x:
              scorpius.spec.center.x +
              scorpius.stars[scorpius.stars[s].lineTo].dx *
              scorpius.spec.scale.k,
            y:
              scorpius.spec.center.y -
              scorpius.stars[scorpius.stars[s].lineTo].dy *
              scorpius.spec.scale.k,
          };
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.1})`;
          ctx.lineWidth = scorpius.stars[s].radius * 0.5;
          ctx.moveTo(starA.x, starA.y);
          ctx.lineTo(starB.x, starB.y);
          ctx.stroke();
          ctx.lineWidth = null;
        }
      }
    },
  };
}
