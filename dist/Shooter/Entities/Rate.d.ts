export default class Rate {
    interval: number;
    private triggerTime;
    constructor(interval: number);
    canTrigger(trigger?: boolean): boolean;
    trigger(): void;
}
