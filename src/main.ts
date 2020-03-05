
import './style.css'
import p5 from 'p5';
import App from './Shooter/App';

let app:App

function sketch( p:p5 ){

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

}

document.addEventListener('DOMContentLoaded', () => {
    new p5( sketch, document.getElementById('p5') )
})




