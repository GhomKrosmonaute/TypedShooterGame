import {ColorResolvable, RGB} from '../../interfaces';
import p5 from 'p5';
import { map } from '../../utils';

export default class Color {

    public r:number
    public g:number
    public b:number
    public a = 255

    public readonly isNaC:boolean

    constructor( private p:p5, resolvable:ColorResolvable ) {
        const rgb = Color.resolve(p,resolvable)
        this.isNaC = !!rgb
        if(rgb){
            this.r = rgb[0]
            this.g = rgb[1]
            this.b = rgb[2]
        }
    }

    get rgb(): RGB {
        return [this.r,this.g,this.b]
    }
    get hex(): string {
        return Color.rgbToHex(this.rgb)
    }

    fusion( resolvable:ColorResolvable, proportion:number ): Color {
        const color = new Color(this.p,resolvable)
        return new Color(this.p,this.rgb.map((c,i)=>{
            return map(proportion,0,1,c,color.rgb[i])
        }) as RGB)
    }

    static resolve( p:p5, resolvable:ColorResolvable ): RGB|false {
        if(!resolvable) return false;
        if(typeof resolvable === "string"){
            let rgb = Color.hexToRgb(resolvable)
            if(rgb) return rgb
        }else if(Array.isArray(resolvable)){
            let rgb = resolvable.filter(c=>{
                return !isNaN(c) && c>=0 && c<=255
            }) as RGB
            return rgb
        }else if(resolvable instanceof Color){
            return resolvable.rgb
        }else{
            return [
                p.red(resolvable),
                p.green(resolvable),
                p.blue(resolvable)
            ]
        }
        return false
    }

    public static rgbToHex( rgb:RGB ): string {
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
    }
    public static hexToRgb( hex:string ): RGB {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null
    }

}