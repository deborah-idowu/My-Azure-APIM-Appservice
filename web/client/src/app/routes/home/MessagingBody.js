import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IntlMessages from "util/IntlMessages";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import messagingService from "services/MessagingService";
import { useIntl } from "react-intl";
import SignalR from "./SignalR";
import signalrService from "services/SignalRService";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    gridContainer: {
        width: "100%",
        margin: "0px",
    },
    response: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    responseError: {
        color: "red",
    },
    responseSuccess: {
        color: "black",
    },
    input: {
        [theme.breakpoints.down("sm")]: {
            // marginTop: theme.spacing(2),
            width: "100%",
        },
    },
    buttonContainer: {
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
    },
    button: {
        [theme.breakpoints.up("sm")]: {
            marginLeft: `${theme.spacing(2)}!important`,
        },
        [theme.breakpoints.down("sm")]: {
            marginTop: `${theme.spacing(2)}!important`,
            width: "50%",
            marginLeft: "25%!important",
        },
    },
    textWrap: {
        overflowWrap: "break-word",
    },
}));

function MessagingBody() {
    const intl = useIntl();
    var defaultInputValue = "";
    var defaultDisplayValue = { ok: true, value: null };

    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(defaultInputValue);
    const [result, setResult] = React.useState(defaultDisplayValue);

    // signalr: pass down to child via prop; executed in parent because it has dependencies in parent
    const [signalrReadyState, setSignalrReadyState] = React.useState(false);
    const [signalrConnectionInfo, setSignalrConnectionInfo] =
        React.useState(null);

    React.useEffect(() => {
        async function negotiate() {
            setSignalrReadyState(false);
            // console.log("Starting negotiate call...");
            var info = await signalrService.negotiate();
            setSignalrConnectionInfo(info);
            setSignalrReadyState(true);
        }
        negotiate();

        // return () => {
        //     // will run on every unmount.
        //     console.log("component is unmounting");
        // };
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        var data = await messagingService.sendMessage(inputValue);
        setResult(data);
        setLoading(false);
    };

    const handleClear = async () => {
        setInputValue(defaultInputValue);
        setResult(defaultDisplayValue);
    };

    const handleTextChange = async (value) => {
        if (value === "") {
            await handleClear();
        } else {
            setInputValue(value);
        }
    };

    return (
        <div className={classes.root}>
            <Container sm={12}>
                <Grid>
                    <h2>
                        <IntlMessages id={"messaging.primary.header"} />
                    </h2>
                    <Grid container alignItems={"center"}>
                        <Grid item className={classes.input}>
                            <TextField
                                id="input"
                                className={classes.input}
                                disabled={!signalrReadyState}
                                variant="outlined"
                                label={<IntlMessages id={"input.textField"} />}
                                onChange={(e) =>
                                    handleTextChange(e.target.value)
                                }
                                value={inputValue}
                            />
                        </Grid>
                        <Grid className={classes.buttonContainer}>
                            <Button
                                className={classes.button}
                                color="primary"
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading || inputValue === ""}
                            >
                                <IntlMessages id="messaging.submitFunctionButton" />
                            </Button>
                            <Button
                                className={classes.button}
                                sx={
                                    result.value === null
                                        ? { display: "none" }
                                        : null
                                }
                                variant="outlined"
                                onClick={handleClear}
                                disabled={loading || inputValue === ""}
                            >
                                <IntlMessages id="buttons.clearButton" />
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid className={classes.textWrap}>
                        <div
                            className={`${classes.response} ${
                                result.ok
                                    ? classes.responseSuccess
                                    : classes.responseError
                            }`}
                        >
                            {result.value !== null ? (
                                result.ok ? (
                                    <Typography>
                                        {intl.formatMessage({
                                            id: "messaging.messageSentPrefix",
                                        })}
                                    </Typography>
                                ) : (
                                    result.value
                                )
                            ) : (
                                ""
                            )}
                        </div>
                    </Grid>
                    <div>
                        {
                            <SignalR
                                readyState={signalrReadyState}
                                connectionInfo={signalrConnectionInfo}
                            />
                        }
                    </div>
                </Grid>
            </Container>
        </div>
    );
}

export default MessagingBody;
