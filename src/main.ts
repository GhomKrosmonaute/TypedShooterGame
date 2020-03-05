
import './style.css'
import p5 from 'p5';
import App from './Shooter/App';

document.addEventListener('DOMContentLoaded', ()=>{
    new p5((p: p5) => {

        class Sketch {

            private app:App
            private p:p5 = p

            constructor() {
                this.p.createCanvas(this.p.windowWidth, this.p.windowHeight)
                this.app = new App(p)
            }

            public draw() {
                this.app.step()
                this.app.draw()
            }

            public keyPressed(){
                this.app.keyPressed(this.p.key)
            }

            public keyReleased(){
                this.app.keyReleased(this.p.key)
            }

            public windowResized(){
                this.p.resizeCanvas(this.p.windowWidth,this.p.windowHeight)
            }

        }

        let sketch

        p.setup = ()=>{
            sketch = new Sketch()
        }
         p.setup()

    })
})




