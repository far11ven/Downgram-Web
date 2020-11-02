//www.downgram.in

let config;

let url;

let postText;

let imageLinks = [];

let videoLinks = [];

let highlightLinks = [];

// add + '&dl=1'

window.onload = function () {
  $("#spinner").show(); //shows loader

  changeTheme(localStorage.getItem("darkMode")); //select theme

  fetch("config.json")
    .then((response) => response.json())
    .then((responseJSON) => {
      config = responseJSON;

      getSessionCount();

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
        } else if (searchOptions == "reels") {
          selectedRadioBtn = document.getElementById("inlineRadio4");

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
        var dialogShownOn = new Date(
          localStorage.getItem("dialogShownOn")
        ).getDate();

        if (new Date().getDate() - dialogShownOn >= 365) {
          $("#StartUpModal").modal("show"); //display startup modal

          var today = new Date().toLocaleDateString();

          localStorage.setItem("dialogShownOn", today);
        }
      } else {
        if (window.location.pathname === "/404.html") {
          window.location.replace("https://www.downgram.in");
        }

        $('a[href="' + window.location.pathname + '"]')
          .parents("li") //variations ("li,ul")
          .addClass("active");
      }
    });
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

function copyText() {
  var copyText = document.getElementById("post-description").innerText;
  var elem = document.createElement("textarea");
  document.body.appendChild(elem);
  elem.value = copyText;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);

  $(".toast").toast("show");
}

function btnActivation() {
  if (document.getElementById("search-box").value === "") {
    document.getElementById("search-btn").disabled = true;
  } else {
    document.getElementById("search-btn").disabled = false;
  }
}

