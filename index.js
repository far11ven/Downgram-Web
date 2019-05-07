//www.downgram.in
let config;
let url;
let imageLinks = [];
let videoLinks = [];

window.onload = function () {

    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('user');

    console.log("user:", userName);

    if (!userName) {                  //if user is null
        saveViewCount();
    }

    console.log("path", window.location.pathname);
    if (window.location.pathname === '/') {
        $("#spinner").show();  //shows loader
        fetch("config.json")
            .then(response => response.json())
            .then(responseJSON => {
                config = responseJSON;
                getSessionCount();

            });
    } else if (window.location.pathname === '/pages/404.html') {

        window.location.replace("https://www.downgram.in")

    }

    $("a[title~='Host']").hide();
};

function saveViewCount() {

    let sessionBody = { channelType: 'web' };

    fetch('https://downgram-back-end.herokuapp.com/api/saveviewcount', {
        method: "POST",
        body: JSON.stringify(sessionBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(responseJson => {

            console.log(responseJson);

        })
        .catch(err => {
            console.log('err', err);

        });

}



function getSessionCount() {
    var url = document.getElementById("search-box").value;
    $("a[title~='Host']").hide(); //hides 000webhost banner

    fetch('https://downgram-back-end.herokuapp.com/api/sessioncount')
        .then(response => response.json())
        .then(responseJson => {
            let totalSessions = responseJson.result.$numberDouble;

            $(document).ready(function () {
                console.log($("span.stats").text())
                $("span.stats").text(totalSessions);
            });

            $("#spinner").hide();  //hides loader

        })
        .catch(err => {
            console.log('err', err);
            $("#spinner").hide();  //hides loader
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

            console.log(responseJson);

            $("#spinner").hide();  //hides loader

        })
        .catch(err => {
            console.log('err', err);
            $("#spinner").hide();  //hides loader
        });

}



function getMedia() {
    // remove attached items & start loader
    $(document).ready(function () {
        $("#errormessage").remove();
        $("#downloadlink").empty();
        $("#spinner").show(); //shows loader

    });

    url = document.getElementById("search-box").value;

    fetch('https://downgram-back-end.herokuapp.com/api/getmedia?link=' + url)
        .then(response => response.json())
        .then(responseJson => {

            if (responseJson.message == "Hello") {

                imageLinks = responseJson.result.imagelinks;
                videoLinks = responseJson.result.videolinks;

                console.log(imageLinks.length);
                console.log(videoLinks.length);

                $(document).ready(function () {
                    for (var i = 0; i < imageLinks.length; i++)
                        $("#downloadlink").append(`
                      <div class="card border-secondary">
                      <img id="itemimg" class="card-img-top" src="` + imageLinks[i] + `" />
                      <div class="card-body">
                        <h5 class="card-title"><i class="far fa-file-image"></i></h5>
                        <a id="imgdownloadlink" class="card-link" href="` + imageLinks[i] + '&dl=1' + `" target="_blank">
                          <u>click to download <i class="far fa-arrow-alt-circle-down"></i></u></a>
                      </div>
                    </div>
                    `);

                    for (var j = 0; j < videoLinks.length; j++)
                        $("#downloadlink").append(`
                      <div class="card border-secondary">
                      <video style="width: 100%;" src="` + videoLinks[j] + `" controls></video>
                      <div class="card-body">
                        <h5 class="card-title"><i class="far fa-file-video"></i></h5>
                        <a id="viddownloadlink" class="card-link" href="` + videoLinks[j] + '&dl=1' + `" target="_blank">
                          <u>click to download <i class="far fa-arrow-alt-circle-down"></i></u></a>
                      </div>
                    </div>
                    `);

                });

                //savesession details
                saveSessionDetails(url);

            } else if (responseJson.message === "Please enter a valid INSTAGRAM link") {

                $(document).ready(function () {

                    $(".error").append(`
                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` + responseJson.message + `</span>
                    `);
                });


            } else if (responseJson.message === "Please enter a valid link") {

                $(document).ready(function () {
                    $(".error").append(`
                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` + responseJson.message + `</span>
                    `);

                });
            }
            $("#spinner").hide();  //hides loader
        })
        .catch(err => {
            console.log('err', err);
            $("#spinner").hide();  //hides loader
            $(document).ready(function () {
                $(".error")
                    .append(`<span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i> ` + " Something went wrong! Please try again." + `</span>`);
            });
        })
}


