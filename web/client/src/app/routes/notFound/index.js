import React from "react";
import IntlMessages from "util/IntlMessages";
import Container from "@mui/material/Container";

function NotFound() {
    return (
        <Container>
            <h1>
                <IntlMessages id={"notFound.message"} />
            </h1>
        </Container>
    );
}

export default NotFound;
