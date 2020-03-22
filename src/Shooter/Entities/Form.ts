import Zone from './Zone';
import {InputOptions} from '../../interfaces';
import Input from './Input';
import p5 from 'p5';
import App from '../App';

export default class Form extends Zone {

    public inputs:Input[] = []
    public p:p5

    constructor(
        public app:App,
        x1:number,
        y1:number,
        x2:number,
        y2:number,
        inputs:InputOptions[],
        toCenter:boolean = false
    ) {
        super(x1,y1,x2,y2,toCenter)
        this.p = app.p
        inputs.forEach( (input, index) => {
            const position = this.fraction(.1, ((1/inputs.length))*index + 1/(inputs.length*2))
            const size = this.fraction(.8, (1/inputs.length) * .7)
            this.inputs.push( new Input( app,
                position.x, position.y,
                size.x, size.y,
                true, input
            ))
        })
    }

    draw(){
        this.inputs.forEach( input => input.draw() )
    }

    keyPressed( key:string ){
        this.inputs.forEach( input => input.keyPressed(key) )
    }

    mousePressed(){
        for(const input of this.inputs){
            if(input.touchVector(this.app.mouse))
                input.focus = true
            else input.focus = false
        }
    }

}