const width = 10;
const height = 20;

const app = new Vue({
    el: '#app',
    data: {
        field: []
    },
    methods: {
        init: function() {
            this.field = [...Array(height)].map(() => [...Array(width)].map(() => {
                return { class: 'empty', placed: false }
            }))
            this.endGame = false
            this.nextTetriminos = []
            this.popTetrimino()
            this.render()
        },
        popTetrimino: function() {
            while (this.nextTetriminos.length < 10) {
                this.nextTetriminos = this.nextTetriminos.concat(
                    TETRIMINOS.concat(TETRIMINOS).sort(() => Math.random() - 0.5)
                )
            }
            const ChoisedTetrimino = this.nextTetriminos.pop()
            this.playerTetrimino = new ChoisedTetrimino(width / 2, 0)
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
                    this.field[p.y][p.x].placed = true
                })
                doPopTetrimino = true
            }
            const new_field = []
            for (let i = 0; i < this.field.length; i++) {
                if (this.field[i].every(cell => cell.placed)) {
                    continue
                }
                new_field.push(this.field[i])
            }
            while (new_field.length < height) {
                new_field.unshift([...Array(width)].map(() => {
                    return { class: 'empty', placed: false }
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
                if (!cell || cell.placed) {
                    return true
                }
            }
            return false
        },
        render: function () {
            const new_field = this.field.map(row => row.map(cell => {
                if (!cell.placed) {
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
