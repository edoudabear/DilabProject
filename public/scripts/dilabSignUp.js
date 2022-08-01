/*
Dilab Login interface
Edouard Aubert
Under no circumstances can this file be copied an used for any purpose without the author's permission, but you may ask for permission @ support@diskloud.fr
*/

var firstNameSet=false,LastNameSet=false,usernameSet=false,passwordSet=false,passwordConfirmed=false,emailSet=false,genresSet=false,isPPChanged=false;

document.querySelector(".button.signUpBtn").addEventListener("click",function(e) {
    e.preventDefault();
})

document.querySelector(".svgContainer").addEventListener("click",() => {
    document.querySelector(".profilePictureInput").click();
})

for (var i=0;i<document.querySelectorAll("input[type=text], input[type=mail], input[type=password], textarea").length;i++) {
    document.querySelectorAll("input[type=text],  input[type=mail], input[type=password], textarea")[i].addEventListener("focus",(e) => {
        e.target.style.outline="2px solid lightblue";
    });
    document.querySelectorAll("input[type=text],  input[type=mail], input[type=password], textarea")[i].addEventListener("focusout",(e) => {
        e.target.style.outline="none";
    });
}

document.querySelector("input[name=firstname]").addEventListener("focusout",() => {
    firstNameSet=false;
    document.querySelector("input[name=firstname]").value=document.querySelector("input[name=firstname]").value.trim();
    if (document.querySelector("input[name=firstname]").value!="") {
        document.querySelector("input[name=firstname]").style.outline="4px solid lightgreen";
        document.querySelector("input[name=firstname]").style.opacity="1";
        firstNameSet=true;
    } else {
        document.querySelector("input[name=firstname]").style.outline="";
        document.querySelector("input[name=firstname]").style.opacity="";
    }
});

document.querySelector("input[name=lastname]").addEventListener("focusout",() => {
    LastNameSet=false;
    document.querySelector("input[name=lastname]").value=document.querySelector("input[name=lastname]").value.trim();
    if (document.querySelector("input[name=lastname]").value!="") {
        document.querySelector("input[name=lastname]").style.outline="4px solid lightgreen";
        document.querySelector("input[name=lastname]").style.opacity="1";
        LastNameSet=true;
    } else {
        document.querySelector("input[name=lastname]").style.outline="";
        document.querySelector("input[name=lastname]").style.opacity="";
    }
});

document.querySelector("input[name=username]").addEventListener("focusout",(e) => {
    usernameSet=false;
    document.querySelector("input[name=username]").value=document.querySelector("input[name=username]").value.replace(/ /g,"");
    if (document.querySelector("input[name=username]").value.length==0) {
        e.target.style.outline="none";
        document.querySelector(".signUpInput .isUsedNotifier").style.display="";
        document.querySelector("input[name=username]").style.opacity="";
        return;
    } else if (document.querySelector("input[name=username]").value.indexOf('/')!=-1) {
        document.querySelector("input[name=username]").style.outline="4px solid red";
        document.querySelector("input[name=username]").style.opacity="";
        return;
    }
    checkIfExists("usernameAvailable",document.querySelector("input[name=username]").value,document.querySelector("input[name=username]"),document.querySelector(".signUpInput .isUsedNotifier"));
});

document.querySelector("input[name=pass]").addEventListener("focusout",(e) => {
    value=document.querySelector("input[name=pass]").value;
    var nformat = /\\0\\1|\\2|\\3|\\4|\\5|\\6|\\7|\\8|\\9|/g,
    cformat = /\\*|\\$|\\\)|\\+|\\=|\\[|\\{|\\]|\\}|\\||\\\|\\'|\\<|\\,|\\.|\\>|\\?|/g;
    passwordSet=false;
    document.querySelector(".invalidPswd").style.display="";
    if(value === '') {
        //   'Password must be specified !
        document.querySelector("input[name=pass]").style.outline="";
        document.querySelector("input[name=pass]").style.opacity="";
    } else if(!nformat.test(value) || !cformat.test(value) || value.length<8 || value==value.toLowerCase() || value.toUpperCase()==value){   
        // 'Password requires at least une upper cased character, one lower cased character, one number and one special character (*,$,),=,[,],{,},|,\\,\',<,,,.,> or ?)'
        document.querySelector("input[name=pass]").style.outline="4px solid red";
        document.querySelector("input[name=pass]").style.opacity="";
        document.querySelector(".invalidPswd").style.display="block";
    } else {
        passwordSet=true;
        document.querySelector("input[name=pass]").style.outline="4px solid lightgreen";
        document.querySelector("input[name=pass]").style.opacity="1";
    }
    // Check if NOW the passwords match
    document.querySelector(".pswdNotConfirmed").style.display="";
    passwordConfirmed=false;
    if (document.querySelector("input[name=pass]").value==document.querySelector("input[name=passCheck]").value && document.querySelector("input[name=passCheck]").value!="") {
        passwordConfirmed=true;
        document.querySelector("input[name=passCheck]").style.outline="4px solid lightgreen";
        document.querySelector("input[name=passCheck]").style.opacity="1"; 
    } else if (document.querySelector("input[name=passCheck]").value!="") {
        document.querySelector("input[name=passCheck]").style.opacity="";
        document.querySelector("input[name=passCheck]").style.outline="4px solid red";
        document.querySelector(".pswdNotConfirmed").style.display="block";
    }
});

