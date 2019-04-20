const width = 10;
const height = 20 + 2;

const app = new Vue({
    el: '#app',
    data: {
        field: [],
        score: 0,
        lines: 0,
    },
    methods: {
        init: function () {
            this.field = [...Array(height)].map(() => [...Array(width)].map(() => {
                return { class: 'empty', isPlaced: false }
            }))
            this.score = 0
            this.lines = 0
            this.endGame = false
            this.nextTetriminos = []
            this.popTetrimino()
            this.render()
        },
        popTetrimino: function () {
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
            if (this.endGame) return

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
                    continue
                }
                new_field.push(this.field[i])
            }
            this.lines += erasedLines
            this.score += [0, 40, 100, 300, 1200][erasedLines]
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
        },
        moveHorizon: function (toRight) {
            if (this.endGame) return

            x = toRight ? 1 : -1
            this.playerTetrimino.x += x
            if (this.checkCollision(this.playerTetrimino)) {
                this.playerTetrimino.x -= x
            }
            this.render()
        },
        rotate: function () {
            if (this.endGame) return

            this.playerTetrimino.rotate(1)
            if (this.checkCollision(this.playerTetrimino)) {
                this.playerTetrimino.rotate(-1)
            }
            this.render()
        },
        checkCollision: function () {
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
});

const keyMap = {
    27: app.init, // ESC
    38: app.rotate, // up
    37: () => app.moveHorizon(false), // left
    39: () => app.moveHorizon(true), // right
    40: app.moveDown, // down
}

document.body.onkeydown = e => keyMap[e.keyCode]()

app.init()
setInterval(() => app.moveDown(), 500);
