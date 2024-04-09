import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

/*App*/
import MoodRectangle from "../component/moodRectangle";
import AccordionFaqs from "../component/accordeonFaqs";

export const Home = () => {

	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Welcome!</h1>

			{/* <p>
				<img src={rigoImageUrl} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p> */}
			<div>
				<MoodRectangle />
			</div>

			<div>
				<AccordionFaqs />
			</div>

		</div>
	);
};
