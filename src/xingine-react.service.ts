import axios from "axios";
import { Decoder, object, record, string, either } from "decoders";
import { Err, Ok, Result } from "@hqoss/monads";
import  { GenericErrors } from "xingine";

// Local decoder for GenericErrors since it's not exported from main package
const genericErrorsDecoder: Decoder<GenericErrors> = record(
  either(string, record(string)),
);

const token = localStorage.getItem("token");

if (token) {
  axios.defaults.headers.Authorization = `Token ${token}`;
}

axios.defaults.baseURL = "/api";


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
