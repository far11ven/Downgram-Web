let config;
let url;
let imageLinks = [];
let videoLinks = [];

window.onload = function () {
    fetch("config.json")
        .then(response => response.json())
        .then(responseJSON => {
            config = responseJSON;
            getSessionCount();
        });
};

function getSessionCount() {
    var url = document.getElementById("search-box").value;
    $("#spinner").show();  //hides loader

    fetch(config.api.host + '/api/sessioncount')
        .then(response => response.json())
        .then(responseJson => {
            let totalSessions = responseJson.result.$numberDouble;

            $(document).ready(function () {
                console.log($("span.stats").text())
                $("span.stats").text(totalSessions);
                console.log($("span.stats").text())
            });

            $("#spinner").hide();  //hides loader

        })
        .catch(err => {
            console.log('err', err);
            $("#spinner").hide();  //hides loader
        });

}

function saveSessionDetails() {

    let sessionBody = '{"linkURL":"' + url + '","channelType": "web"}';

    console.log(JSON.parse(sessionBody));

    fetch(config.api.host + '/api/savesession', {
        method: "POST",
        body: JSON.stringify({ linkURL: url, channelType: 'web' }),
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

    fetch(config.api.host + '/api/getmedia?link=' + url)
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

                    for (var i = 0; i < videoLinks.length; i++)
                        $("#downloadlink").append(`
                      <div class="card border-secondary">
                      <video style="width: 100%;" src="` + videoLinks[i] + `"></video>
                      <div class="card-body">
                        <h5 class="card-title"><i class="far fa-file-video"></i></h5>
                        <a id="viddownloadlink" class="card-link" href="` + videoLinks[i] + '&dl=1' + `" target="_blank">
                          <u>click to download <i class="far fa-arrow-alt-circle-down"></i></u></a>
                      </div>
                    </div>
                    `);

                });

                //savesession details
                saveSessionDetails();


            } else if (responseJson.message === "Please enter a valid INSTAGRAM link") {

                $(document).ready(function () {

                    $("#search-section").append(`
                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i>` + responseJson.message + `</span>
                    `);
                });


            } else if (responseJson.message === "Please enter a valid link") {

                $(document).ready(function () {
                    $("#search-section").append(`
                      <span id="errormessage" class="message"><i class="fas fa-exclamation-triangle"></i>` + responseJson.message + `</span>
                    `);

                });


            }
            $("#spinner").hide();  //hides loader
        })
        .catch(err => {
            console.log('err', err);
            $("#spinner").hide();  //hides loader
        })

}


