import httpClient from "./HttpClient";

export class ApiService {
    async get(endpoint, key) {

        // TODO transform endpoint
        var response = await httpClient.get(endpoint, key);

        try {
            return await response.json();
        } catch {
            return response;
        }
    }
}

const apiService = new ApiService();

export default apiService;
