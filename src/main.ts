
import './style.css'
import p5 from 'p5';
import App from './Shooter/App';

new p5((p: p5) => {

    let app:App

    p.setup = () => {
        p.createCanvas(p.windowWidth,p.windowHeight)
        app = new App(p)
    }

    p.draw = () => {
        app.step()
        app.draw()
    }

    p.keyPressed = () => {
        app.keyPressed(p.key)
    }

    p.keyReleased = () => {
        app.keyReleased(p.key)
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth,p.windowHeight)
    }

})


