import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IntlMessages from "util/IntlMessages";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import { useIntl } from "react-intl";
import apiService from "services/ApiService";
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

function MainBody() {
    // const intl = useIntl();
    var defaultInputValue = "";
    var defaultDisplayValue = { ok: true, value: null };

    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(defaultInputValue);
    const [result, setResult] = React.useState(defaultDisplayValue);

    // React.useEffect(() => {
    //     async function negotiate() {
    //     }
    //     negotiate();

    //     // return () => {
    //     //     // will run on every unmount.
    //     //     console.log("component is unmounting");
    //     // };
    // }, []);

    const handleSubmit = async (endpoint) => {
        setLoading(true);
        var data = await apiService.get(endpoint, inputValue);
        setResult(data);
        setLoading(false);
    };

    // const handleClear = async () => {
    //     setInputValue(defaultInputValue);
    //     setResult(defaultDisplayValue);
    // };

    const handleTextChange = async (value) => {
        // if (value === "") {
        //     await handleClear();
        // } else {
        setInputValue(value);
        // }
    };

    return (
        <div className={classes.root}>
            <Container sm={12}>
                <Grid>
                    <h2>
                        <IntlMessages id={"main.primary.header"} />
                    </h2>
                    <Grid container alignItems={"center"}>
                        <Grid item className={classes.input}>
                            <TextField
                                id="input"
                                className={classes.input}
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
                                onClick={() => handleSubmit("function")}
                                disabled={loading}
                            >
                                <IntlMessages id="main.submitFunctionButton" />
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                variant="contained"
                                onClick={() => handleSubmit("webApi")}
                                disabled={loading}
                            >
                                <IntlMessages id="main.submitWebApiButton" />
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
                                <Typography>{result.value}</Typography>
                            ) : (
                                <Typography>
                                    <IntlMessages id="main.makeRequest" />
                                </Typography>
                            )}
                        </div>
                    </Grid>
                    {/* <div>TODO</div> */}
                </Grid>
            </Container>
        </div>
    );
}

export default MainBody;
