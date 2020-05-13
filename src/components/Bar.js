import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import InputBase from "@material-ui/core/InputBase";
const useStyles = makeStyles(theme => ({
	toolbar: {
		boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
		transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
        position: "sticky",
		display: "flex",
		
	},
	toolbarTitle: {
		flex: 1
	},
	toolbarSecondary: {
		justifyContent: "space-between",
		overflowX: "auto"
	},
	toolbarLink: {
		padding: theme.spacing(1),
		flexShrink: 0
	},
	
    title: {
        fontFamily: 'Crimson Text',
        fontSize: '32px',
        marginRight: '16vw'
    }
}));

export default function Bar(props) {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Toolbar className={classes.toolbar} boxShadow={1}>
                <div className={classes.title}>ModernPTT</div>
				
			</Toolbar>
		</React.Fragment>
	);
}
