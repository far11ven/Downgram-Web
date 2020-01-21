//pages/index.js

window.onload = function () {
	changeTheme(localStorage.getItem("darkMode")); //select theme
	saveViewCount();
}

function saveViewCount() {
	let sessionBody = {
		channelType: "web"
	};

	fetch("https://downgram-back-end.herokuapp.com/api/saveviewcount", {
			method: "POST",
			body: JSON.stringify(sessionBody),
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(response => response.json())
		.then(responseJson => {})
		.catch(err => {
			console.log("err", err);
		});
}


function themeSelection() {
	let isSelected = document.getElementById("theme-toggle").checked;

	localStorage.setItem("darkMode", !isSelected);
	changeTheme(localStorage.getItem("darkMode"));
}

function changeTheme(userPref) {

	var deviceWidth = Math.max(window.screen.width, window.innerWidth);
	console.log("deviceWidth :", deviceWidth);
	$(document).ready(function () {
		if (userPref === "true") {
			$(".dark-th").css("color", "#ffffff");
			$("#theme-toggle").prop("checked", true);
			if (deviceWidth < 575) {
				$("body").css("background-image", "url(./assets/black_nature1024.jpg)");
			} else {
				$("body").css("background-image", "url(./assets/black_nature.jpg)");
			}
		} else {
			$(".dark-th").css("color", "rgba(0,0,0,.5)");
			$("#theme-toggle").prop("checked", false);
			if (deviceWidth < 575) {
				$("body").css("background-image", "url(./assets/white_nature1024.jpg)");
			} else {
				$("body").css("background-image", "url(./assets/white_nature.jpg)");
			}
		}
	});
}
