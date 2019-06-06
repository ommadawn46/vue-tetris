<template>
  <div class="tetris">
    <div class="field">
      <div v-for="(line, index) in field.slice(2)" class="line" :key="index">
        <div
          v-for="(cell, index) in line"
          class="cell"
          v-bind:class="[cell.class, {placed: cell.isPlaced}]"
          :key="index"
        ></div>
      </div>
      <div class="score">Level: {{getLevel()}}</div>
      <div class="score">Lines: {{lines}}</div>
      <div class="score">Score: {{score}}</div>
    </div>
    <div class="next-tetriminos">
      <div v-for="(tetrimino, index) in nextTetriminos.slice(0, 11)" class="tetrimino" :key="index">
        <div v-for="y in 4" class="line" :key="y">
          <div
            v-for="x in 4"
            class="cell small-cell"
            v-bind:class="tetrimino.isBlock(x, y) ? tetrimino.class : 'empty'"
            :key="x"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tetriminos from "./modules/tetrimino";

const width = 10;
const height = 20 + 2;
const levelInterval = [
  1440,
  1260,
  1140,
  960,
  840,
  660,
  540,
  480,
  420,
  360,
  340,
  320,
  300,
  280,
  260,
  240,
  220,
  200,
  180,
  160,
  140,
  120,
  110,
  100,
  90,
  85,
  80,
  75,
  70,
  65,
  60
];

const make_new_line = () =>
  [...Array(width)].map(() => {
    return { class: "empty", isPlaced: false };
  });

export default {
  data: () => {
    return {
      field: [],
      score: 0,
      lines: 0,
      nextTetriminos: []
    };
  },
  methods: {
    init: function() {
      // ゲームを初期化
      this.field = [...Array(height)].map(make_new_line);
      this.score = 0;
      this.lines = 0;
      this.nextTetriminos = [];
      this.endGame = false;
      this.popTetrimino();
      this.moveDown();
    },
    getLevel: function() {
      // 消したライン数から現在のレベルを計算
      const level = Math.floor(this.lines / 10);
      if (level >= 30) return 30;
      return level;
    },
    popTetrimino: function() {
      // 新しいテトリミノをポップ
      while (this.nextTetriminos.length < 12) {
        this.nextTetriminos = this.nextTetriminos.concat(
          Tetriminos.concat(Tetriminos)
            .sort(() => Math.random() - 0.5)
            .map(tetrimino => new tetrimino(width / 2, 0))
        );
      }
      this.playerTetrimino = this.nextTetriminos.shift();
      if (this.checkCollision()) {
        this.endGame = true;
      }
    },
    moveDown: function() {
      // 操作中のテトリミノを下方向に移動
      if (this.endGame) return;
      if (this.timer) clearTimeout(this.timer);

      let doPopTetrimino = false;
      this.playerTetrimino.y++;
      if (this.checkCollision()) {
        this.playerTetrimino.y--;
        this.playerTetrimino.getPoints().forEach(p => {
          this.field[p.y][p.x].isPlaced = true;
        });
        doPopTetrimino = true;
      }
      let erasedLines = 0;
      const new_field = [];
      for (let i = 0; i < this.field.length; i++) {
        if (this.field[i].every(cell => cell.isPlaced)) {
          erasedLines++;
        } else {
          new_field.push(this.field[i]);
        }
      }
      this.lines += erasedLines;
      this.score +=
        [0, 40, 100, 300, 1200][erasedLines] * (this.getLevel() + 1);
      while (new_field.length < height) {
        new_field.unshift(make_new_line());
      }
      this.field = new_field;
      if (doPopTetrimino) {
        this.popTetrimino();
      }
      this.render();
      this.timer = setTimeout(this.moveDown, levelInterval[this.getLevel()]);
    },
    moveHorizon: function(toRight) {
      // 操作中のテトリミノを左右に移動
      if (this.endGame) return;

      const x = toRight ? 1 : -1;
      this.playerTetrimino.x += x;
      if (this.checkCollision(this.playerTetrimino)) {
        this.playerTetrimino.x -= x;
      }
      this.render();
    },
    rotate: function() {
      // 操作中のテトリミノを回転
      if (this.endGame) return;

      this.playerTetrimino.rotate(1);
      if (this.checkCollision(this.playerTetrimino)) {
        this.playerTetrimino.rotate(-1);
      }
      this.render();
    },
    checkCollision: function() {
      // 操作中のテトリミノが衝突していないかチェック
      const points = this.playerTetrimino.getPoints();
      for (let i = 0; i < points.length; i++) {
        const line = this.field[points[i].y];
        if (!line) {
          return true;
        }
        const cell = line[points[i].x];
        if (!cell || cell.isPlaced) {
          return true;
        }
      }
      return false;
    },
    render: function() {
      // 描画
      const new_field = this.field.map(line =>
        line.map(cell => {
          if (!cell.isPlaced) {
            cell.class = "empty";
          }
          return cell;
        })
      );
      this.playerTetrimino.getPoints().forEach(p => {
        new_field[p.y][p.x].class = this.playerTetrimino.class;
      });
      this.field = new_field;
    }
  }
};
</script>

<style scoped>
.tetris {
  display: inline-block;
}

.field {
  float: left;
}

.line {
  overflow: hidden;
}

.cell {
  width: 30px;
  height: 30px;
  border: var(--main-bg-color) solid thin;
  float: left;
}

.cell.placed {
  border: var(--main-bg-color) dashed thin;
}

.cell.empty {
  background-color: var(--cell-bg-color);
}

.cell.I {
  background-color: #30c5ff;
}

.cell.O {
  background-color: #f3e37c;
}

.cell.T {
  background-color: #53599a;
}

.cell.J {
  background-color: #3066be;
}

.cell.L {
  background-color: #ee8434;
}

.cell.S {
  background-color: #29bf12;
}

.cell.Z {
  background-color: #f03a47;
}

.score {
  font-size: 25px;
  color: var(--cell-bg-color);
  font-family: "VT323", monospace;
}

.next-tetriminos {
  float: right;
}

.tetrimino {
  margin: 10px;
}

.cell.small-cell {
  width: 10px;
  height: 10px;
  border: var(--main-bg-color) solid thin;
}

.small-cell.empty {
  background-color: #c7c9c9;
}
</style>
