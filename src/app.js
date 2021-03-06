import Vue from 'vue';
import "./css/index.css"
import tetris from "./components/tetris.vue"

const app = new Vue({
    el: "#app",
    components: {
        'tetris': tetris,
    }
});

document.body.onkeydown = e => {
    if ([27].includes(e.keyCode)) {
        // ESC
        app.$refs.tetris.init();
    } else if ([38, 87].includes(e.keyCode)) {
        // UP, W
        app.$refs.tetris.rotate();
    } else if ([37, 65].includes(e.keyCode)) {
        // LEFT, A
        app.$refs.tetris.moveHorizon(false);
    } else if ([39, 68].includes(e.keyCode)) {
        // RIGHT, D
        app.$refs.tetris.moveHorizon(true);
    } else if ([40, 83].includes(e.keyCode)) {
        // DOWN, S
        app.$refs.tetris.moveDown();
    }
};

app.$refs.tetris.init();