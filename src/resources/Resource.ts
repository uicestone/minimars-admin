import { AxiosInstance } from "axios";
import { Model } from "./interfaces";
import injectUriParams from "./injectUriParams";

export default class Resource<T extends Model> {
  constructor(public http: AxiosInstance, public uri: string) {}

  query(
    paramsInput: Record<string, any> = {}
  ): Promise<T[] & { $headers: Record<string, string> }> {
    const { uri, params } = injectUriParams(this.uri, paramsInput);
    return this.http.get(uri, { params });
  }

  create(body: Partial<T>, paramsInput: Record<string, any> = {}): Promise<T> {
    const { uri, params } = injectUriParams(this.uri, paramsInput);
    return this.http.post(uri, body, {
      params
    });
  }

  update(paramsInput: Record<string, any>, body: Partial<T>): Promise<T> {
    const { uri, params } = injectUriParams(this.uri, paramsInput);
    return this.http.put(uri, body, { params });
  }

  get(paramsInput: Record<string, any>): Promise<T> {
    const { uri, params } = injectUriParams(this.uri, paramsInput);
    return this.http.get(uri, { params });
  }

  delete(paramsInput: Record<string, any>): Promise<T> {
    const { uri, params } = injectUriParams(this.uri, paramsInput);
    return this.http.delete(uri, { params });
  }

  save(body: Partial<T>, params: Record<string, any> = {}): Promise<T> {
    if (body.id) {
      return this.update(params, body);
    } else {
      return this.create(body, params);
    }
  }
}
