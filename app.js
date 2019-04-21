const width = 10
const height = 20 + 2
const levelInterval = [1440, 1260, 1140, 960, 840, 660, 540, 480, 420, 360, 340, 320, 300, 280, 260, 240, 220, 200, 180, 160, 140, 120, 110, 100, 90, 85, 80, 75, 70, 65, 60]

const app = new Vue({
    el: '#app',
    data: {
        field: [],
        score: 0,
        lines: 0,
        nextTetriminos: [],
    },
    methods: {
        init: function () {
            // ゲームを初期化
            this.field = [...Array(height)].map(() => [...Array(width)].map(() => {
                return { class: 'empty', isPlaced: false }
            }))
            this.score = 0
            this.lines = 0
            this.nextTetriminos = []
            this.endGame = false
            this.popTetrimino()
            this.moveDown()
        },
        getLevel: function () {
            // 消したライン数から現在のレベルを計算
            const level = Math.floor(this.lines / 10)
            if (level >= 30) return 30
            return level
        },
        popTetrimino: function () {
            // 新しいテトリミノをポップ
            while (this.nextTetriminos.length < 12) {
                this.nextTetriminos = this.nextTetriminos.concat(
                    TETRIMINOS.concat(TETRIMINOS).sort(() => Math.random() - 0.5).map(
                        tetrimino => new tetrimino(width / 2, 0)
                    )
                )
            }
            this.playerTetrimino = this.nextTetriminos.shift()
            if (this.checkCollision()) {
                this.endGame = true
            }
        },
        moveDown: function () {
            // 操作中のテトリミノを下方向に移動
            if (this.endGame) return
            if (this.timer) clearTimeout(this.timer)

            let doPopTetrimino = false
            this.playerTetrimino.y++
            if (this.checkCollision()) {
                this.playerTetrimino.y--
                this.playerTetrimino.getPoints().forEach(p => {
                    this.field[p.y][p.x].isPlaced = true
                })
                doPopTetrimino = true
            }
            let erasedLines = 0
            const new_field = []
            for (let i = 0; i < this.field.length; i++) {
                if (this.field[i].every(cell => cell.isPlaced)) {
                    erasedLines++
                } else {
                    new_field.push(this.field[i])
                }
            }
            this.lines += erasedLines
            this.score += [0, 40, 100, 300, 1200][erasedLines] * (this.getLevel() + 1)
            while (new_field.length < height) {
                new_field.unshift([...Array(width)].map(() => {
                    return { class: 'empty', isPlaced: false }
                }))
            }
            this.field = new_field
            if (doPopTetrimino) {
                this.popTetrimino()
            }
            this.render()
            this.timer = setTimeout(
                this.moveDown,
                levelInterval[this.getLevel()],
            )
        },
        moveHorizon: function (toRight) {
            // 操作中のテトリミノを左右に移動
            if (this.endGame) return

            x = toRight ? 1 : -1
            this.playerTetrimino.x += x
            if (this.checkCollision(this.playerTetrimino)) {
                this.playerTetrimino.x -= x
            }
            this.render()
        },
        rotate: function () {
            // 操作中のテトリミノを回転
            if (this.endGame) return

            this.playerTetrimino.rotate(1)
            if (this.checkCollision(this.playerTetrimino)) {
                this.playerTetrimino.rotate(-1)
            }
            this.render()
        },
        checkCollision: function () {
            // 操作中のテトリミノが衝突していないかチェック
            const points = this.playerTetrimino.getPoints()
            for (let i = 0; i < points.length; i++) {
                const row = this.field[points[i].y]
                if (!row) {
                    return true
                }
                const cell = row[points[i].x]
                if (!cell || cell.isPlaced) {
                    return true
                }
            }
            return false
        },
        render: function () {
            // 描画
            const new_field = this.field.map(row => row.map(cell => {
                if (!cell.isPlaced) {
                    cell.class = 'empty'
                }
                return cell
            }))
            this.playerTetrimino.getPoints().forEach(p => {
                new_field[p.y][p.x].class = this.playerTetrimino.class
            })
            this.field = new_field
        },
    }
})

document.body.onkeydown = e => {
    if ([27].includes(e.keyCode)) { // ESC
        app.init()
    } else if ([38, 87].includes(e.keyCode)) { // UP, W
        app.rotate()
    } else if ([37, 65].includes(e.keyCode)) { // LEFT, A
        app.moveHorizon(false)
    } else if ([39, 68].includes(e.keyCode)) { // RIGHT, D
        app.moveHorizon(true)
    } else if ([40, 83].includes(e.keyCode)) { // DOWN, S
        app.moveDown()
    }
}

app.init()
