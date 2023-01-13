import React from "react";
import { Grid, Toolbar } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "constants/Constants";
import Hidden from "@mui/material/Hidden";
import buildConfig from "util/Config.json";

const useStyles = makeStyles((theme) => ({
    linkText: {
        textDecoration: "none",
        color: Theme.footerTextColor,
        marginRight: theme.spacing(4),
        "&:hover": {
            textDecoration: "underline",
            cursor: "pointer",
        },
    },
    langSwitcher: {
        display: "flex",
    },
    langIcon: {
        color: "gray",
        marginRight: theme.spacing(0.5),
    },
    buildNumber: {
        color: "darkgray",
    },
    hide: {
        display: "none",
    },
    drawerBuildNumber: {
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: theme.spacing(2),
        color: "darkgray",
    },
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <footer id="footer">
            <Toolbar>
                <Grid container>
                    <Grid
                        item
                        container
                        xs={6}
                        alignContent="center"
                        justifyContent="flex-start"
                    >
                        {/* <Link to="/terms" className={classes.linkText}>
                            <IntlMessages id={"footer.terms"} />
                        </Link> */}
                    </Grid>
                    <Grid
                        xs={6}
                        item
                        container
                        alignContent="center"
                        justifyContent="flex-end"
                    >
                        <Hidden smDown>
                            <div className={`${classes.drawerBuildNumber}`}>
                                {buildConfig.buildNumber}
                            </div>
                        </Hidden>
                        {/* <IntlMessages
                            id="footer.copyright"
                            values={{ year: new Date().getFullYear() }}
                        /> */}
                    </Grid>
                </Grid>
            </Toolbar>
        </footer>
    );
};

export default Footer;
