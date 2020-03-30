
export default class Rate {

    public triggerTime = Date.now()

    constructor(
        public interval:number
    ){}

    public get endTime(): number {
        return this.triggerTime + this.interval
    }

    public triggeredForLessThan( time:number ): boolean {
        return Date.now() < this.triggerTime + time
    }

    public triggeredForMoreThan( time:number ): boolean {
        return !this.triggeredForLessThan(time)
    }

    public canTrigger( trigger:boolean = false ): boolean {
        const can = Date.now() > this.triggerTime + this.interval
        if(can) if(trigger) this.trigger()
        return can
    }

    public trigger(): void {
        this.triggerTime = Date.now()
    }

}
