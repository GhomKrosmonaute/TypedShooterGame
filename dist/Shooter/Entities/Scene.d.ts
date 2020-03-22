import App from '../App';
import p5 from 'p5';
export default abstract class Scene {
    app: App;
    abstract reset(): any;
    abstract draw(): any;
    abstract step(): any;
    abstract keyPressed(key: string): any;
    abstract mousePressed(): any;
    p: p5;
    protected constructor(app: App);
    protected drawAnimations(): void;
}
