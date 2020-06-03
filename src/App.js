import React, { useEffect, useState } from "react";
import Main from "./components/Main";
import Bowser from "bowser";

export default function App(props) {
	const notChrome = (
		<span>
			Due to technical issue(cannot set custom Websocket Origin header).
			At this time, we only support Chrome.{" "}
			<span role="img" aria-label="Person Bowing">
				🙇🙇🙇🙇🙇
			</span>{" "}
		</span>
	);

	const isChrome = () => {
		// check is chrome
		const browser = Bowser.getParser(window.navigator.userAgent);
		return browser.satisfies({
			desktop: {
				chrome: ">=80"
			}
		});
	};

	return (isChrome() ? <Main /> : notChrome);
	
}
