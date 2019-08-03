//www.downgram.in
let config;
let url;
let imageLinks = [];
let videoLinks = [];

// add + '&dl=1'

window.onload = function() {
  $("#spinner").show(); //shows loader
  changeTheme(localStorage.getItem("darkMode")); //select theme
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("user");

  const searchQuery = urlParams.get("search");

  document.getElementById("search-box").value = searchQuery;
  if (searchQuery) {
    getMedia(searchQuery);
  }

  btnActivation(); //to make search button disabled by default if searchquery is empty

  if (!userName) {
    //if user is null
    saveViewCount();
  }

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    var dialogShownOn = localStorage.getItem("dialogShownOn");

    if (dialogShownOn !== new Date().toLocaleDateString()) {
      $("#StartUpModal").modal("show"); //display startup modal

      var today = new Date().toLocaleDateString();
      localStorage.setItem("dialogShownOn", today);
    }
    
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

// function showGiforVideo() {
//   setTimeout(function(){
//   showElemGiforVideo();
//   showGiforVideo(); 
// }, 5500);
// }

// function showElemGiforVideo(){
// if(document.getElementById("watchagif").style.display == "none"){
// document.getElementById("watchagif").style.display ="block";

// } else {
// document.getElementById("watchagif").style.display = "none"}

// if(document.getElementById("watchavideo").style.display == "none"){
// 	document.getElementById("watchavideo").style.display = "block"
	
// } else{
// document.getElementById("watchavideo").style.display ="none";
// }
// }

function btnActivation() {
  if (document.getElementById("search-box").value === "") {
    document.getElementById("search-btn").disabled = true;
  } else {
    document.getElementById("search-btn").disabled = false;
  }
}

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

function saveSessionDetails(url) {
  let sessionBody = { linkURL: url, channelType: 'web' };
  $("a[title~='Host']").hide(); //hides 000webhost banner
  fetch('https://downgram-back-end.herokuapp.com/api/savesession', {
      method: "POST",
      body: JSON.stringify(sessionBody),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      }
  })
      .then(response => response.json())
      .then(responseJson => {
          $("#spinner").hide();  //hides loader
      })
      .catch(err => {
          console.log('err', err);
          $("#spinner").hide();  //hides loader
      });
}

function getMedia(searchQuery) {
  // remove attached items & start loader
  $(document).ready(function() {
    $("#errormessage").each(function() {
      $(this).remove();
    });
    $("#downloadlink").empty();
    $("#spinner").show(); //shows loader
  });

  url = searchQuery;

  fetch("https://downgram-back-end.herokuapp.com/api/getmedia?link=" + url)
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.message == "Hello") {
        imageLinks = responseJson.result.imagelinks;
        videoLinks = responseJson.result.videolinks;

        $(document).ready(function() {
        $("#downloadlink").append('<h5 style="color:cornflowerblue;">Available Downloads : <span id="downloadcount">' + (imageLinks.length + videoLinks.length) + '</span></h5>');
        $("#downloadlink").append(`<div id="results" class="downloadlink card-columns"> </div>`);

        
        for (var i = 0; i < imageLinks.length; i++)
            $("#results").append(
              `
                      <div class="card">
                      <i class="media-type fas fa-image"></i>
                      <img id="itemimg" class="card-img-top" src="` +
                imageLinks[i] +
                `" />
                      
                        <a id="imgdownloadlink" class="card-link" href="` +
                imageLinks[i] +
                "&dl=1" +
                `" target="_blank">
                          <div class="c-body">
                          <span><i class="fas fa-download"></i> Download </span>
                          </div>
                        </a>
                      
                    </div>
                    `
            );

          for (var j = 0; j < videoLinks.length; j++)
            $("#results").append(
              `
                      <div class="card">
                      <i class="media-type fas fa-video"></i>
                      <video style="width: 100%;" src="` +
                videoLinks[j] +
                `" controls></video>
                      
                        <a id="viddownloadlink" class="card-link" href="` +
                videoLinks[j] +
                "&dl=1" +
                `" target="_blank">
                          <div class="c-body"><span><i class="fas fa-download"></i> Download </span>
                          </div>
                        </a>
                      
                    </div>
                    `
            );
        });

        //savesession details
        saveSessionDetails(url);
      } else if (
        responseJson.message === "Please enter a valid INSTAGRAM link"
      ) {
        $(document).ready(function() {
          $(".error").append(
            `
                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>
                    `
          );
        });
      } else if (responseJson.message === "Please enter a valid link") {
        $(document).ready(function() {
          $(".error").append(
            `
                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>
                    `
          );
        });
      }
      $("#spinner").hide(); //hides loader
    })
    .catch(err => {
      console.log("err", err);
      $("#spinner").hide(); //hides loader
      $(document).ready(function() {
        $(".error").append(
          `<span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
            " Something went wrong! Please try again." +
            `</span>`
        );
      });
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
      $("body").css("background-image", "url(./assets/black_nature.jpg)");
      $(".dark-th").css("color", "#ffffff");
      $("#theme-toggle").prop('checked', true);

    } else {
      $("body").css("background-image", "url(./assets/white_nature.jpg)");
       $(".dark-th").css("color", "rgba(0,0,0,.5)");
       $("#theme-toggle").prop('checked', false);
    }
  });
}
