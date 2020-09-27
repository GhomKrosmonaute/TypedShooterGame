import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { baseURL, siteKey } from "../config"
import qs from "querystring"

export default class Storage {
  constructor(private name: string = "shooter") {}

  save(key: string, value: any): void {
    const storage = JSON.parse(localStorage.getItem(this.name))
    storage[key] = value
    localStorage.setItem(this.name, JSON.stringify(storage))
  }

  load<T>(key: string, defaultValue: T): T {
    const storage = JSON.parse(localStorage.getItem(this.name))
    if (storage.hasOwnProperty(key)) {
      return JSON.parse(localStorage.getItem(this.name))[key]
    } else {
      return defaultValue
    }
  }
}
