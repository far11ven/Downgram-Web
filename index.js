//www.downgram.in

let config;
let url;
let postText;
let imageLinks = [];
let videoLinks = [];
let highlightLinks = [];

// add + '&dl=1'

window.onload = function(){ 
  document.getElementById("spinner").style.display = "block"; //shows loader
  
  let switchIs = (localStorage.getItem("darkMode") == 'true'); 
  document.getElementById("theme-toggle").checked = switchIs;  // select the darMode switch as per user pref
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
        document.getElementById("search-box").value = searchQuery;
        getMedia(searchQuery);

        
      } else if (dp) {
        document.getElementById("search-box").value = dp;
        getDP(dp);

      } else if (username && highlightId) {
        document.getElementById("search-box").value = username;
        getHighlight(username, highlightId);

      } else if (username) {
        document.getElementById("search-box").value = username;
        getStories(username);
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
          var startUpModal = new bootstrap.Modal(document.getElementById('StartUpModal'), {
            keyboard: false
          })
          startUpModal.show(); //display startup modal

          var today = new Date().toLocaleDateString();

          localStorage.setItem("dialogShownOn", today);
        }
      } else {
        if (window.location.pathname === "/404.html") {
          window.location.replace("https://www.downgram.in");
        }

        document.querySelector('a[href="' + window.location.pathname + '"]')
        .parentNode.classList.add("active");
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
  document.body.appendChildChild(elem);
  elem.value = copyText;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);

  document.querySelector(".toast").toast("show");
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

      document.querySelector("span.stats").innerHTML= totalSessions;
      document.getElementById("spinner").style.display = "none"; //hides loader

    }).catch((err) => {
      console.log("err", err);

      document.getElementById("spinner").style.display = "none"; //hides loader
    });
}

function saveSessionDetails(url) {
  let sessionBody = { linkURL: url, channelType: "web" };
  
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
      document.getElementById("spinner").style.display = "none"; //hides loader
    })

    .catch((err) => {
      console.log("err", err);

      document.getElementById("spinner").style.display = "none"; //hides loader
    });
}

function getMedia(searchQuery) {
  // remove attached items & start loader
  if(document.querySelectorAll("#errormessage").length > 0){
    document.querySelectorAll("#errormessage").forEach(currentItem => {
      currentItem.remove();
    });
  }

  // clear all subchilds of @downloads
    var downloadsElem = document.getElementById("downloads");
    while (downloadsElem.firstChild) {
      downloadsElem.removeChild(downloadsElem.firstChild);
    }

  document.getElementById("spinner").style.display = "block"; //show loader

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

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            '<span class="success-message"> AVAILABLE DOWNLOADS : <span id="downloadcount">' +
              (imageLinks.length + videoLinks.length) +
              "</span></span>"
          );

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
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

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            document.getElementById("results").insertAdjacentHTML('beforebegin',
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
            document.getElementById("results").insertAdjacentHTML('beforebegin',
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

        //savesession details

        saveSessionDetails(url);
      } else if (
        responseJson.message === "Please enter a valid INSTAGRAM link"
      ) {
        
          document.querySelector(".error").insertAdjacentHTML('beforebegin',
            `

                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

                    `
          );
      } else if (responseJson.message === "Please enter a valid link") {
        
          document.querySelector(".error").insertAdjacentHTML('beforebegin',
            `

                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

                    `
          );
      }

      document.getElementById("spinner").style.display = "none"; //hides loader
    })

    .catch((err) => {
      console.log("err", err);

      document.getElementById("spinner").style.display = "none"; //hides loader

      
        document.querySelector(".error").insertAdjacentHTML('beforebegin',
          `<span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
            " Something went wrong! Please try again." +
            `</span>`
        );
      });
}

function getDP(searchQuery) {
  let username = searchQuery;

 // remove attached items & start loader
 if(document.querySelectorAll("#errormessage").length > 0){
  document.querySelectorAll("#errormessage").forEach(currentItem => {
    currentItem.remove();
  });
}

// clear all subchilds of @downloads
  var downloadsElem = document.getElementById("downloads");
  while (downloadsElem.firstChild) {
    downloadsElem.removeChild(downloadsElem.firstChild);
  }

  document.getElementById("spinner").style.display = "none"; //hides loader

  if (username.includes("instagram.com")) {
    let link = username.split("instagram.com/");

    let usernameArr = link[1].split("/");

    if (usernameArr[0] !== "p") {
      username = usernameArr[0];
    } else {
      
        document.querySelector(".error").insertAdjacentHTML('beforebegin',
          `

            <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> Please enter a valid Instagram username or profile link</span>

            `
        );
    }
  }

  url = username;

  fetch("https://prod.downgram.in/api/getdp?dp=" + url)
    .then((response) => response.json())

    .then((responseJson) => {
      if (responseJson.message == "Hello dp") {
        imageLinks = responseJson.result.imagelinks;

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            '<span class="success-message"> AVAILABLE DP FOR USER : </span>'
          );

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            document.getElementById("results").insertAdjacentHTML('beforebegin',
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

        //savesession details
        saveSessionDetails(url);

      } else if (
        responseJson.message ===
        "Please enter a valid INSTAGRAM username/profile link"
      ) {
        
          document.querySelector(".error").insertAdjacentHTML('beforebegin',
            `<span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

           `
          );
      }

      document.getElementById("spinner").style.display = "none"; //hides loader
    })
    .catch((err) => {
      console.log("err", err);

      document.getElementById("spinner").style.display = "none"; //hides loader

      
        document.querySelector(".error").insertAdjacentHTML('beforebegin',
          `<span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
            " Something went wrong! Please try again." +
            `</span>`
        );
      });
}

