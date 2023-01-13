export class CookieUtil {
    // type can be "boolean"
    get = (key, type = null) => {
        var cookie = document.cookie
            .split(";")
            .find((c) =>
                c
                    .trim()
                    .toLocaleLowerCase()
                    .startsWith(key.trim().toLocaleLowerCase())
            );

        if (cookie) {
            var value = cookie.split("=")[1];

            // parse booleans
            if (type !== null) {
                if (type === "boolean") {
                    value = value === "false" ? false : true;
                }
            }

            return value;
        }
    };

    // pass booleans as strings
    set = (key, value, expDays) => {
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + expDays);
        var cookieValue =
            escape(value) +
            (expDays == null ? "" : "; expires=" + expDate.toUTCString());
        document.cookie = key + "=" + cookieValue;
    };
}

export const cookie = new CookieUtil();
export default function cookieUtilExport() {}
