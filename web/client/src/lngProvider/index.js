import enLang from "./intl/en_US";
import moment from "moment";
import { cookie } from "util/Cookies";

const messages = {
    en: enLang,
};

const AppLocale = {
    preferred: () => {
        var language = cookie.get("Language");
        var translation;
        // console.log(language)

        if (language) {
            translation = messages[language.toLowerCase()];
        } else {
            var locale = moment.locale();
            translation = messages[locale];
        }

        // use en as default
        return translation || messages["en"];
    },
};

export default AppLocale;