function getStories(searchQuery) {
  let username = searchQuery;
 
 // remove attached items & start loader
 if(document.querySelectorAll("#errormessage").length > 0){
  document.querySelectorAll("#errormessage").forEach(currentItem => {
    currentItem.remove();
  });
}

// clear all subchilds of @downloads
  var downloadsElem = document.getElementById("downloads");
  while (downloadsElem.firstChild) {
    downloadsElem.removeChild(downloadsElem.firstChild);
  }

  document.getElementById("spinner").style.display = "none"; //hides loader

  if (username.includes("instagram.com")) {
    let link = username.split("instagram.com/");

    let usernameArr = link[1].split("/");

    if (usernameArr[0] !== "p") {
      username = usernameArr[0];
    } else {
      
        document.querySelector(".error").insertAdjacentHTML('beforebegin',
          `

            <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> Please enter a valid Instagram username or profile link</span>

            `
        );
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

        
          // highlights code

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            '<span class="success-message"> AVAILABLE USER HIGHLIGHTS FOR ' +
              username +
              ' : <span id="downloadcount">' +
              highlightLinks.length +
              "</span></span>"
          );

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            `<div id="highlight-results" class="higlights-bar"> </div>`
          );

          for (var i = 0; i < highlightLinks.length; i++)
            document.getElementById("highlight-results").insertAdjacentHTML('beforebegin',
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

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            '<span class="success-message"> AVAILABLE USER STORY FOR ' +
              username +
              ' : <span id="downloadcount">' +
              (imageLinks.length + videoLinks.length) +
              "</span></span>"
          );

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            document.getElementById("results").insertAdjacentHTML('beforebegin',
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
            document.getElementById("results").insertAdjacentHTML('beforebegin',
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

        //savesession details

        saveSessionDetails(url);
      } else if (
        responseJson.message === "Please enter a valid INSTAGRAM username"
      ) {
        
          document.querySelector(".error").insertAdjacentHTML('beforebegin',
            `

                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

                    `
          );
      } else if (responseJson.message === "Please enter a valid username") {
        
          document.querySelector(".error").insertAdjacentHTML('beforebegin',
            `<span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
            `</span>`
          );
      }
      document.getElementById("spinner").style.display = "none"; //hides loader

    }).catch((err) => {
      console.log("err", err);

      document.getElementById("spinner").style.display = "none"; //hides loader
      
      document.querySelector(".error").insertAdjacentHTML('beforebegin',
          `<span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
            " Something went wrong! Please try again." +
            `</span>`
        );
    });
}

