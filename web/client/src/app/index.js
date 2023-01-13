import Home from "./routes/home";
import NotFound from "./routes/notFound";
import Footer from "components/Footer";
import { Routes, Route } from "react-router-dom";
import AppLocale from "../lngProvider";
import { IntlProvider } from "react-intl";
import makeStyles from "@mui/styles/makeStyles";
import { Layout } from "constants/Constants";

const useStyles = makeStyles((theme) => ({
    content: {
        minHeight: `calc(100vh - ${Layout.footerHeight}px)`,
    },
}));

const MainApp = () => {
    const classes = useStyles();

    const preferredAppLocale = AppLocale.preferred();

    return (
        <div>
            <IntlProvider
                locale={preferredAppLocale.locale}
                messages={preferredAppLocale.messages}
            >
                <div className={classes.content}>
                    {/* <Header /> */}
                    <Routes>
                        <Route path="/" exact element={<Home />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <div className={classes.footer}>
                    <Footer />
                </div>
            </IntlProvider>
        </div>
    );
};

export default MainApp;