document.querySelector("input[name=passCheck]").addEventListener("focusout",(e) => {
    document.querySelector(".pswdNotConfirmed").style.display="";
    passwordConfirmed=false;
    if (document.querySelector("input[name=pass]").value==document.querySelector("input[name=passCheck]").value && document.querySelector("input[name=passCheck]").value!="") {
        passwordConfirmed=true;
        document.querySelector("input[name=passCheck]").style.outline="4px solid lightgreen";
        document.querySelector("input[name=passCheck]").style.opacity="1";        
    } else if (document.querySelector("input[name=passCheck]").value=="") {
        document.querySelector("input[name=passCheck]").style.outline="";
        document.querySelector("input[name=passCheck]").style.opacity=""; 
    } else {
        document.querySelector("input[name=passCheck]").style.outline="4px solid red";
        document.querySelector("input[name=passCheck]").style.opacity="";
        document.querySelector(".pswdNotConfirmed").style.display="block";
    }
});

document.querySelector("input[name=mail]").addEventListener("focusout",(e) => {
    emailSet=false;
    var stringExpression=document.querySelector("input[name=mail]").value,
    mailDomain = stringExpression.slice(stringExpression.indexOf('@'));
    document.querySelector(".signUpInput .usedMail").style.display="";
    document.querySelector(".signUpInput .invalidMail").style.display="";
    document.querySelector("input[name=mail]").value=document.querySelector("input[name=mail]").value.replace(/ /g,"");
    if (document.querySelector("input[name=mail]").value==0) {
        e.target.style.outline="none";
        e.target.style.opacity="";
        return;
    } if (mailDomain!="@gmail.com" && mailDomain!="@yahoo.com" && mailDomain!="@hotmail.com" && mailDomain!="outlook.com" && mailDomain!="protonmail.com" && mailDomain!="gmx.com" && mailDomain!="wanadoo.fr") {
        document.querySelector(".signUpInput .invalidMail").style.display="block";
        document.querySelector("input[name=mail]").style.outline="4px solid red";
        document.querySelector("input[name=mail]").style.opacity="";
    } else {
        checkIfExists("emailAvailable",document.querySelector("input[name=mail]").value,document.querySelector("input[name=mail]"),document.querySelector(".usedMail"));
    }
});

// Genre management

document.querySelector("input[name=genre]").addEventListener("keyup",e=> {
    if (document.querySelector("input[name=genre]").value.length>0) {
        document.querySelector("input[name=genre]").parentElement.querySelector(".searchRecommendations").style.display="block";
        fetch('/Dilab/get', {
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: JSON.stringify({
                type : "genre",
                genrePattern : document.querySelector("input[name=genre]").value
            }) //data
        }).then(out => {
            return out.json();
        }).then(data => {
           if (data.status==false) {
               return;
           } else {
            document.querySelector("input[name=genre]").parentElement.querySelector(".searchRecommendations").innerHTML="";
                var res=data.data;
                for (var i=0;i<res.length;i++) {
                        document.querySelector("input[name=genre]").parentElement.querySelector(".searchRecommendations").innerHTML+=`<div datavalue=${res[i].id} class="choice">${res[i].genreName}</div>`
                }
                for (var i=0;i<res.length;i++) {
                    document.querySelector("input[name=genre]").parentElement.querySelectorAll(".searchRecommendations .choice")[i].addEventListener("click",e=> {
                        document.querySelector(".savedGenre").innerHTML=e.target.innerHTML;
                        genresSet=true;
                        document.querySelector(".savedGenre").setAttribute("datavalue",e.target.getAttribute("datavalue"));
                        document.querySelector(".searchRecommendations").style.display="none";
                        document.querySelector("input[name=genre]").value=e.target.innerHTML;
                    });
                } if (res.length==0) {
                        document.querySelector("input[name=genre]").parentElement.querySelector(".searchRecommendations").innerHTML="No results found";
                }
           }
        });
    } else {
        document.querySelector("input[name=genre]").parentElement.querySelector(".searchRecommendations").style.display="none";
    }
});



