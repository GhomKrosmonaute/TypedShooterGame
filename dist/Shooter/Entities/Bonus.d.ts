import Positionable from './Positionable';
import App from '../App';
import Party from './Scenes/Party';
export default abstract class Bonus extends Positionable {
    party: Party;
    private radiusVariation;
    abstract applyEffect(): void;
    abstract displayName: string;
    abstract description: string;
    abstract id: string;
    used: boolean;
    app: App;
    constructor(party: Party);
    draw(): void;
    step(): void;
    use(): void;
}
