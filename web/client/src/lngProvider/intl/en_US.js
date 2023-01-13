import enMessages from "../locales/en_US.json";
import { createIntl, createIntlCache } from "react-intl";

// const EnLang = {
//     messages: {
//         ...enMessages,
//     },
//     locale: "en-US",
// };
// export default EnLang;

const cache = createIntlCache();

const enLang = createIntl(
    {
        // Locale of the application
        locale: "en-US",
        messages: {
            ...enMessages,
        },
    },
    cache
);

export default enLang;