document.querySelector("input[name=genre]").addEventListener("change",(e)=>{
    if (!document.querySelector(".inputSearchRecommendationContainer").contains(e.target) && document.querySelector(".inputSearchRecommendationContainer").contains(document.querySelector("input[name=genre]"))) {
        document.querySelector("input[name=genre]").parentElement.querySelector(".searchRecommendations").style.display="none";
    }
});

document.addEventListener("click",()=>{
    if (document.querySelector("input[name=genre]") !== document.activeElement) {
        document.querySelector("input[name=genre]").parentElement.querySelector(".searchRecommendations").style.display="none"; 
    }
})

function checkIfExists(what,input,inputElement,errElement) {
    var data= {
        type : what,
        value : input
    }
    return fetch("https://e.diskloud.fr/dilab/check", {
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
                if(!json.data) {
                    inputElement.style.outline="4px solid red";
                    inputElement.style.opacity="";
                    errElement.style.display="block";
                } else {
                    inputElement.style.outline="4px solid lightgreen";
                    inputElement.style.opacity="1";
                    errElement.style.display="";
                    if (what=="usernameAvailable") {
                        usernameSet=true;
                    } else if (what=="emailAvailable") {
                        emailSet=true;
                    }
                }
            }
            else {
                Swal.fire("Server Error","Sorry, it seems to be our fault, but there's an unexplainable problem :( <br /> (try again later)","error");
                return false;
            }
          }); 
    });
}

// Profile Picture element script

var uploadField = document.querySelector(".profilePictureInput"),
removePPBtn = document.createElement("button")
removePPBtn.classList.add("button");
removePPBtn.innerHTML="Remove Picture";

uploadField.onchange = function() {
    document.querySelector(".pictureRemButton").style.display="none";
    if (this.files[0].size > 2097152*2){
       Swal.fire("Error","File is too big!","error");
       this.value = "";
    } else if (this.files[0].type.slice(0,this.files[0].type.indexOf('/'))!="image") {
        Swal.fire("Error","Invalid file type<br />Must be a picture","error");
    } else {
        // from an input element
        var filesToUpload = this.files;
        var file = filesToUpload[0];

        document.querySelector(".profilePictureEmbedd").src=URL.createObjectURL(file)
        isPPChanged=true;
        document.querySelector(".pictureRemButton").style.display="block";
    }
};

function unloadImage() {
    uploadField.value='';
    document.querySelector(".pictureRemButton").style.display="none";
    document.querySelector(".profilePictureEmbedd").src="https://icons.getbootstrap.com/assets/icons/person-circle.svg";
    isPPChanged=false;
}

function autotest() {
    for (var i=0;i<document.querySelectorAll("input[type=text]").length;i++) {
        document.querySelectorAll("input[type=text]")[i].focus();
    }
    document.querySelector("input[type=mail]").focus();
    for (var i=0;i<document.querySelectorAll("input[type=password]").length;i++) {
        document.querySelectorAll("input[type=password]")[i].focus();
    }
}
autotest();
setTimeout(()=>{window.scrollTo(0,0),1});
setTimeout(()=>{document.querySelector("input[type=text]").focus()},1);

document.querySelector(".signUpBtn").addEventListener("click",e=> {
    if (!(firstNameSet && LastNameSet && usernameSet && passwordSet && passwordConfirmed && emailSet && genresSet) ) {
        Swal.fire("Warning","You didn't fill all the necessary inputs of the form correctly","warning");
        return;
    }
    var data=new FormData();
    data.append("username",document.querySelector("input[name=username]").value);
    data.append("firstName",document.querySelector("input[name=firstname]").value);
    data.append("lastName",document.querySelector("input[name=lastname]").value);
    data.append("password",document.querySelector("input[name=pass]").value);
    if (!isPPChanged) {
        data.append("files", 1);
    } else {
        data.append("files",uploadField.files[0], uploadField.files[0].name);
    }
    data.append("email",document.querySelector("input[name=mail]").value);
    data.append("genres",document.querySelector(".savedGenre").getAttribute("datavalue"));
    data.append("biography",document.querySelector("textarea[name=biography]").value);

    fetch('/Dilab/add', {
        headers: {
            //'Content-Type': 'application/x-www-form-urlencoded'
            //'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: data
    }).then(out => {
        return out.json();
    }).then(log => {
        console.log(log);
        if (log.status==true) {
            Swal.fire("Account Created",log.data,"success");
        } else {
            Swal.fire("Error",log.data,"error");
        }
    });
});