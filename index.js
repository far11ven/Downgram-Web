// document.getElementById("demo").innerHTML = "Hello JavaScript";
// document.getElementById("demo").style.display = "block";
// document.getElementById("demo").style.display = "none";
// document.getElementById("demo").innerHTML = "Paragraph changed.";

function getMedia() {
    var url = document.getElementById("search-box").value;

    fetch('https://downgram-back-end.herokuapp.com/api/getmedia?link=https://www.instagram.com/p/BqDJ9LqgCMO/')
  .then(response => console.log('response', response))
  .catch(err=>console.log('err',err))
    
}