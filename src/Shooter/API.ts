
import axios from 'axios';
import {baseURL} from '../config';
import qs from "querystring";

export default class API {

    constructor( private apiToken:string ) {}

    get( route:string ): Promise<any> {
        return new Promise((resolve,reject) => {
            axios.get('/'+route,{
                baseURL, headers: { Authorization: 'Bearer ' + this.apiToken }
            })
                .then( res => res.status === 200 ? resolve(res.data) : reject(res.status))
                .catch(reject)
        })
    }

    patch(route:string, data:{[key:string]:string|boolean|number} ): Promise<void> {
        return new Promise((resolve,reject) => {
            axios.patch('/'+route, qs.stringify(data),{
                baseURL, headers: { Authorization: 'Bearer ' + this.apiToken }
            })
                .then( res => res.status === 200 ? resolve() : reject(res.status))
                .catch(reject)
        })
    }

    save( key:string, value:any ): void {
        const storage = JSON.parse(localStorage.getItem('shooter'))
        storage[key] = value
        localStorage.setItem('shooter',JSON.stringify(storage))
    }

    load( key:string ): any {
        return JSON.parse(localStorage.getItem('shooter'))[key]
    }

}