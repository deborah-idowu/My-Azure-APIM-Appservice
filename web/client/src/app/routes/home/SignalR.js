import React from "react";
import * as signalR from "@microsoft/signalr";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import IntlMessages from "util/IntlMessages";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme) => ({
    ready: {
        color: "limegreen",
    },
    connecting: {
        color: "orange",
    },
    error: {
        color: "red",
    },
    textWrap: {
        overflowWrap: "break-word",
    },
}));

function SignalR(props) {
    const classes = useStyles();

    const [latestMessage, setLatestMessage] = React.useState(null);

    React.useEffect(() => {
        if (props.readyState && props.connectionInfo !== null) {
            if (props.connectionInfo.value.ok) {
                // connect to hub with connection url and access key
                const cnxn = new signalR.HubConnectionBuilder()
                    .withUrl(props.connectionInfo.value.url, {
                        accessTokenFactory: () =>
                            props.connectionInfo.value.accessToken,
                    })
                    .withAutomaticReconnect()
                    .build();

                // signalr listeners
                cnxn.on("newMessage", (salt, hash) => {
                    setLatestMessage({ salt, hash });
                });
                cnxn.onclose(function () {
                    console.log("SignalR disconnected");
                });
                cnxn.onreconnecting((err) =>
                    console.log("Error reconnecting: ", err)
                );

                // start the connection
                cnxn.start().catch(console.error);
            }
        }
    }, [props.readyState, props.connectionInfo]);

    return (
        <div>
            <Grid>
                <div
                    className={`${
                        props.readyState
                            ? props.connectionInfo.value.ok
                                ? classes.ready
                                : classes.error
                            : classes.connecting
                    }`}
                >
                    {props.readyState ? (
                        props.connectionInfo.value.ok ? (
                            <IntlMessages id="messaging.signalr.ready" />
                        ) : (
                            <IntlMessages id="messaging.signalr.error" />
                        )
                    ) : (
                        <IntlMessages id="messaging.signalr.connecting" />
                    )}
                </div>
                <Grid
                    item
                    style={props.readyState ? null : { display: "none" }}
                    className={classes.textWrap}
                >
                    <Typography>
                        {JSON.stringify(props.connectionInfo)}
                    </Typography>
                    <br />
                    <Typography>
                        {<IntlMessages id="messaging.signalr.latestMessage" />}:{" "}
                        <i>{JSON.stringify(latestMessage)}</i>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}

export default SignalR;
