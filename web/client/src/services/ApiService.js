import httpClient from "./HttpClient";

export class ApiService {

    async sendMessage(input) {
        var body = {
            value: input,
        };

        var response = await httpClient.get(`/api/messages`, body);

        return await response.json();
    }
}

const apiService = new ApiService();

export default apiService;
