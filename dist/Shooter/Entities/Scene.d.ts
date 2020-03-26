import App from '../App';
import p5 from 'p5';
import Rate from './Rate';
import Animation from './Animation';
import { AnimationOptions } from '../../interfaces';
import Link from './Link';
import Form from './Form';
export default abstract class Scene {
    app: App;
    rate: Rate;
    time: number;
    animations: Animation[];
    links: Link[];
    form?: Form;
    showParticles: boolean;
    abstract reset(): any;
    abstract draw(): any;
    abstract step(): any;
    abstract keyPressed(key: string): any;
    p: p5;
    protected constructor(app: App);
    protected drawAnimations(className?: string): void;
    setAnimation(options: AnimationOptions): void;
    setPopup(text: string): void;
}
