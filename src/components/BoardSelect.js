import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Skeleton from '@material-ui/lab/Skeleton';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useBotContext } from "./BotContext";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Collapse from "@material-ui/core/Collapse";

export default function BoardSelect(props) {
	const useStyles = makeStyles(theme => ({
		skeleton: {
			fontSize: "24px",
			width: "80%"
		},
		root: {
			justifyContent: "center",
			alignItems: "center",
			borderBottom : `1px solid ${theme.palette.divider}`,
			minHeight:'10vh',
			alignSelf: 'start',
		},
		select: {
			display: "flex",
			flexDirection: "column",
			width: "100%"
		},
		tabs: {
			flexBasis: "85%"
		},
		tab: {
			fontSize: "0.8rem",
			minWidth: "50%"
		},
		searchBotton: {
			flexBasis: "15%",
		},
		btntabs: {
			width: "100%",
			display: "flex"
		},
		inputbase: {}
	}));

	const classes = useStyles();
	const BotContext = useBotContext();
	const [selectedValue, setSelectedValue] = useState(0);
	const [isInputShow, setIsInputShow] = useState(false);
	let setSelectedBoard = props.setSelectedBoard;
	let setSearchBoardText = props.setSearchBoardText;

	const handleChange = (e, v) => {
		setSelectedValue(v);
	};
	const handleSearchClick = () => {
		setIsInputShow(isInputShow => !isInputShow);
	};
	const handleInputbaseOnChange = (e) => {
		//console.log('search board text',e.target.value);
		setSearchBoardText(e.target.value);
	}
	
	useEffect(() => {
		let selectedBoard = "hot";
		switch (selectedValue) {
			case 0:
				selectedBoard = "hot";
				break;
			case 1:
				selectedBoard = "favorite";
				break;
			default:
				break;
		}
		setSelectedBoard(selectedBoard);
	}, [selectedValue, setSelectedBoard]);

	return (
		<Grid container component="main" className={classes.root}>
			<Grid item className={classes.skeleton}>
				{!BotContext.botState.login && <Skeleton />}
				
			</Grid>
			{BotContext.botState.login && (
				<Grid item className={classes.select}>
					<Grid item className={classes.btntabs}>
						<IconButton
							color="primary"
							aria-label="search board"
							className={classes.searchBotton}
							onClick={handleSearchClick}
						>
							<SearchIcon />
						</IconButton>
						<Tabs
							value={selectedValue}
							indicatorColor="primary"
							textColor="primary"
							onChange={handleChange}
							className={classes.tabs}
							variant="scrollable"
						>
							<Tab
								wrapped
								label="熱門看板"
								className={classes.tab}
							/>
							<Tab
								wrapped
								label="最愛看板"
								className={classes.tab}
							/>
						</Tabs>
					</Grid>
					<Collapse in={isInputShow}>
						<InputBase
							onChange={handleInputbaseOnChange}
							placeholder="搜尋看板"
							className={classes.inputbase}
						/>
					</Collapse>
				</Grid>
			)}
		</Grid>
	);
}
