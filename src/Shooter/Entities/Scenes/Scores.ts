

import Scene from '../Scene';
import App from '../../App';
import Zone from '../Zone';
import Rate from '../Rate';
import Animation from '../Animation';

export default class Scores extends Scene {

    public animations:Animation[]
    public rate = new Rate(25)
    public time = 0

    constructor( app:App ) {
        super(app)
        this.reset()
    }

    reset(){
    }

    draw() {
    }

    step() {

    }

    keyPressed(key: string) {

    }

    mousePressed(): any {
    }

}