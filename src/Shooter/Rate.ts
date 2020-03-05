
export default class Rate {

    private triggerTime = Date.now()

    constructor(
        private interval:number
    ){}

    public canTrigger( trigger:boolean = false ): boolean {
        const can = Date.now() > this.triggerTime + this.interval
        if(can) if(trigger) this.trigger()
        return can
    }

    public trigger(): void {
        this.triggerTime = Date.now()
    }

}
