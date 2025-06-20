import { FC } from "react";
import {
  getModuleRegistryService,
  initializeModuleRegistry,
} from "./xingine-react.registry";
import { XingineConfig } from "./configuration/Configuration";
import axios from "axios";
import { Decoder, object } from "decoders";
import { Err, Ok, Result } from "@hqoss/monads";
import  { GenericErrors,ModuleProperties,genericErrorsDecoder } from "xingine";
import {getDefaultInternalComponents} from "./component/group";

const token = localStorage.getItem("token");

if (token) {
  axios.defaults.headers.Authorization = `Token ${token}`;
}

axios.defaults.baseURL = "/api";

export function registerModule(
  config: XingineConfig,
  modules: ModuleProperties[],
) {
  const combinedComponentRegistry = {
    ...(getDefaultInternalComponents() as Record<string, FC<unknown>>),
    ...(config.component || {}),
  };
  initializeModuleRegistry(combinedComponentRegistry);
  modules.forEach((def) => {
    getModuleRegistryService()!.register(def);
  });
}

export async function post<T, U>(
  form: T,
  decoder: Decoder<U>,
  uri: string,
): Promise<Result<U, GenericErrors>> {
  try {
    const { data } = await axios.post(uri, form);
    console.log("the data", data);
    return Ok(decoder.verify(data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = object({ errors: genericErrorsDecoder }).verify(
        error.response?.data,
      ).errors;
      return Err<U, GenericErrors>(err);
    } else {
      return Err<U, GenericErrors>({err:String(error)});
    }
  }
}

export async function get<U>(decoder: Decoder<U>, uri: string): Promise<U> {
  const { data } = await axios.get(uri);
  return decoder.verify(data);
}
