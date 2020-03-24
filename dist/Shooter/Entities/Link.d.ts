import Zone from './Zone';
import { LinkOptions, SceneName } from '../../interfaces';
import p5 from 'p5';
import Scene from './Scene';
export default class Link extends Zone {
    scene: Scene;
    targetName: SceneName;
    lastScene: Scene;
    resetNew: boolean;
    resetOld: boolean;
    text?: string;
    p: p5;
    constructor(scene: Scene, x: number, y: number, options: LinkOptions);
    draw(): void;
    mousePressed(): void;
}
