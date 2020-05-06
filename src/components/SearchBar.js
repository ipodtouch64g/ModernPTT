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
        borderBottom: `1px solid ${theme.palette.divider}`,
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
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade('#f1f3f4', 1),
		"&:hover": {
			backgroundColor: fade('#ffffff', 1)
		},
		
		width: "40vw",
		
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	inputRoot: {
		color: "inherit"
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: "12ch",
			"&:focus": {
				width: "20ch"
			}
		}
    },
    title: {
        fontFamily: 'Crimson Text',
        fontSize: '32px',
        marginRight: '16vw'
    }
}));

export default function SearchBar(props) {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Toolbar className={classes.toolbar}>
                <div className={classes.title}>ModernPTT</div>
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<SearchIcon />
					</div>
					<InputBase
						placeholder="搜尋看板"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput
						}}
						inputProps={{ "aria-label": "search" }}
					/>
				</div>
			</Toolbar>
		</React.Fragment>
	);
}
