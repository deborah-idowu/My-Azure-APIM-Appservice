export class HttpClient {
    get = async (url) => {
        try {
            let req = await this._createRequest("GET");
            return await this._processRequest(req, url);
        } catch (e) {
            console.error(e);
        }
    };

    delete = async (url) => {
        try {
            let req = await this._createRequest("DELETE");
            return await this._processRequest(req, url);
        } catch (e) {
            console.error(e);
        }
    };

    post = async (url, body, contentType) => {
        try {
            let req = await this._createRequest("POST", body, contentType);
            return await this._processRequest(req, url);
        } catch (e) {
            console.error(e);
        }
    };

    // pass url in with leading forward slash
    generateUrl = async (url) => {
        return url;
    };

    _processRequest = async (req, url) => {
        let resp = await fetch(await this.generateUrl(url), req);
        return resp;
    };

    _createRequest = async (method, body, contentType) => {
        let requestObj = {
            method,
        };

        // if body is not formdata, then set content type to application/json
        if (body) {
            if (body instanceof FormData === false) {
                requestObj.body = JSON.stringify(body);

                requestObj["headers"] = new Headers({
                    "content-type":
                        contentType || "application/json; charset=utf-8",
                });
            } else {
                requestObj.body = body;
            }
        }

        return requestObj;
    };

    _validateResponse = async (r) => {
        // TODO check for different error types (eg 500, 401, 403)
        if (!r.ok) {
            console.error(r.body);
        }
    };
}

const httpClient = new HttpClient();

export default httpClient;
