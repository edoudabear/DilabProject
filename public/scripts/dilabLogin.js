/*
*/

var sheet = document.createElement('style')
sheet.innerHTML = ".swal2-height-auto {height: 100% !important;}";
document.body.appendChild(sheet);

function getParams ()
{
    var result = {};
    var tmp = [];

    location.search
        .substr (1)
        .split ("&")
        .forEach (function (item)
        {
            tmp = item.split ("=");
            result [tmp[0]] = decodeURIComponent (tmp[1]);
        });

    return result;
}

location.getParams = getParams;

document.querySelector("[name=u]").focus();

document.querySelector(".button").addEventListener("click",function(e) {
    e.preventDefault();
    if (document.querySelector("[name=u]").value.trim().length==0 || document.querySelector("[name=p]").value.trim().length==0) {
        Swal.fire("Warning","You must enter your credentials !","warning");
        return;
    }
    data= {
        "username" : document.querySelector("[name=u]").value,
        "password" : document.querySelector("[name=p]").value
    }
    fetch("../Dilab/connect", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      }).then( response => {
          response.json().then(json => {
            console.log(json);
            if (json.status) { // Valid credentials case
                sessionStorage.setItem("dilabData",JSON.stringify(json.data));
                var link = document.createElement('a');
                link.href = ".";
                if (location.getParams()["redirect"]) {
                    link.href+=decodeURIComponent(location.getParams()["redirect"]);
                }
                link.click();
                //Swal.fire("Success !","Apparently, the credentials you passed where wrong","success");
            }
            else {
                Swal.fire("Error","Apparently, the credentials you passed where wrong","error");
            }
          }); 
    });
})