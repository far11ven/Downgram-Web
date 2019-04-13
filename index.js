// document.getElementById("demo").innerHTML = "Hello JavaScript";
// document.getElementById("demo").style.display = "block";
// document.getElementById("demo").style.display = "none";
// document.getElementById("demo").innerHTML = "Paragraph changed.";

function getMedia() {
    var url = document.getElementById("search-box").value;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}
      }).then(res => {
    console.log('Success:', res)
})
    .catch(err => {
        console.log("Fetched value err ==", err);

        let domparser = new DOMParser();
        let domdoc = domparser.parseFromString(err.error.text, 'text/html');
        let testLinks = domdoc.querySelector("script:nth-child(2)");


        try {
            testLinks.innerHTML = testLinks.innerHTML.replace("window._sharedData = ", "");
            testLinks.innerHTML = testLinks.innerHTML.replace("};", "}");

            console.log(testLinks.innerHTML.includes(';'));
            var response = JSON.parse(testLinks.innerHTML);
            console.log(testLinks.innerHTML.includes(';'));

            console.log(response.entry_data.PostPage[0].graphql.shortcode_media.__typename)

            if (response.entry_data.PostPage[0].graphql.shortcode_media.__typename === "GraphSidecar") {

                for (var i = 0; i < response.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges.length; i++) {
                    var obj = response.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges[i];

                    console.log(obj.node.__typename);

                    if (obj.node.__typename == 'GraphImage') {

                        this.imageLinks.push(obj.node.display_url);

                    } else if (obj.node.__typename == 'GraphVideo') {

                        this.videoLinks.push(obj.node.video_url);
                    }
                    // this.finalLink = videoElement.getAttribute("content");
                    this._renderer.setStyle(this.downloadLinkRef.nativeElement, 'display', 'inherit');
                    this.saveSessionDetails();
                    this.callSessionCount();
                    this._renderer.setStyle(this.spinnerRef.nativeElement, 'display', 'none');
                }
            }
            else if (response.entry_data.PostPage[0].graphql.shortcode_media.__typename === "GraphImage") {

                this.imageLinks.push(response.entry_data.PostPage[0].graphql.shortcode_media.display_url);
                this._renderer.setStyle(this.downloadLinkRef.nativeElement, 'display', 'inherit');
                this.saveSessionDetails();
                this.callSessionCount();
                this._renderer.setStyle(this.spinnerRef.nativeElement, 'display', 'none');
            }
            else if (response.entry_data.PostPage[0].graphql.shortcode_media.__typename === "GraphVideo") {

                this.videoLinks.push(response.entry_data.PostPage[0].graphql.shortcode_media.video_url);
                this._renderer.setStyle(this.downloadLinkRef.nativeElement, 'display', 'inherit');
                this.saveSessionDetails();
                this.callSessionCount();
                this._renderer.setStyle(this.spinnerRef.nativeElement, 'display', 'none');
            }
            else {

                console.log("inside else");

                this._renderer.setStyle(this.errorMsgRef.nativeElement, 'display', 'inherit');
                this._renderer.setProperty(this.errorMsgRef.nativeElement, 'innerHTML', 'Please provide a valid Instagram post link (which doesn\'t belong to a private account)');
                this._renderer.setStyle(this.spinnerRef.nativeElement, 'display', 'none');

            }
        } catch (e) {
            // No content response..
            console.log("inside catch");

            this._renderer.setStyle(this.errorMsgRef.nativeElement, 'display', 'inherit');
            this._renderer.setProperty(this.errorMsgRef.nativeElement, 'innerHTML', 'Please provide a valid Instagram post link (which doesn\'t belong to a private account)');
            this._renderer.setStyle(this.spinnerRef.nativeElement, 'display', 'none');
        }

    });
    
}