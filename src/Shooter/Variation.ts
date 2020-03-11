
export default class Variation {

    public value = 0
    private sens = false

    constructor(
        private min:number,
        private max:number,
        private speed:number
    ) {}

    public step(): number {
        if(this.sens){
            if(this.value < 1)
                this.value += this.speed
            else this.sens = false
        }else{
            if(this.value > -1)
                this.value -= this.speed
            else this.sens = true
        }
        return this.value
    }

}
