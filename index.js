//www.downgram.in
let config;
let url;
let imageLinks = [];
let videoLinks = [];
let highlightLinks = [];

// add + '&dl=1'

window.onload = function() {
  $("#spinner").show(); //shows loader
  changeTheme(localStorage.getItem("darkMode")); //select theme
  const urlParams = new URLSearchParams(window.location.search);

  const searchQuery = urlParams.get("search");
  const username = urlParams.get("username");
  const dp = urlParams.get("dp");
  const highlightId = urlParams.get("highlight");
  const searchOptions = urlParams.get("searchOptions");

  if (searchOptions) {
    var selectedRadioBtn;
    if (searchOptions == "posts") {
      selectedRadioBtn = document.getElementById("inlineRadio1");
      changeSearchMode(searchOptions);
    } else if (searchOptions == "dp") {
      selectedRadioBtn = document.getElementById("inlineRadio2");
      changeSearchMode(searchOptions);
    } else if (searchOptions == "stories") {
      selectedRadioBtn = document.getElementById("inlineRadio3");
      changeSearchMode(searchOptions);
    }
    selectedRadioBtn.checked = true;
  } else {
    //to be selected by default
    var selectedRadioBtn = document.getElementById("inlineRadio1");
    selectedRadioBtn.checked = true;
    changeSearchMode("posts");
  }

  if (searchQuery) {
    getMedia(searchQuery);
    document.getElementById("search-box").value = searchQuery;
  } else if (dp) {
    getDP(dp);
    document.getElementById("search-box").value = dp;
  } else if (username && highlightId) {
    getHighlight(username, highlightId);
    document.getElementById("search-box").value = username;
  } else if (username) {
    getStories(username);
    document.getElementById("search-box").value = username;
  }

  btnActivation(); //to make search button disabled by default if searchquery is empty
  saveViewCount(); // save page views

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
    .then(responseJson => {})
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
  let sessionBody = { linkURL: url, channelType: "web" };
  $("a[title~='Host']").hide(); //hides 000webhost banner
  fetch("https://downgram-back-end.herokuapp.com/api/savesession", {
    method: "POST",
    body: JSON.stringify(sessionBody),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(responseJson => {
      $("#spinner").hide(); //hides loader
    })
    .catch(err => {
      console.log("err", err);
      $("#spinner").hide(); //hides loader
    });
}

function getMedia(searchQuery) {
  // remove attached items & start loader
  $(document).ready(function() {
    $("#errormessage").each(function() {
      $(this).remove();
    });
    $("#downloads").empty();
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
          $("#downloads").append(
            '<span class="success-message"> AVAILABLE DOWNLOADS : <span id="downloadcount">' +
              (imageLinks.length + videoLinks.length) +
              "</span></span>"
          );
          $("#downloads").append(
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            $("#results").append(
              `
                      <div class="card">
                      <i class="media-type fas fa-image"></i>
                      <img id="itemimg_` +
                (i + 1) +
                `" class="card-img-top" src="` +
                imageLinks[i] +
                `" onclick="openMediaViewer('itemimg_` +
                (i + 1) +
                `')"/>
                      
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
                      <video id="itemvid_` +
                (i + 1) +
                `"  class="card-img-top" style="width: 100%;" src="` +
                videoLinks[j] +
                `" onclick="openMediaViewer('itemvid_` +
                (i + 1) +
                `')"></video>
                      
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

function getDP(searchQuery) {
  let username = searchQuery;
	
  // removes attached items & starting loader
  $(document).ready(function() {
    $("#errormessage").each(function() {
      $(this).remove();
    });
    $("#downloads").empty();
    $("#spinner").show(); //shows loader
  });
	
	if(username.includes("instagram.com")) {
         let link = username.split("instagram.com/");
         let usernameArr = link[1].split("/");
         if(usernameArr[0] !== "p"){
			username = usernameArr[0];
         } else {
			  $(document).ready(function() {
				$(".error").append(
            `
            <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> Please enter a valid Instagram username or profile link</span>
            `
          );
        });
		}
   }

  url = username;

  fetch("https://downgram-back-end.herokuapp.com/api/getdp?dp=" + url)
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.message == "Hello dp") {
        imageLinks = responseJson.result.imagelinks;
        videoLinks = responseJson.result.videolinks;

        $(document).ready(function() {
          $("#downloads").append(
            '<span class="success-message"> AVAILABLE DP FOR USER : </span>'
          );
          $("#downloads").append(
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            $("#results").append(
              `
                      <div class="card">
                      <i class="media-type fas fa-image"></i>
                      <img id="itemimg_` +
                (i + 1) +
                `" class="card-img-top" src="` +
                imageLinks[i] +
                `" onclick="openMediaViewer('itemimg_` +
                (i + 1) +
                `')"/>
                      
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
        });

        //savesession details
        saveSessionDetails(url);
      } else if (
        responseJson.message ===
        "Please enter a valid INSTAGRAM username/profile link"
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

function getStories(searchQuery) {
	
  let username = searchQuery;
	
  // removes attached items & starting loader
  $(document).ready(function() {
    $("#errormessage").each(function() {
      $(this).remove();
    });
    $("#downloads").empty();
    $("#spinner").show(); //shows loader
  });
	
	if(username.includes("instagram.com")) {
         let link = username.split("instagram.com/");
         let usernameArr = link[1].split("/");
         if(usernameArr[0] !== "p"){
			username = usernameArr[0];
         } else {
			  $(document).ready(function() {
				$(".error").append(
            `
            <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> Please enter a valid Instagram username or profile link</span>
            `
          );
        });
		}
   }
   
  url = "username=" + username;

  fetch("https://downgram-back-end.herokuapp.com/api/getstories?" + url)
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.message == "Hello") {
        imageLinks = responseJson.result.storyImageLinks;
        videoLinks = responseJson.result.storyVideoLinks;
        highlightLinks = responseJson.result.highlightsLinks;

        //initialize 3D array
        //for (var i = 0; i <= highlightLinks.length; i++) {
        //  highlightLinks[i] = new Array(2);
        //}

        $(document).ready(function() {
            
          // highlights code

          $("#downloads").append(
            '<span class="success-message"> AVAILABLE USER HIGHLIGHTS FOR ' +
              username +
              ' : <span id="downloadcount">' +
              highlightLinks.length +
              "</span></span>"
          );
          $("#downloads").append(
            `<div id="highlight-results" class="higlights-bar"> </div>`
          );

          for (var i = 0; i < highlightLinks.length; i++)
            $("#highlight-results").append(
              `<a id="highLightlink" class="card-link" href="?username=` +
                username +
                "&highlight=" +
                highlightLinks[i][2] +
                "&searchOptions=stories" +
                `" target="_self">
                    <img id="itemHighlight_` +
                (i + 1) +
                `" class="card-thumbnail" src="` +
                highlightLinks[i][1] +
                `"/>
                <div class="c-body">
                      <span>` +
                highlightLinks[i][0] +
                `</span>
                </div>
              </a>
             `
            );
            
          // Stories code

          $("#downloads").append(
            '<span class="success-message"> AVAILABLE USER STORY FOR ' +
              username +
              ' : <span id="downloadcount">' +
              (imageLinks.length + videoLinks.length) +
              "</span></span>"
          );
          $("#downloads").append(
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            $("#results").append(
              `
                        <div class="card">
                        <i class="media-type fas fa-image"></i>
                        <img id="itemimg_` +
                (i + 1) +
                `" class="card-img-top" src="` +
                imageLinks[i] +
                `" onclick="openMediaViewer('itemimg_` +
                (i + 1) +
                `')"/>
                        
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
                        <video id="itemvid_` +
                (i + 1) +
                `"  class="card-img-top" style="width: 100%;" src="` +
                videoLinks[j] +
                `" onclick="openMediaViewer('itemvid_` +
                (i + 1) +
                `')"></video>
                        
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
        responseJson.message === "Please enter a valid INSTAGRAM username"
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
      } else if (responseJson.message === "Please enter a valid username") {
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

function getHighlight(username, highlightId) {
  // remove attached items & start loader
  $(document).ready(function() {
    $("#errormessage").each(function() {
      $(this).remove();
    });
    $("#downloads").empty();
    $("#spinner").show(); //shows loader
  });

  url = "username=" + username + "&highlight=" + highlightId;

  fetch("https://downgram-back-end.herokuapp.com/api/gethighlights?" + url)
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.message == "Hello") {
        imageLinks = responseJson.result.storyImageLinks;
        videoLinks = responseJson.result.storyVideoLinks;

        $(document).ready(function() {
          $("#downloads").append(
            '<span class="success-message"> AVAILABLE DOWNLOADS FOR HIGHLIGHT: <span id="downloadcount">' +
              (imageLinks.length + videoLinks.length) +
              "</span></span>"
          );
          $("#downloads").append(
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            $("#results").append(
              `
                      <div class="card">
                      <i class="media-type fas fa-image"></i>
                      <img id="itemimg_` +
                (i + 1) +
                `" class="card-img-top" src="` +
                imageLinks[i] +
                `" onclick="openMediaViewer('itemimg_` +
                (i + 1) +
                `')"/>
                      
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
                      <video id="itemvid_` +
                (i + 1) +
                `"  class="card-img-top" style="width: 100%;" src="` +
                videoLinks[j] +
                `" onclick="openMediaViewer('itemvid_` +
                (i + 1) +
                `')"></video>
                      
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
        responseJson.message === "Please enter a valid INSTAGRAM username"
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
      } else if (responseJson.message === "Please enter a valid username") {
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
    
    var deviceWidth = Math.max(window.screen.width, window.innerWidth);
    console.log("deviceWidth :", deviceWidth);
  $(document).ready(function() {
    if (userPref === "true") {
        $(".dark-th").css("color", "#ffffff");
        $("#theme-toggle").prop("checked", true);
        if(deviceWidth < 575){
            $("body").css("background-image", "url(./assets/black_nature1024.jpg)");
        } else {
            $("body").css("background-image", "url(./assets/black_nature.jpg)");
        }
    } else {
      $(".dark-th").css("color", "rgba(0,0,0,.5)");
      $("#theme-toggle").prop("checked", false);
      if(deviceWidth < 575){
            $("body").css("background-image", "url(./assets/white_nature1024.jpg)");
        } else {
            $("body").css("background-image", "url(./assets/white_nature.jpg)");
        }
    }
  });
}

function openMediaViewer(id) {
  // Get the modal
  var modal = document.getElementById("MediaViewerModal");

  // Get the image and insert it inside the modal - use its "alt" text as a caption
  var mediaItem = document.getElementById(id);
  var modalImg = document.getElementById("modalImg");
  var modalVideo = document.getElementById("modalVideo");

  if (id.includes("itemimg")) {
    modalImg.style.display = "block";
    modalVideo.style.display = "none";
    modalImg.src = mediaItem.src;
  } else {
    modalVideo.style.display = "block";
    modalImg.style.display = "none";
    modalVideo.src = mediaItem.src;
  }
  var modalCaptionText = document.getElementById("caption");

  modal.style.display = "block";
  modalCaptionText.innerHTML = mediaItem.alt;
}

function closeMediaViewer() {
  // Get the modal
  var modal = document.getElementById("MediaViewerModal");
  modal.style.display = "none";
}

function changeSearchMode(searchType) {
  if (searchType === "posts") {
    var searchBox = document.getElementById("search-box");
    searchBox.value = "";
    searchBox.type = "search";
    searchBox.name = "search";
    searchBox.placeholder = "paste your Instagram post/IGTV link..";
    var searchForm = document.getElementById("search-form");
    searchForm.role = "search";
  } else if (searchType === "dp") {
    var searchBox = document.getElementById("search-box");
    searchBox.value = "";
    searchBox.type = "dp";
    searchBox.name = "dp";
    searchBox.placeholder = "enter your Instagram username only..";
    var searchForm = document.getElementById("search-form");
    searchForm.role = "dp";
  } else if (searchType === "stories") {
    var searchBox = document.getElementById("search-box");
    searchBox.value = "";
    searchBox.type = "username";
    searchBox.name = "username";
    searchBox.placeholder = "enter your Instagram username only..";
    var searchForm = document.getElementById("search-form");
    searchForm.role = "username";
  }
}
