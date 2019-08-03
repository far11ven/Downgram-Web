//www.downgram.in
let config;
let url;
let imageLinks = [];
let videoLinks = [];

// add + '&dl=1'

window.onload = function() {
  changeTheme(localStorage.getItem("darkMode")); //select theme
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("user");

  if (!userName) {
    //if user is null
    saveViewCount();
  }

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {

    fetch("config.json")
      .then(response => response.json())
      .then(responseJSON => {
        config = responseJSON;
        getSessionCount();
      });
  } else if (window.location.pathname === "/pages/404.html") {
    window.location.replace("https://www.downgram.in");
  }

  $("a[title~='Host']").hide();
};

function saveViewCount() {
  let sessionBody = { channelType: "web" };

  fetch("https://downgram-back-end.herokuapp.com/api/saveviewcount", {
    method: "POST",
    body: JSON.stringify(sessionBody),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(responseJson => {

    })
    .catch(err => {
      console.log("err", err);
    });
}

function getSessionCount() {
  var url = document.getElementById("search-box").value;
  $("a[title~='Host']").hide(); //hides 000webhost banner

  fetch("https://downgram-back-end.herokuapp.com/api/sessioncount")
    .then(response => response.json())
    .then(responseJson => {
      let totalSessions = responseJson.result.$numberDouble;

      $(document).ready(function() {
        $("span.stats").text(totalSessions);
      });

      $("#spinner").hide(); //hides loader
    })
    .catch(err => {
      console.log("err", err);
      $("#spinner").hide(); //hides loader
    });
}

function themeSelection() {
  let isSelected = document.getElementById("theme-toggle").checked;

  localStorage.setItem("darkMode", !isSelected);
   changeTheme(localStorage.getItem("darkMode"));
}

function changeTheme(userPref) {
  $(document).ready(function() {
    if (userPref === "true") {
      $("body").css("background-image", "url(../assets/black_nature.jpg)");
      $(".dark-th").css("color", "#ffffff");
      $("#theme-toggle").prop('checked', true);

    } else {
      $("body").css("background-image", "url(../assets/white_nature.jpg)");
       $(".dark-th").css("color", "rgba(0,0,0,.5)");
       $("#theme-toggle").prop('checked', false);
    }
  });
}