function saveViewCount() {
  let sessionBody = { channelType: "web" };

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

function getSessionCount() {
  var url = document.getElementById("search-box").value;

  fetch("https://prod.downgram.in/api/sessioncount")
    .then((response) => response.json())

    .then((responseJson) => {
      let totalSessions = responseJson.result.$numberDouble;

      $(document).ready(function () {
        $("span.stats").text(totalSessions);
      });

      $("#spinner").hide(); //hides loader
    })

    .catch((err) => {
      console.log("err", err);

      $("#spinner").hide(); //hides loader
    });
}

function saveSessionDetails(url) {
  let sessionBody = { linkURL: url, channelType: "web" };

  $("a[title~='Host']").hide(); //hides 000webhost banner

  fetch("https://prod.downgram.in/api/savesession", {
    method: "POST",

    body: JSON.stringify(sessionBody),

    headers: {
      Accept: "application/json, text/plain, */*",

      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())

    .then((responseJson) => {
      $("#spinner").hide(); //hides loader
    })

    .catch((err) => {
      console.log("err", err);

      $("#spinner").hide(); //hides loader
    });
}

function getMedia(searchQuery) {
  // remove attached items & start loader

  $(document).ready(function () {
    $("#errormessage").each(function () {
      $(this).remove();
    });

    $("#downloads").empty();

    $("#spinner").show(); //shows loader
  });

  var sanitizedUrl = searchQuery.split("?");

  url = sanitizedUrl[0] + "?__a=1";

  fetch(url)
    .then((response) => response.json())

    .then((responseJson) => {
      parseJson(responseJson);
    });
}

function parseJson(jsonData) {
  fetch("https://prod.downgram.in/api/parsejson", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => response.json())

    .then((responseJson) => {
      if (responseJson.message == "Hello") {
        imageLinks = responseJson.result.imagelinks;

        videoLinks = responseJson.result.videolinks;

        postText = responseJson.result.postText;

        $(document).ready(function () {
          $("#downloads").append(
            '<span class="success-message"> AVAILABLE DOWNLOADS : <span id="downloadcount">' +
              (imageLinks.length + videoLinks.length) +
              "</span></span>"
          );

          $("#downloads").append(
            `<div class="card conatiner post-text m-4">
            <div class="card-header">
              <strong>Post Description</strong>
            </div>
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <p id="post-description">` +
              postText +
              `</p> 
              </blockquote>
              <button id="copy-text" onclick="copyText()" title="copy post description">
									<i class="fas fa-copy"></i> Copy Text
                </button>
                <div class="toast container" style="max-width:12rem;">
									<div class="toast-body">
										Text has been copied!
									</div>
								</div>
            </div>
          </div>`
          );

          $("#downloads").append(
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            $("#results").append(
              `

                      <div class="card">

                      <div class="card-head">

                      <i class="media-type fas fa-image"></i>

                      <img id="itemimg_` +
                (i + 1) +
                `" class="card-img-top" src="` +
                imageLinks[i] +
                `" onclick="openMediaViewer('itemimg_` +
                (i + 1) +
                `')"/>

                      </div>

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

                      <div class="card-head">

                      <i class="media-type fas fa-video"></i>

                      <video id="itemvid_` +
                (i + 1) +
                `"  class="card-img-top" style="width: 100%;" src="` +
                videoLinks[j] +
                `" onclick="openMediaViewer('itemvid_` +
                (i + 1) +
                `')"></video>

                      </div>

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
        $(document).ready(function () {
          $(".error").append(
            `

                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

                    `
          );
        });
      } else if (responseJson.message === "Please enter a valid link") {
        $(document).ready(function () {
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

    .catch((err) => {
      console.log("err", err);

      $("#spinner").hide(); //hides loader

      $(document).ready(function () {
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

  $(document).ready(function () {
    $("#errormessage").each(function () {
      $(this).remove();
    });

    $("#downloads").empty();

    $("#spinner").show(); //shows loader
  });

  if (username.includes("instagram.com")) {
    let link = username.split("instagram.com/");

    let usernameArr = link[1].split("/");

    if (usernameArr[0] !== "p") {
      username = usernameArr[0];
    } else {
      $(document).ready(function () {
        $(".error").append(
          `

            <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> Please enter a valid Instagram username or profile link</span>

            `
        );
      });
    }
  }

  url = username;

  fetch("https://prod.downgram.in/api/getdp?dp=" + url)
    .then((response) => response.json())

    .then((responseJson) => {
      if (responseJson.message == "Hello dp") {
        imageLinks = responseJson.result.imagelinks;

        videoLinks = responseJson.result.videolinks;

        $(document).ready(function () {
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
        $(document).ready(function () {
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

    .catch((err) => {
      console.log("err", err);

      $("#spinner").hide(); //hides loader

      $(document).ready(function () {
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

  $(document).ready(function () {
    $("#errormessage").each(function () {
      $(this).remove();
    });

    $("#downloads").empty();

    $("#spinner").show(); //shows loader
  });

  if (username.includes("instagram.com")) {
    let link = username.split("instagram.com/");

    let usernameArr = link[1].split("/");

    if (usernameArr[0] !== "p") {
      username = usernameArr[0];
    } else {
      $(document).ready(function () {
        $(".error").append(
          `

            <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> Please enter a valid Instagram username or profile link</span>

            `
        );
      });
    }
  }

  url = "username=" + username;

  fetch("https://prod.downgram.in/api/getstories?" + url)
    .then((response) => response.json())

    .then((responseJson) => {
      if (responseJson.message == "Hello") {
        imageLinks = responseJson.result.storyImageLinks;

        videoLinks = responseJson.result.storyVideoLinks;

        highlightLinks = responseJson.result.highlightsLinks;

        //initialize 3D array

        //for (var i = 0; i <= highlightLinks.length; i++) {

        //  highlightLinks[i] = new Array(2);

        //}

        $(document).ready(function () {
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

                <div class="card-button">

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
        $(document).ready(function () {
          $(".error").append(
            `

                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

                    `
          );
        });
      } else if (responseJson.message === "Please enter a valid username") {
        $(document).ready(function () {
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

    .catch((err) => {
      console.log("err", err);

      $("#spinner").hide(); //hides loader

      $(document).ready(function () {
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

  $(document).ready(function () {
    $("#errormessage").each(function () {
      $(this).remove();
    });

    $("#downloads").empty();

    $("#spinner").show(); //shows loader
  });

  url = "username=" + username + "&highlight=" + highlightId;

  fetch("https://prod.downgram.in/api/gethighlights?" + url)
    .then((response) => response.json())

    .then((responseJson) => {
      if (responseJson.message == "Hello") {
        imageLinks = responseJson.result.storyImageLinks;

        videoLinks = responseJson.result.storyVideoLinks;

        $(document).ready(function () {
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
        $(document).ready(function () {
          $(".error").append(
            `

                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

                    `
          );
        });
      } else if (responseJson.message === "Please enter a valid username") {
        $(document).ready(function () {
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

    .catch((err) => {
      console.log("err", err);

      $("#spinner").hide(); //hides loader

      $(document).ready(function () {
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

  $(document).ready(function () {
    if (userPref === "true") {
      $(".dark-th").css("color", "#ffffff");
      $("body input").css("color", "#ffffff");
      $("#theme-toggle").prop("checked", true);

      if (deviceWidth < 575) {
        $("body").css("background-image", "url(./assets/black_nature1024.jpg)");
      } else {
        $("body").css("background-image", "url(./assets/black_nature.jpg)");
      }
    } else {
      $(".dark-th").css("color", "rgba(0,0,0,.5)");
      $("body input").css("color", "#808080");
      $("#theme-toggle").prop("checked", false);

      if (deviceWidth < 575) {
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
