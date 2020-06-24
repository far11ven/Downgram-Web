//pages/index.js

let formData = {};
let isFormValidated = false;

window.onload = function () {
  formData["sender"] = "Downgram";
  changeTheme(localStorage.getItem("darkMode")); //select theme
  saveViewCount();
};

function saveViewCount() {
  let sessionBody = {
    channelType: "web",
  };

  fetch("https://prod.downgram.in/api/saveviewcount", {
    method: "POST",
    body: JSON.stringify(sessionBody),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {})
    .catch((err) => {
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
        $("body").css(
          "background-image",
          "url(https://downgram.in/assets/black_nature1024.jpg)"
        );
      } else {
        $("body").css(
          "background-image",
          "url(https://downgram.in/assets/black_nature.jpg)"
        );
      }
    } else {
      $(".dark-th").css("color", "rgba(0,0,0,.5)");
      $("#theme-toggle").prop("checked", false);
      if (deviceWidth < 575) {
        $("body").css(
          "background-image",
          "url(https://downgram.in/assets/white_nature1024.jpg)"
        );
      } else {
        $("body").css(
          "background-image",
          "url(https://downgram.in/assets/white_nature.jpg)"
        );
      }
    }
  });
}

function handleFormInput(e) {
  formData[e.id] = e.value;
}

function isvalidated(event) {
  var form = document.getElementById("issue-form");
  if (form.checkValidity() === false) {
    isFormValidated = false;
  } else {
    event.preventDefault();
    isFormValidated = true;
    reporter();
  }
}

function reporter() {
  $("#spinner").show();
  console.log("formData : ", formData);

  let requestBody = formData;
  fetch("https://prod.downgram.in/api/issuereporter", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.message === "Report sent successfully") {
        $("#issue-form").hide();
        var formParent = document.getElementById("container");
        var newElement = document.createElement("p");
        newElement.setAttribute("id", "success-message");
        newElement.innerHTML = `<h2> Thank you! <br> Your issue has been submitted. <i style='color:limegreen' class='far fa-check-circle'></i></h2><br>
			<a
				href="report-issue.html"
				target="_self"
				>Report another <i class="fas fa-comment-dots"></i
			  ></a>
			`;
        formParent.appendChild(newElement);
      }
    })
    .catch((err) => {
      console.log("err", err.message);
    })
    .finally(() => {
      $("#spinner").hide();
    });
}
