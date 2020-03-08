export default class Rate {
    private interval;
    private triggerTime;
    constructor(interval: number);
    canTrigger(trigger?: boolean): boolean;
    trigger(): void;
}