function getHighlight(username, highlightId) {

  // remove attached items & start loader
  if(document.querySelectorAll("#errormessage").length > 0){
    document.querySelectorAll("#errormessage").forEach(currentItem => {
      currentItem.remove();
    });
  }

  // clear all subchilds of @downloads
    var downloadsElem = document.getElementById("downloads");
    while (downloadsElem.firstChild) {
      downloadsElem.removeChild(downloadsElem.firstChild);
    }


    document.getElementById("spinner").style.display = "block"; //hides loader

  url = "username=" + username + "&highlight=" + highlightId;

  fetch("https://prod.downgram.in/api/gethighlights?" + url)
    .then((response) => response.json())

    .then((responseJson) => {
      if (responseJson.message == "Hello") {
        imageLinks = responseJson.result.storyImageLinks;

        videoLinks = responseJson.result.storyVideoLinks;

        
          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            '<span class="success-message"> AVAILABLE DOWNLOADS FOR HIGHLIGHT: <span id="downloadcount">' +
              (imageLinks.length + videoLinks.length) +
              "</span></span>"
          );

          document.getElementById("downloads").insertAdjacentHTML('beforebegin',
            `<div id="results" class="downloadlink card-columns"> </div>`
          );

          for (var i = 0; i < imageLinks.length; i++)
            document.getElementById("results").insertAdjacentHTML('beforebegin',
              `

                      <div class="card">

                      <i class="media-type fas fa-image"></i>

                      <img id="itemimg_` +
                (i + 1) +
                `" class="card-img-top" src="` +
                imageLinks[i] +
                `" onclick="openMediaViewer('itemimg_` +
                (i + 1) +
                `')"/><a id="imgdownloadlink" class="card-link" href="` +
                imageLinks[i] +
                "&dl=1" +
                `" target="_blank">
                          <div class="c-body">
                          <span><i class="fas fa-download"></i> Download </span>
                          </div>
                        </a>
                    </div>`
            );

          for (var j = 0; j < videoLinks.length; j++)
            document.getElementById("results").insertAdjacentHTML('beforebegin',
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
        //savesession details

        saveSessionDetails(url);
      } else if (
        responseJson.message === "Please enter a valid INSTAGRAM username"
      ) {
        
          document.querySelector(".error").insertAdjacentHTML('beforebegin',
            `

                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

                    `
          );
      } else if (responseJson.message === "Please enter a valid username") {
        
          document.querySelector(".error").insertAdjacentHTML('beforebegin',
            `

                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
              responseJson.message +
              `</span>

                    `
          );
      }

      document.getElementById("spinner").style.display = "none"; //hides loader
    })

    .catch((err) => {
      console.log("err", err);

      document.getElementById("spinner").style.display = "none"; //hides loader
      
        document.querySelector(".error").insertAdjacentHTML('beforebegin',
          `<span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` +
            " Something went wrong! Please try again." +
            `</span>`
        );
      });
    }

function themeSelection() {
      let switchIs;
      if(localStorage.getItem("darkMode")){
        switchIs = (localStorage.getItem("darkMode") == 'true'); 
        console.log("Setting mode as0:", !switchIs);
  
        localStorage.setItem("darkMode", !switchIs);
  
      } else { 
        switchIs = false;
        localStorage.setItem("darkMode", false);
        console.log("Setting mode as1:", false);
  
      }
      
      document.getElementById("theme-toggle").checked = !switchIs;
      changeTheme(localStorage.getItem("darkMode"));
}

function changeTheme(userPref) {
  var deviceWidth = Math.max(window.screen.width, window.innerWidth);

  console.log("deviceWidth :", deviceWidth);

    if (userPref === "true") {
      document.querySelectorAll(".dark-th").forEach(currentItem => {
        currentItem.style.color = "#ffffff";
      });
      document.querySelector("body input").style.color ="#ffffff";

      console.log("checked is ", "true");

      if (deviceWidth < 575) {
        document.querySelector("body").style.backgroundImage = "url(./assets/black_nature1024.jpg)";
      } else {
        document.querySelector("body").style.backgroundImage = "url(./assets/black_nature.jpg)";
      }
    } else if (userPref === "false") {
      document.querySelectorAll(".dark-th").forEach(currentItem => {
        currentItem.style.color = "rgba(0,0,0,.5)";
      });
      document.querySelector("body input").style.color = "#808080";

      console.log("checked is ", "false");

      if (deviceWidth < 575) {
        document.querySelector("body").style.backgroundImage = "url(./assets/white_nature1024.jpg)";
      } else {
        document.querySelector("body").style.backgroundImage = "url(./assets/white_nature.jpg)";
      }
    } else {
      localStorage.setItem("darkMode", false);
      console.log("checked is ", "false");
    }
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
