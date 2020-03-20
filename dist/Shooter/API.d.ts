export default class API {
    private apiToken;
    constructor(apiToken: string);
    get(route: string): Promise<any>;
    patch(route: string, data: {
        [key: string]: string | boolean | number;
    }): Promise<void>;
    save(key: string, value: any): void;
    load(key: string): any;
}
