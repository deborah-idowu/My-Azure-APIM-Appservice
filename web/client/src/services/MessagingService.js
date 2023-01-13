import httpClient from "./HttpClient";

export class MessagingService {

    async sendMessage(input) {
        var body = {
            value: input,
        };

        var response = await httpClient.get(`/api/messages`, body);

        return await response.json();
    }
}

const messagingService = new MessagingService();

export default messagingService;
