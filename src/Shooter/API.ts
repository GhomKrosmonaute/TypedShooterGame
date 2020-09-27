import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { baseURL, siteKey } from "../config"
import qs from "querystring"

export default class API {
  private readonly config: AxiosRequestConfig

  constructor(private apiToken: string) {
    this.config = {
      baseURL,
      headers: {
        Authorization: "Bearer " + this.apiToken,
        "Access-Control-Allow-Origin": "*",
      },
    }
  }

  get<T>(route: string, params: {} = {}): Promise<T> {
    return axios.get(route, { ...this.config, params }).then((res) => res.data)
  }

  async post(route: string, data: any): Promise<AxiosResponse> {
    data.token = await grecaptcha.execute(siteKey, { action: "homepage" })
    return axios.post(route, qs.stringify(data), this.config)
  }

  async patch(route: string, data: any): Promise<AxiosResponse> {
    data.token = await grecaptcha.execute(siteKey, { action: "homepage" })
    return axios.patch(route, qs.stringify(data), this.config)
  }

  delete(route: string): Promise<AxiosResponse> {
    return axios.delete(route, this.config)
  }
}
