//pages/index.js

let prodURL;
let formData = {};
let isFormValidated = false;

window.onload = function () {
  formData["sender"] = "Downgram";
  
  let switchIs = (localStorage.getItem("darkMode") == 'true'); 
  document.getElementById("theme-toggle").checked = switchIs;  // select the darMode switch as per user pref
  changeTheme(localStorage.getItem("darkMode")); //select theme

  getBackEndInfo().then(config => {
    prodURL = config.DOWNGRAM_BACK_END;
    saveViewCount();
  })
  .catch(err => console.log(error));
  
};

function getBackEndInfo(){
  return fetch('./config.json')
  .then(response => response.json());
}

function saveViewCount() {
  let sessionBody = {
    channelType: "web",
  };

  fetch(prodURL +"/api/saveviewcount", {
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
        });;
        document.querySelector("body input").style.color ="#ffffff";
        if(document.querySelectorAll(".privacy-policy").length > 0){
          document.querySelector(".privacy-policy").classList.add("bg-dark");
        }
  
        console.log("checked is ", "true");
  
        if (deviceWidth < 575) {
          document.querySelector("body").style.backgroundImage = "url(https://downgram.parlo.in/assets/black_nature1024.png)";
        } else {
          document.querySelector("body").style.backgroundImage = "url(https://downgram.parlo.in/assets/black_nature.png)";
        }
      } else if (userPref === "false") {
        document.querySelectorAll(".dark-th").forEach(currentItem => {
          currentItem.style.color = "rgba(0,0,0,.5)";
        });
        document.querySelector("body input").style.color = "#808080";
        if(document.querySelectorAll(".privacy-policy").length > 0){
          document.querySelector(".privacy-policy").classList.remove("bg-dark");
        }

        console.log("checked is ", "false");
  
        if (deviceWidth < 575) {
          document.querySelector("body").style.backgroundImage = "url(https://downgram.parlo.in/assets/white_nature1024.png)";
        } else {
          document.querySelector("body").style.backgroundImage = "url(https://downgram.parlo.in/assets/white_nature.png)";
        }
      } else {
        localStorage.setItem("darkMode", false);
        console.log("checked is ", "false");
      }
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

  let requestBody = formData;
  fetch(prodURL +"/api/issuereporter", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.message === "Report sent successfully") {
        document.getElementById("issue-form").style.display = "none"; //shows loader
        var formParent = document.getElementById("msg-container");
        var newElement = document.createElement("p");
        newElement.setAttribute("id", "success-message");
        newElement.innerHTML = `<h3> Thank you! <i style='color:limegreen' class='far fa-check-circle'></i> <br> Your issue has been submitted. </h3><br>
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
      document.getElementById("spinner").style.display = "none"; //hides loader
    });
}
