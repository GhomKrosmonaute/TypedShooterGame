import App from '../App';
import p5 from 'p5';
export default abstract class Scene {
    app: App;
    abstract draw(): any;
    abstract step(): any;
    abstract keyPressed(key: string): any;
    p: p5;
    constructor(app: App);
    protected drawAnimations(): void;
}
