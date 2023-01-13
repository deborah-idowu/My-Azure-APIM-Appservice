import React from "react";
import { Route, Routes } from "react-router-dom";
import MainApp from "../app/index"; // this is the root route index
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({});

const AppContainer = () => {
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path={`/*`} element={<MainApp />} />
            </Routes>
        </ThemeProvider>
    );
};

export default AppContainer;
