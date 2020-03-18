import App from './App';
import p5 from 'p5';

export default abstract class Scene {

    public abstract draw(): Promise<void>|void
    public abstract step(): Promise<void>|void

    public p:p5

    constructor( public app:App ) {
        this.p = app.p
    }

}