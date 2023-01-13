import httpClient from "./HttpClient";

export class SignalRService {
    async negotiate() {
        var value = await httpClient.get(`/signalr/negotiate`);
        var body = await value.json();

        return {
            value: body,
        };
    }
}

const signalrService = new SignalRService();

export default signalrService;
