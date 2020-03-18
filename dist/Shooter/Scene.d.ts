import App from './App';
import p5 from 'p5';
export default abstract class Scene {
    app: App;
    abstract draw(): Promise<void> | void;
    abstract step(): Promise<void> | void;
    p: p5;
    constructor(app: App);
}
