const Constants = require("../constants/Constants");
const { rootApiUrl } = require("util/Config.json");

export class HttpClient {
    get = async (endpoint, key) => {
        try {
            let req = await this._createRequest("GET");
            return await this._processRequest(req, endpoint, key);
            
        } catch (e) {
            console.error(e);
            return this._wrapResponse(
                Constants.customErrorMessage(e.message),
                false
            );
        }
    };

    delete = async (endpoint, key) => {
        try {
            let req = await this._createRequest("DELETE");
            return await this._processRequest(req, endpoint, key);
        } catch (e) {
            console.error(e);
            return this._wrapResponse(
                Constants.customErrorMessage(e.message),
                false
            );
        }
    };

    post = async (endpoint, body, contentType, key) => {
        try {
            let req = await this._createRequest("POST", body, contentType);
            return await this._processRequest(req, endpoint, key);
        } catch (e) {
            console.error(e);
            return this._wrapResponse(
                Constants.customErrorMessage(e.message),
                false
            );
        }
    };

    // pass in url - if it is an absolute URL (tested by regex), then treat as anonymous
    // TODO develop a more robust solution/allow for constructing non-anonymous API calls
    generateUrl = async (endpoint, key) => {
        var fullUrl = `${rootApiUrl}/${endpoint}`;
        if (key !== "") {
            fullUrl = fullUrl + `?subscription-key=${key}`;
        }
        return fullUrl;
    };

    _processRequest = async (req, endpoint, key) => {
        try {
            let resp = await fetch(await this.generateUrl(endpoint, key), req);
            resp = await resp;
            let isValid = await this._validateResponse(resp);

            return this._wrapResponse(await resp.json(), isValid);
        } catch (e) {
            // return this._wrapResponse(JSON.stringify(e), false);
            return this._wrapResponse(
                Constants.customErrorMessage(e.message),
                false
            );
        }
    };

    // TODO add put verb method
    // TODO set authorization header

    _createRequest = async (method, body, contentType) => {
        let requestObj = {
            method,
        };

        requestObj.body = JSON.stringify(body);
        requestObj["headers"] = {
            "content-type": contentType || "application/json; charset=utf-8",
        };

        return requestObj;
    };

    // augment response with additional attributes
    _wrapResponse = async (resp, isSuccessful) => {
        // if not successful, format return value for client
        if (!isSuccessful) {
            try {
                // API will return a failure 'message' property
                if ("message" in resp) {
                    resp = { value: resp["message"] };
                }
                // else {
                //     resp = Constants.customErrorMessage(e.message);
                // }
            } catch (e) {
                console.error(e);
                resp = Constants.customErrorMessage(e.message);
            }
        }

        return {
            ...resp,
            ok: isSuccessful,
        };
    };

    _validateResponse = async (r) => {
        // TODO check for different error types (eg 500, 401, 403)
        if (!r.ok) {
            console.error(r.body);
            return false;
        } else {
            return true;
        }
    };
}

const httpClient = new HttpClient();

export default httpClient;
