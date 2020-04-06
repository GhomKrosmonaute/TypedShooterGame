
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {baseURL, siteKey} from '../config';
import qs from "querystring";

export default class API {

    private readonly config:AxiosRequestConfig

    constructor( private apiToken:string ) {
        this.config = {
            baseURL, headers: {
                Authorization: 'Bearer ' + this.apiToken,
                'Access-Control-Allow-Origin': '*'
            }
        }
    }

    get<T>( route:string ): Promise<T> {
        return axios.get(route,this.config )
            .then( (res) => res.data )
    }

    async post( route:string, data:any ): Promise<AxiosResponse> {
        data.token = await grecaptcha.execute(siteKey, { action: 'homepage' })
        return axios.post(route, qs.stringify(data),this.config)
    }

    async patch( route:string, data:any ): Promise<AxiosResponse> {
        data.token = await grecaptcha.execute(siteKey, { action: 'homepage' })
        return axios.patch(route, qs.stringify(data),this.config)
    }

    delete( route:string ): Promise<AxiosResponse> {
        return axios.delete(route, this.config)
    }

    save( key:string, value:any ): void {
        const storage = JSON.parse(localStorage.getItem('shooter'))
        storage[key] = value
        localStorage.setItem('shooter',JSON.stringify(storage))
    }

    load<T>( key:string ): T {
        return JSON.parse(localStorage.getItem('shooter'))[key]
    }

}