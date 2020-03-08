
import './style.css'
import p5 from 'p5';
import App from './Shooter/App';

function sketch( p:p5 ){

    let app:App = null

    p.setup = () => {
        p.createCanvas(p.windowWidth,p.windowHeight)
        app = new App(p)
    }

    p.draw = () => {
        if(!app) return
        app.step()
        app.draw()
    }

    p.keyPressed = () => {
        if(!app) return
        app.keyPressed(p.key)
    }

    p.keyReleased = () => {
        if(!app) return
        app.keyReleased(p.key)
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth,p.windowHeight)
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new p5( sketch, document.getElementById('p5') )
})




