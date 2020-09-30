import { Country } from "@/models/country";
import axios, { AxiosPromise } from "axios";

const BASE_URL = `http://localhost:8082/api/`;

class CountryDataService {
  static getAll(): AxiosPromise<Country[]> {
    return axios.get(`${BASE_URL}/countries`);
  }
}

export default CountryDataService;
