import httpClient from "./HttpClient";
import { endpoints } from "constants/Constants";
const { functionEndpoint, webApiEndpoint } = require("util/Config.json");

export class ApiService {
    async get(selectedEndpoint, key) {
        // transform endpoint
        let configEndpoint;
        if (selectedEndpoint === endpoints.function) {
            configEndpoint = functionEndpoint;
        } else if (selectedEndpoint === endpoints.webApi) {
            configEndpoint = webApiEndpoint;
        }

        var response = await httpClient.get(configEndpoint, key);

        try {
            return await response.json();
        } catch {
            return response;
        }
    }
}

const apiService = new ApiService();

export default apiService;
