/*
Attention : ce code est en réalité une portion du code qui tourne sur le serveur accessible à l'adresse https://e.diskloud.fr. Cette portion du code correspond à l'ensemble des fonctions cruciales pour le fonctionnement du projet Web Dilab
Le code ne fonctionne cependant pas de manière indépendante, car il y a certaines librairies qui ne sont pas initialisées dans ce script.

Ne vous laissez pas faire impressionner ! Cela a pris des mois de développement et même si le code est très conséquent, il n'est finalement pas si compliqué. Avec le club Web, vous aurez le moyens de tout comprendre :)
*/

dilabConnection.connect();
var cryptoKey=String(fs.readFileSync(__dirname + '/../expressjs/dilabKey.txt')).replace(/\n/g,'');
// node native promisify -> Creates an async query function (for "await query()")
const dilabQuery = util.promisify(dilabConnection.query).bind(dilabConnection);


app.get("/Dilab",function(req,res) {
    if (req.session.dilab) {
        res.render("dilab.ejs",{connected:true})
    } else {
        res.render("dilab.ejs",{connected:false})
    }
});

app.get("/Dilab/:action",function(req,res) {
    if (req.params.action=="login") {
        if (!req.session.dilab)
            res.render("dilabLogin.ejs")
        else
            res.redirect("/Dilab");
    } else if (req.params.action.toLowerCase()=="infos") {
        res.render("dilabProjectInfos.ejs")
    } else if (req.params.action.toLowerCase()=="signup") {
        res.render("dilabSignUp.ejs");
    } else {
        if (req.session.dilab) {
            res.render("dilab.ejs",{connected:true})
        } else {
            res.render("dilab.ejs",{connected:false})
        }
    }
});

app.get("/Dilab/:action/:file", function(req,res) {
    if (req.params.action == "group" ) {
        if (fs.existsSync(`/media/edouda/DiskloudExt/DilabFiles/groupPP/${req.params.file}`)) {
            res.sendFile(`/media/edouda/DiskloudExt/DilabFiles/groupPP/${req.params.file}`);
        } else {
            res.status(404).end("No such file");
        }
    } else if (req.params.action == "user" ) {
        if (fs.existsSync(`/media/edouda/DiskloudExt/DilabFiles/userPP/${req.params.file}`)) {
            res.sendFile(`/media/edouda/DiskloudExt/DilabFiles/userPP/${req.params.file}`);
        } else {
            res.status(404).end("No such file");
        }
    } else if (req.params.action == "release" ) {
        if (fs.existsSync(`/media/edouda/DiskloudExt/DilabFiles/releasePP/${req.params.file}`)) {
            res.sendFile(`/media/edouda/DiskloudExt/DilabFiles/releasePP/${req.params.file}`);
        } else {
            res.status(404).end("No such file");
        }
    } else if (req.params.action == "project" ) {
        res.sendFile(`/media/edouda/DiskloudExt/DilabFiles/projectPP/disc.svg`);
    } else {
        res.status(404).end("Bad Path");
    }
});

app.get("/Dilab/:action/:groupName/:projectName", function(req,res) {
    if (req.params.action == "project" ) {
        if (fs.existsSync(`/media/edouda/DiskloudExt/DilabFiles/projectPP/${encodeURI(req.params.file)}/${encodeURI(req.params.projectName)}`)) {
            res.sendFile(`/media/edouda/DiskloudExt/DilabFiles/projectPP/${encodeURI(req.params.file)}/${encodeURI(req.params.projectName)}`);
        } else {
            res.status(404).end("No such file");
        }
    } 
});

app.post("/Dilab/:action", upload.array("files"), (req,res,err) => {
    if (err instanceof multer.MulterError) {
        res.status(400).end('{ "status" : "error", "output": "false","data" : "we were unable to parse your data"}');
        if (req.files) {
            for (var i=0;i<req.files.length;i++)
            fs.unlink(req.files[i].path,()=>{return;});
        }
    }
    if (req.params.action=="connect") { // Path sort, THEN POST body analysis
        if (req.body.username && req.body.password) {
            dilabConnection.query(`SELECT id,nom,pseudo,prenom,biographie,genres,dateCreation,profilePictureName FROM DilabUser WHERE pseudo="${mysql_real_escape_string(req.body.username)}" AND motDePasse=aes_encrypt("${mysql_real_escape_string(req.body.password)}","${cryptoKey}");`,(err,results,fields) => {
                if (err) throw err;

                if (results.length!=0) {
                    req.session.dilab = results[0].id;
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : {
                                "nom" :results[0].nom,
                                "prenom" : results[0].prenom,
                                "pseudo" : results[0].pseudo,
                                "biographie" : results[0].biographie,
                                "genres" : results[0].genres,
                                "dateEnregistrement" : results[0].DateCreation,
                                "profilePicturePath" : results[0].profilePictureName
                            }
                        }));
                } else {
                    res.end('{ "return" : "ok", "status" : false, "description" : "wrong credentials" }');
                }
            });
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                    fs.unlink(req.files[i].path,()=>{return;});
            }
        } else {
            res.status(400).end('{ "return" : "invalid POST data" }')
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        }
    } else if (req.params.action=="disconnect") {
        if (req.files) {
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        }
        if (req.session.dilab) {
            delete req.session["dilab"];
            //req.session.destroy();
            res.end('{ "return" : "ok", "status" : true }')
        } else {
            res.end('{ "return" : "ok", "status" : false, "description" : "already disconnected" }')
        }
    } else if (req.params.action=="get") {
        if (req.body.type=="mainGroups") {
            dilabConnection.query(`SELECT DilabMusicGroups.groupName,DilabMusicGroups.genres,DilabMusicGroups.groupPicture,DilabMusicGroups.dateOfBirth,DilabMusicGroups.description,
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators, COUNT(DISTINCT DilabProject.id) AS nProjects, COUNT(DISTINCT DilabReleases.id) AS nReleases FROM DilabMusicGroups
                        LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabMusicGroups.id 
                        LEFT JOIN DilabProject ON DilabProject.groupAuthor=DilabMusicGroups.id
                        LEFT JOIN DilabReleases ON DilabReleases.groupAuthor=DilabMusicGroups.id
                        -- WHERE genres=""
                        GROUP BY DilabMusicGroups.id
                        ORDER BY nCollaborators DESC, dateOfBirth DESC LIMIT 10;`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                } else if (results.length!=0) {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                } else {
                    res.end('{ "return" : "ok", "status" : false, "description" : "internal server error (account is unfindable)" }');
                }
            });
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        }
        else if (req.body.type=="groupsWhereUserIsAdmin" && req.session.dilab) {
            dilabConnection.query(`SELECT groupName FROM DilabMusicGroups WHERE admin=${mysql_real_escape_string(req.session.dilab)};`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "could not complete the requested task",
                            "status" : false
                        }));
                        throw err;
                    } else {
                        res.end(JSON.stringify(
                            { "return" : "ok",
                                "data" : results,
                                "status" : true
                            }));
                    }
                });
        } else if (req.body.type=="userData" && req.session.dilab) {
            dilabConnection.query(`SELECT nom,pseudo,prenom,biographie,genres,dateCreation,profilePictureName FROM DilabUser WHERE id=${mysql_real_escape_string(req.session.dilab)};`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                } if (results.length!=0) {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : {
                                "nom" :results[0].nom,
                                "prenom" : results[0].prenom,
                                "pseudo" : results[0].pseudo,
                                "biographie" : results[0].biographie,
                                "genres" : results[0].genres,
                                "dateEnregistrement" : results[0].DateCreation,
                                "profilePicturePath" : results[0].profilePictureName
                            }
                        }));
                } else {
                    res.end('{ "return" : "ok", "status" : false, "description" : "internal server error (account is unfindable)" }');
                }
            });
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        } else if (req.body.type=="group" && req.body.groupName) {
            var groupName=decodeURI(mysql_real_escape_string(req.body.groupName));
            dilabConnection.query(`
            /*1 (Group basic informations)*/
            SELECT DilabMusicGroups.groupPicture,DilabMusicGroups.groupName,DilabMusicGroups.description,adminTb.pseudo as admin,DilabMusicGroups.dateOfBirth,founderTb.pseudo as founder,DilabMusicGroups.genres FROM DilabMusicGroups 
            JOIN DilabUser AS founderTb ON founderTb.id=DilabMusicGroups.founder
            JOIN DilabUser AS adminTb ON adminTb.id=DilabMusicGroups.admin
            WHERE groupName="${groupName}"; 

            /*2 (Group's main releases)*/
            WITH cte AS (
                SELECT songId,COUNT(*) as nb_streams FROM DilabStreams GROUP BY songId
            )
            SELECT releaseDate, projectBirthDate,name,releasePicture,duration,filePath,lyrics, nb_streams
            FROM DilabReleases dr
            JOIN cte ON dr.id=cte.songId
            JOIN DilabMusicGroups ON DilabMusicGroups.id=dr.groupAuthor
            WHERE DilabMusicGroups.groupName="${groupName}"
            ORDER BY nb_streams DESC LIMIT 3;

            /*3 (Group's active projects number)*/
            SELECT COUNT(*) as nb_projets_actifs FROM DilabProject
                JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabProject.groupAuthor
                WHERE DilabMusicGroups.groupName="${groupName}" AND DilabProject.isReleased=FALSE;

            /*4 (Group's nb of releases)*/
            SELECT COUNT(*) as nb_releases FROM DilabReleases
                JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabReleases.groupAuthor
                WHERE DilabMusicGroups.groupName="${groupName}";
            /*5 (Group's number of streams since last 30 days)*/
            SELECT COUNT(*) as nb_streams_tot FROM DilabStreams
                JOIN DilabReleases ON DilabReleases.id=DilabStreams.songId
                JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabReleases.groupAuthor
                WHERE DilabMusicGroups.groupName="${groupName}" AND DilabStreams.date>=ADDTIME(CURRENT_TIMESTAMP(), '-30 0:0:0');
            /*6 (Group's active projects)*/
            SELECT DilabProject.name,DilabProject.genres,DilabProject.currentPhase,DilabProject.projectPicture,DilabProject.description FROM DilabProject
                JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabProject.groupAuthor
                WHERE DilabProject.isReleased=FALSE AND DilabMusicGroups.groupName="${groupName}"
                ORDER BY DilabProject.dateOfBirth DESC LIMIT 20;
            `,(err,results,fields)=> {
                    if (err) { // DBS Query Error
                        res.end(JSON.stringify(
                            { "return" : "error",
                                "data" : "internal server error",
                            }));
                    } else {
                        if (results[0].length==0) {
                            console.log("GROUP NOT FOUND..")
                            res.end(JSON.stringify({
                                return : "not found",
                                status : false,
                                data : "This group page does not exist.."
                            }))
                        } else {
                            var output="[";
                            for (var i=0;i<results.length;i++) {
                                output+=(JSON.stringify(results[i]))
                                if (i!=results.length-1)
                                    output+=",";
                            }
                            res.setHeader('content-type', 'application/json');
                            res.end(JSON.stringify({
                                return : "ok",
                                status : true,
                                data : JSON.parse(output+"]")
                            }));
                        }
                    }
                });
        } else {
            res.status(400).end('{ "return" : "invalid POST get data" }')
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        }
    } else if (req.params.action=="set") {
        if (req.body.type="passwordViaPreviousPassword" && req.body.prevPassword && req.body.newPassword && req.session.dilab) {
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
            if(req.body.newPassword === '') { 
                res.end(JSON.stringify({"data" : 'You need to write something!', "status" : false}));
            } else {
                var nformat = /\\0\\1|\\2|\\3|\\4|\\5|\\6|\\7|\\8|\\9|/g,
                cformat = /\\*|\\$|\\\)|\\+|\\=|\\[|\\{|\\]|\\}|\\||\\\|\\'|\\<|\\,|\\.|\\>|\\?|/g;
                if(!nformat.test(req.body.newPassword) || !cformat.test(req.body.newPassword) || req.body.newPassword.length<8 || req.body.newPassword==req.body.newPassword.toLowerCase() || req.body.newPassword.toUpperCase()==req.body.newPassword) {   
                    res.end(JSON.stringify({"data" : "Password requires at least une upper cased character, one lower cased character, one number and one special character (*,$,),=,[,],{,},|,\\,\',<,,,.,> or ?)",
                                            "status" : false
                                        }));
                } else {
                    dilabConnection.query(`UPDATE DilabUser SET motDePasse=AES_ENCRYPT("${mysql_real_escape_string(req.body.newPassword)}","${cryptoKey}") WHERE id=${mysql_real_escape_string(req.session.dilab)} AND motDePasse=AES_ENCRYPT("${mysql_real_escape_string(req.body.prevPassword)}","${cryptoKey}");`,(err,results,fields) => {
                        if (err) {
                            res.end(JSON.stringify(
                                { "return" : "ok",
                                    "status" : false,
                                    "data" : "server error"
                            }));
                        }
                        if (results.affectedRows==1) {
                            res.end(JSON.stringify(
                                { "return" : "ok",
                                    "status" : true,
                                    "data" : true
                                }));
                        } else {
                            res.end('{ "return" : "ok", "status" : false, "data" : "data seems to be invalid" }');
                        }
                    });
                }
            }
        // Updating a user's profile picture
        } else if (req.files && req.body.profilePictureOnly && req.session.dilab) {
            if (req.files.length<1) {
                res.end(JSON.stringify({
                    status : false,
                    return : "error",
                    data : "You did not send any input file"
                }));
            }
            else { // Check if file uploaded
                if (req.files[0].size > 2097152*2){ // Check file size (4MB max)
                    if (req.files) {
                        for (var i=0;i<req.files.length;i++)
                        fs.unlink(req.files[i].path,()=>{return;});
                    }
                    res.end('{ "return" : "error","status" : false,"data" : "Profile Picture is too big !" }');
                    return;
                } else if (req.files[0].mimetype.slice(0,req.files[0].mimetype.indexOf('/'))!="image") { // Check file type (image ?)
                    if (req.files) {
                        for (var i=0;i<req.files.length;i++)
                        fs.unlink(req.files[i].path,()=>{return;});
                    }
                    res.end('{ "return" : "error","status": false,"data" : "Uploaded profile picture must be.. a picture !" }');
                    return;
                }
                // Valid Case : converting file (and first getting the user's name via it's id)
                dilabQuery(`SELECT pseudo FROM DilabUser WHERE id=${mysql_real_escape_string(req.session.dilab)}`).catch((err) => {serverError(res,err)})
                .then((results)=> {
                    if (results.length==0) {
                        res.end(JSON.stringify({status : false, return : "error", data : "Internal server error. Try again later (its an unconscionable issue to say the least..)."}))
                        if (req.files) {
                            for (var i=0;i<req.files.length;i++)
                            fs.unlink(req.files[i].path,()=>{return;});
                        }
                    } else {
                        var username=results[0].pseudo;
                        sharp(req.files[0].path)
                        .resize(1248, 1248)
                        .toFile("tempUploads/"+username+'.png', (err, info) => { 
                            //When conversion done, the temporary files get deleted, after the profile picture has been saved properly
                            if (err) {
                                res.end('{"return" : "error", "status" : false, "data":"Could not load your profile picture properly"}');
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                    fs.unlink(req.files[i].path,()=>{return;}) ;
                                }
                                return;//throw err
                            }
                            //console.log("file sharpened !");
                            fs.move("tempUploads/"+username+".png","/media/edouda/DiskloudExt/DilabFiles/userPP/"+username+".png",{overwrite : true});
                            if (req.files) {
                                for (var i=0;i<req.files.length;i++)
                                fs.unlink(req.files[i].path,()=>{return;});
                            }

                            dilabQuery(`UPDATE DilabUser SET  profilePictureName='${mysql_real_escape_string(username)}.png' WHERE id=${mysql_real_escape_string(req.session.dilab)}`).catch((err) => {serverError(res,err)})
                            .then(()=> {
                                res.end(JSON.stringify({
                                    status : true,
                                    return : "ok"
                                }));
                            });
                        });
                    }
                })
            }
        // Updating a user's first name
        } else if (req.body.firstNameOnly && req.session.dilab) {
            if (!( typeof req.body.firstNameOnly == "string" &&  req.body.firstNameOnly.length>0 && req.body.firstNameOnly.indexOf('/')==-1)) {
                res.end('{ "return" : "error", "status" : false, "data" : "Invalid first name and/or last name"}')
                return;
            } else if (req.body.firstNameOnly.length>48) {
                res.end('{ "return" : "error", "status" : false, "data" : "First name is too long"}');
                return;
            } else {
                dilabQuery(`UPDATE DilabUser SET prenom="${mysql_real_escape_string(req.body.firstNameOnly)}" WHERE id=${mysql_real_escape_string(req.session.dilab)}`).catch((err) => {serverError(res,err)})
                .then(() => {
                    res.end(JSON.stringify({
                        status : true,
                        return : "ok"
                    }));
                });
            }
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        // Updating a user's last name
        } else if (req.body.lastNameOnly && req.session.dilab) {
            if (!( typeof req.body.lastNameOnly == "string" &&  req.body.lastNameOnly.length>0 && req.body.lastNameOnly.indexOf('/')==-1)) {
                res.end('{ "return" : "error", "status" : false, "data" : "Invalid first name and/or last name"}')
                return;
            } else if (req.body.lastNameOnly.length>48) {
                res.end('{ "return" : "error", "status" : false, "data" : "Last name is too long"}');
                return;
            }
            dilabQuery(`UPDATE DilabUser SET nom="${mysql_real_escape_string(req.body.lastNameOnly)}" WHERE id=${mysql_real_escape_string(req.session.dilab)}`).catch((err) => {serverError(res,err)})
            .then(() => {
                res.end(JSON.stringify({
                    status : true,
                    return : "ok"
                }));
            });
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        // Updating a user's username
        } else if (req.body.usernameOnly && req.session.dilab) {
            if (req.body.usernameOnly.indexOf('/')!=-1) {
                res.end('{ "return" : "error", "status" : false, "data" : "Username is not available"}');
                return;
            } else if (req.body.usernameOnly.length>128) {
                res.end('{ "return" : "error", "status" : false, "data" : "Username is too long."}');
                return;
            }
            dilabQuery(`SELECT pseudo FROM DilabUser WHERE pseudo="${mysql_real_escape_string(req.body.usernameOnly)}"`).catch((err) => {serverError(res,err)})
            .then((output) => {
                if(output.length>0) {
                    res.end('{ "return" : "error", "status" : false, "data" : "Username is already taken by someone else"}');
                    return; 
                }
                dilabQuery(`UPDATE DilabUser SET pseudo="${mysql_real_escape_string(req.body.usernameOnly)}" WHERE id=${mysql_real_escape_string(req.session.dilab)}`).catch((err) => {serverError(res,err)})
                .then(()=> {
                    res.end(JSON.stringify({
                        status : true,
                        return : "ok",
                        for : "username update"
                    }))
                });
            });
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        // Updating user's biography
        } else if (req.body.userBiographyOnly && req.session.dilab) {
            //biography control
            if (typeof req.body.userBiographyOnly!="string") {
                res.end('{ "return" : "error", "status" : false, "data" : "Biography is..weird ?"}');
                return;    
            } else if (req.body.userBiographyOnly.length>4000) {
                res.end('{ "return" : "error", "status" : false, "data" : "Biography is too long"}');
                return;
            }
            dilabQuery(`UPDATE DilabUser SET biographie="${mysql_real_escape_string(req.body.userBiographyOnly)}" WHERE id=${mysql_real_escape_string(req.session.dilab)}`).catch((err) => {serverError(res,err)})
            .then(()=> {
                res.end(JSON.stringify({
                    status : true,
                    return : "ok"
                }))
            });
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        // Updating user's favorite genres
        } else if (req.body.genresOnly && req.session.dilab) {
            //Genres control
            if (typeof req.body.genresOnly!="string" && req.body.genresOnly!=null) {
                res.end('{ "return" : "error", "status" : false, "data" : "Genres is..weird ?"}');      
            }
            dilabQuery(`UPDATE DilabUser SET genres="${mysql_real_escape_string(req.body.genresOnly)}" WHERE id=${mysql_real_escape_string(req.session.dilab)}`).catch((err) => {serverError(res,err)})
            .then(()=> {
                res.end(JSON.stringify({
                    status : true,
                    return : "ok"
                }))
            });
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        } else {
            res.status(400).end('{ "return" : "invalid POST data" }');
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        }
    } else if (req.params.action=="add") {
        // Account creation case
        if (req.body.username && req.body.firstName && req.body.lastName && req.body.password && req.files 
            && req.body.email && (req.body.genres || true) && req.body.biography) {
            //Username Control
            if (req.body.username.indexOf('/')!=-1) {
                res.end('{ "return" : "error", "status" : false, "data" : "Username is not available"}');
            } else if (req.body.username.length>128) {
                res.end('{ "return" : "error", "status" : false, "data" : "Username is too long"}');
            }
            dilabQuery("SELECT pseudo FROM DilabUser WHERE pseudo='"+mysql_real_escape_string(req.body.username)+"'").catch((err) => {serverError(res,err)})
            .then(output=> {
            if (output.length>0) {
                res.end('{ "return" : "error", "status" : false, "data" : "Username is not available"}');
                return;
            } else {
                // first name and last name Control
                if (!(typeof req.body.firstName == "string" && typeof req.body.lastName == "string" && 
                    req.body.firstName.length>0 && req.body.lastName.length>0 && req.body.firstName.indexOf('/')==-1 && req.body.lastName.indexOf('/')==-1)) {
                    res.end('{ "return" : "error", "status" : false, "data" : "Invalid first name and/or last name"}')
                    return;
                } else if (req.body.firstName.length>48) {
                    res.end('{ "return" : "error", "status" : false", "data" : "First name is too long"}');
                } else if (req.body.lastName.length>48) {
                    res.end('{ "return" : "error", "status" : false", "data" : "Last name is too long"}');
                }
                //password check
                var nformat = /\\0\\1|\\2|\\3|\\4|\\5|\\6|\\7|\\8|\\9|/g,
                cformat = /\\*|\\$|\\\)|\\+|\\=|\\[|\\{|\\]|\\}|\\||\\\|\\'|\\<|\\,|\\.|\\>|\\?|/g;
                if(req.body.password === '') {
                    //   'Password must be specified !
                    res.end('{ "return" : "error", "status" : false, "data" : "Password must be specified !"}');
                } else if(!nformat.test(req.body.password) || !cformat.test(req.body.password) || req.body.password.length<8 || req.body.password==req.body.password.toLowerCase() || req.body.password.toUpperCase()==req.body.password || req.body.password.length>64){   
                    // 'Password requires at least une upper cased character, one lower cased character, one number and one special character (*,$,),=,[,],{,},|,\\,\',<,,,.,> or ?)'
                    res.end('{ "return" : "error", "status" : false, "data" : "Password requires at least une upper cased character, one lower cased character, one number and one special character (*,$,),=,[,],{,},|,\\,\',<,,,.,> or ?). It must contain between 8 and 64 characters"}');
                }
                //email control
                if (req.body.email.indexOf('@')==-1) {
                    res.end('{ "return" : "error", "status" : false, "data" : "Invalid email address : It doesn\'t exist !"}');
                } else if (req.body.email.slice(req.body.email.indexOf('@'))!="@gmail.com" &&
                req.body.email.slice(req.body.email.indexOf('@'))!="@hotmail.com" &&
                req.body.email.slice(req.body.email.indexOf('@'))!="@outlook.com" &&
                req.body.email.slice(req.body.email.indexOf('@'))!="@protonmail.com" &&
                req.body.email.slice(req.body.email.indexOf('@'))!="@gmx.com" &&
                req.body.email.slice(req.body.email.indexOf('@'))!="@wanadoo.fr" &&
                req.body.email.slice(req.body.email.indexOf('@'))!="@yahoo.com") {
                    res.end('{ "return" : "error", "status" : false, "data" : "Only emails from gmail,gmx, outlook, hotmail, yahoo and wanadoo are accepted."}');
                } else if (req.body.username.email>64) {
                    res.end('{ "return" : "error", "status" : false, "data" : "Email too long"}');
                }
                dilabQuery("SELECT email FROM DilabUser WHERE email='"+mysql_real_escape_string(req.body.email)+"'").catch((err) => {serverError(res,err)})
                .then(output=> {
                    console.log(output)
                    if (output.length>0) {
                        res.end('{ "return" : "error", "status" : false, "data" : "Invalid email address : address is already used."}');
                        return;
                    }
                //biography control
                if (typeof req.body.biography!="string") {
                    res.end('{ "return" : "error", "status" : false, "data" : "Biography is..weird ?"}');      
                } else if (req.body.biography.length>4000) {
                    res.end('{ "return" : "error", "status" : false, "data" : "Biography is too long"}');
                }
                //Genres control
                if (typeof req.body.genres!="string" && req.body.genres!=null) {
                    res.end('{ "return" : "error", "status" : false, "data" : "Genres is..weird ?"}');      
                }
                //Preparing mail options account creation notification
                var mailOptions = {
                    from: '"maintenance@diskloud.fr" <diskloud@hotmail.com>',
                    to: req.body.email,
                    subject: 'Dilab Music',
                    text: 'If you receive this message, it means that you have created a Dilab account with it',
                    html: '<h1>Welcome '+req.body.firstName+' !</h1><p>You can access to your account via this <a href="https://e.diskloud.fr/dilab/login">link</a></p><p><strong>Username</strong>'+req.body.username+'</p><p><strong>Password :</strong>'+req.body.password+'</p><p>Have fun :)</p>'
                };
                // profilePicture control
                if (req.files.length>0) { // Check if file uploaded
                    if (req.files[0].size > 2097152*2){ // Check file size (4MB max)
                        if (req.files) {
                            for (var i=0;i<req.files.length;i++)
                            fs.unlink(req.files[i].path,()=>{return;});
                        }
                        res.end('{ "return" : "error","status" : false,"data" : "Profile Picture is too big !" }');
                        return;
                    } else if (req.files[0].mimetype.slice(0,req.files[0].mimetype.indexOf('/'))!="image") { // Check file type (image ?)
                        if (req.files) {
                            for (var i=0;i<req.files.length;i++)
                            fs.unlink(req.files[i].path,()=>{return;});
                        }
                        res.end('{ "return" : "error","status": false,"data" : "Uploaded profile picture must be.. a picture !" }');
                        return;
                    }
                    // Valid Case : converting file
                    sharp(req.files[0].path)
                    .resize(1248, 1248)
                    .toFile("tempUploads/"+req.body.username+'.png', (err, info) => { 
                        //When conversion done, the temporary files get deleted, after the profile picture has been saved properly
                        if (err) {
                            res.end('{"return" : "error", "status" : false, "data":"Could not load your profile picture properly"}');
                            if (req.files) {
                                for (var i=0;i<req.files.length;i++)
                                fs.unlink(req.files[i].path,()=>{return;}) ;
                            }
                            return;//throw err
                        }
                        //console.log("file sharpened !");
                        fs.move("tempUploads/"+req.body.username+".png","/media/edouda/DiskloudExt/DilabFiles/userPP/"+req.body.username+".png",{overwrite : true});
                        if (req.files) {
                            for (var i=0;i<req.files.length;i++)
                            fs.unlink(req.files[i].path,()=>{return;});
                        }
                        dilabQuery(`INSERT INTO DilabUser (nom,prenom,pseudo,motDePasse,email,biographie,genres,profilePictureName) VALUES ("${mysql_real_escape_string(req.body.lastName)}", "${mysql_real_escape_string(req.body.firstName)}", "${mysql_real_escape_string(req.body.username)}", AES_ENCRYPT("${mysql_real_escape_string(req.body.password)}","${cryptoKey}"), "${mysql_real_escape_string(req.body.email)}", "${mysql_real_escape_string(req.body.biography)}", "${mysql_real_escape_string(req.body.genres)}", "${mysql_real_escape_string(req.body.username)}.png")`).catch((err) => {serverError(res,err)})
                        .then(()=> {
                            res.end('{ "return" : "ok","status" : true, "data" : "Account created ! Make sure you confirm your account by mail."}')
                            transporter.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                        });
                    });
                } else { //Query for no personalized profile picture
                    dilabQuery(`INSERT INTO DilabUser (nom,prenom,pseudo,motDePasse,email,biographie,genres) VALUES ("${mysql_real_escape_string(req.body.lastName)}", "${mysql_real_escape_string(req.body.firstName)}", "${mysql_real_escape_string(req.body.username)}", AES_ENCRYPT("${mysql_real_escape_string(req.body.password)}","${cryptoKey}"), "${mysql_real_escape_string(req.body.email)}", "${mysql_real_escape_string(req.body.biography)}", "${mysql_real_escape_string(req.body.genres)}")`).catch((err) => {serverError(res,err)})
                    .then(()=> {
                        res.end('{ "return": "ok","status" : true, "data":"Account Created ! Make sure you confirm your account by email." }');                        
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    });
                }    
            //EMAILQUERY//USERNAMECHECK (NESTS)
            });}});
        // Group Creation
        } else if (req.body.groupName && req.body.groupDescription && req.body.groupOrientation && req.session.dilab) {
            var groupName=mysql_real_escape_string(req.body.groupName),
            groupOrientation=mysql_real_escape_string(req.body.groupOrientation),
            groupDescription=mysql_real_escape_string(req.body.groupDescription);
            if (groupName.length>122 || groupOrientation.length > 256 || groupDescription.length > 512) {
                res.end(JSON.stringify({
                    return : "error",
                    status : false,
                    data : "Part of the information you entered was too long. The group's name must not exceed 122 characters."
                }));
            }
            if (groupName.indexOf('/')>-1) {
                res.end(JSON.stringify({
                    return : "error",
                    status : false,
                    data : invalidGroupName
                }));
                if (req.files) {
                    for (var i=0;i<req.files.length;i++)
                    fs.unlink(req.files[i].path,()=>{return;});
                }
            }
            else if (req.files.length>0) { // Check if file uploaded
                if (req.files[0].size > 2097152*2){ // Check file size (4MB max)
                    if (req.files) {
                        for (var i=0;i<req.files.length;i++)
                        fs.unlink(req.files[i].path,()=>{return;});
                    }
                    res.end('{ "return" : "error","status" : false,"data" : "Group Picture is too big !" }');
                    return;
                } else if (req.files[0].mimetype.slice(0,req.files[0].mimetype.indexOf('/'))!="image") { // Check file type (image ?)
                    if (req.files) {
                        for (var i=0;i<req.files.length;i++)
                        fs.unlink(req.files[i].path,()=>{return;});
                    }
                    res.end('{ "return" : "error","status": false,"data" : "Uploaded group picture must be.. a picture !" }');
                    return;
                }
                // Valid Case : converting file
                sharp(req.files[0].path)
                .resize(1248, 1248)
                .toFile("tempUploads/"+req.body.username+'.png', (err, info) => { 
                    //When conversion done, the temporary files get deleted, after the profile picture has been saved properly
                    if (err) {
                        res.end('{"return" : "error", "status" : false, "data":"Could not load your group picture properly"}');
                        if (req.files) {
                            for (var i=0;i<req.files.length;i++)
                            fs.unlink(req.files[i].path,()=>{return;}) ;
                        }
                        return;//throw err
                    }
                    //console.log("file sharpened !");
                    fs.move("tempUploads/"+req.body.username+".png","/media/edouda/DiskloudExt/DilabFiles/groupPP/"+groupName+".png",{overwrite : true});
                    if (req.files) {
                        for (var i=0;i<req.files.length;i++)
                        fs.unlink(req.files[i].path,()=>{return;});
                    }
                    console.log(`INSERT INTO DilabMusicGroups (groupName, groupPicture,description, admin, founder, genres) VALUES ('${groupName}','${groupName}.png','${groupDescription}',${req.session.dilab},${req.session.dilab},'${groupOrientation}'); INSERT INTO DilabGroupMembers (memberId,groupId) SELECT ${req.session.dilab},id FROM DilabMusicGroups WHERE groupName="${groupName}";`)
                    dilabConnection.query(`INSERT INTO DilabMusicGroups (groupName, groupPicture,description, admin, founder, genres) VALUES ('${groupName}','${groupName}.png','${groupDescription}',${req.session.dilab},${req.session.dilab},'${groupOrientation}'); INSERT INTO DilabGroupMembers (memberId,groupId) SELECT ${req.session.dilab},id FROM DilabMusicGroups WHERE groupName="${groupName}";`,function(err,results,fields) {
                        if (err) {
                            console.log("ERROR : "+err.errno);
                            if (err.errno==1062) {
                                res.end(JSON.stringify({
                                    return : "ok",
                                    status : false,
                                    data : "You need to choose another music group name : it is already used !"      
                                }));
                            } else {
                                res.end(JSON.stringify({
                                    return : "ok",
                                    status : false,
                                    data : "There was an error. Maybe try later.."   
                                }));   
                            }
                        } else {
                            res.end(JSON.stringify({
                                return : "ok",
                                status : true,
                                data : "music group created successfully"
                            }));
                        }
                    });
                });
            } else {
                console.log(`INSERT INTO DilabMusicGroups (groupName,description, admin, founder, genres) VALUES ('${groupName}','${groupDescription}',${req.session.dilab},${req.session.dilab},'${groupOrientation}'); INSERT INTO DilabGroupMembers (memberId,groupId) SELECT ${req.session.dilab},id FROM DilabMusicGroups WHERE groupName="${groupName}"`);
                dilabConnection.query(`INSERT INTO DilabMusicGroups (groupName,description, admin, founder, genres) VALUES ('${groupName}','${groupDescription}',${req.session.dilab},${req.session.dilab},'${groupOrientation}'); INSERT INTO DilabGroupMembers (memberId,groupId) SELECT ${req.session.dilab},id FROM DilabMusicGroups WHERE groupName="${groupName}"`,function(err,results,fields) {
                    if (err) {
                        console.log("ERROR : "+err.errno);
                        if (err.errno==1062) {
                            res.end(JSON.stringify({
                                return : "ok",
                                status : false,
                                data : "You need to choose another music group name : it is already used !"      
                            }));
                        } else {
                            res.end(JSON.stringify({
                                return : "ok",
                                status : false,
                                data : "There was an error. Maybe try later.."   
                            }));   
                        }
                    } else {
                        res.end(JSON.stringify({
                            return : "ok",
                            status : true,
                            data : "music group created successfully"
                        }));
                    }
                    if (req.files) {
                        for (var i=0;i<req.files.length;i++)
                            fs.unlink(req.files[i].path,()=>{return;}) ;
                    }
                })
            }
            //INSTRUCTION : `INSERT INTO DilabMusicGroups (name, groupPicture,description, admin, founder, genres) VALUES ('${groupName}','${groupPicture}','${groupDescription}',${admin},${founder},'${genres}')`
        } else if (req.body.projectName && req.body.groupName && typeof(req.body.projectLyrics)!="undefined" && typeof(req.body.projectDescription)!="undefined" &&
         typeof(req.body.projectGenre)!="undefined" && req.body.projectPhase && req.body.audioFile && req.body.projectFile && req.body.projectPPFile && req.session.dilab) {
            var projectName=mysql_real_escape_string(req.body.projectName),
            projectDescription=mysql_real_escape_string(req.body.projectDescription ? req.body.projectDescription : ""),
            projectGenre=mysql_real_escape_string(req.body.projectGenre ? req.body.projectGenre : ""),
            projectLyrics=mysql_real_escape_string(req.body.projectLyrics ? req.body.projectLyrics : ""),
            groupName=mysql_real_escape_string(req.body.groupName),
            projectPhase=parseInt(req.body.projectPhase);
            if (projectName.length>122 || projectDescription.length > 256 || projectDescription.length > 512) {
                res.end(JSON.stringify({
                    return : "error",
                    status : false,
                    data : "Part of the information you entered was too long. The project's name must not exceed 128 characters (maybe the description or the project genre is too long)."
                }));
            } else if (projectPhase<0 || projectPhase>3){
                res.end(JSON.stringify({
                    return : "error",
                    status : false,
                    data : "The project phase is.. not as expected (should be an int. between 0 and 3)"
                }));           
            } else if (projectName.indexOf('/')>-1) {
                res.end(JSON.stringify({
                    return : "error",
                    status : false,
                    data : "The project name cannot contain '/' char."
                }));     
            }
            else {
                dilabConnection.query(`SELECT id FROM DilabMusicGroups WHERE groupName="${groupName}" LIMIT 1`,(err,results,fields)=> {
                    if (err) {
                        res.end(JSON.stringify({
                            return : "error",
                            status : false,
                            data : "There was a problem with the server, sorry."
                        }));
                    } else if (results.length==0) {
                        res.end(JSON.stringify({
                            return : "error",
                            status : false,
                            data : "Invalid group name : it doesn't exist !"
                        }));
                    } else {
                        var audioFile=false,projectFile=false,projectPPFile=false,
                        audioIndex=null,projectIndex=null,projectPPIndex=null,
                        filename1=null,filename2=null,filename3=null;
                        fileIndex=0; //Increments when a file of a searched type has been loaded
                        if (req.body.audioFile=="true" && req.files.length>fileIndex) { // Check if file uploaded
                            if (req.files[fileIndex].size > 2097152*4){ // Check file size (8MB max)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                        fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status" : false,"data" : "Audio File is too big !" }');
                                return;
                            } else if (req.files[0].mimetype.slice(0,req.files[0].mimetype.indexOf('/'))!="audio") { // Check file type (image ?)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                    fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status": false,"data" : "Uploaded Audio file must be.. an audio !" }');
                            } else {
                                if (!fs.existsSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName)) {
                                    fs.mkdirSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName);
                                }
                                filename1=projectName+req.files[fileIndex].filename.slice(req.files[fileIndex].filename.lastIndexOf('.'));
                                console.log(filename1)
                                fs.move(req.files[fileIndex].path,"/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName+"/"+filename1).then(()=>{
                                    fs.unlink(req.files[fileIndex].path,()=>{return;});
                                });;
                                audioIndex=fileIndex;
                                audioFile=true;
                            }
                            fileIndex++;
                        } if (req.body.projectFile=="true" && req.files.length>fileIndex) { // Check if file uploaded
                            if (req.files[fileIndex].size > 2097152*4){ // Check file size (8MB max)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                        fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status" : false,"data" : "Project File is too big !" }');
                                return;
                            } else if (req.files[0].mimetype.slice(0,req.files[0].mimetype.indexOf('/'))=="audio") { // Check file type (image ?)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                    fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status": false,"data" : "Uploaded Project file must be.. a project file !" }');
                            } else {
                                if (!fs.existsSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName)) {
                                    fs.mkdirSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName);
                                }
                                filename2=projectName+req.files[fileIndex].filename.slice(req.files[fileIndex].filename.lastIndexOf('.'))
                                fs.move(req.files[fileIndex].path,"/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+filename2).then(()=>{
                                    fs.unlink(req.files[fileIndex].path,()=>{return;});
                                });;
                                projectIndex=fileIndex;
                                projectFile=true;
                            }
                            fileIndex++;
                        } if (req.body.projectPPFile=="true" && req.files.length>fileIndex) { // Check if file uploaded
                            if (req.files[fileIndex].size > 2097152*4){ // Check file size (8MB max)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                        fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status" : false,"data" : "Project File is too big !" }');
                                return;
                            } else if (req.files[fileIndex].mimetype.slice(0,req.files[0].mimetype.indexOf('/'))=="audio") { // Check file type (image ?)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                    fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status": false,"data" : "Uploaded Project file must be.. a project file !" }');
                            } else {
                                if (!fs.existsSync("/media/edouda/DiskloudExt/DilabFiles/projectPP/"+groupName)) {
                                    fs.mkdirSync("/media/edouda/DiskloudExt/DilabFiles/projectPP/"+groupName);
                                }
                                filename3=projectName+req.files[fileIndex].filename.slice(req.files[fileIndex].filename.lastIndexOf('.'));
                                fs.move(req.files[fileIndex].path,"/media/edouda/DiskloudExt/DilabFiles/projectPP/"+filename3).then(()=>{
                                    fs.unlink(req.files[fileIndex].path,()=>{return;});
                                });
                                projectPPIndex=fileIndex;
                                projectPPFile=true;
                            }
                        }
                        console.log(`INSERT INTO DilabProject (name, groupAuthor, genres, currentPhase, projectPicture, audioFileDir, projectFileDir, lyrics, description) 
                        VALUES ("${projectName}","${results[0].id}","${projectGenre}","${projectPhase}","${projectPPFile ? groupName+"/"+filename1 : "disc.svg"}",
                        ${audioFile ?  '"' + groupName+"/"+filename1 + '"' : "NULL"}, ${projectFile ?  '"' + groupName+"/"+filename1 +'"' : "NULL"},"${projectLyrics}","${projectDescription}")`);

                        dilabConnection.query(`INSERT INTO DilabProject (name, groupAuthor, genres, currentPhase, projectPicture, audioFileDir, projectFileDir, lyrics, description) 
                        VALUES ("${projectName}",${results[0].id},"${projectGenre}",${projectPhase},"${projectPPFile ? groupName+"/"+filename1 : "disc.svg"}",
                        ${audioFile ?  '"' + groupName+"/"+filename1 + '"' : "NULL"}, ${projectFile ?  '"' + groupName+"/"+filename1 +'"' : "NULL"},"${projectLyrics}","${projectDescription}")`,(err,results,fields)=> {
                            if (err) {
                                res.end(JSON.stringify({
                                    return : "error",
                                    status : false,
                                    data : "The server is not doing well :("
                                }));
                                throw err;
                            } else if (results.affectedRows==1) {
                                res.end({
                                    return : "ok",
                                    status : true,
                                    data : "Project created !"
                                });
                            } else {
                                res.end({
                                    return : "ok",
                                    status : false,
                                    data : "Seems like you choose a project name that already exists in your group. Find another project name or choose another group for that project."
                                });
                            }
                            if (req.files) {
                                for (var i=0;i<req.files.length;i++)
                                    fs.unlinkSync(req.files[i].path,()=>{return;});
                                    i--;
                                }
                        });
                    }
                });
            }
        }
    } else if (req.params.action=="check") {
        if (req.body.type=="password" && req.body.value && req.session.dilab) {
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
            dilabConnection.query(`SELECT * FROM DilabUser WHERE id=${mysql_real_escape_string(req.session.dilab)} AND motDePasse=AES_ENCRYPT("${mysql_real_escape_string(req.body.value)}","${cryptoKey}");`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                }
                if (results.length!=0) {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : true
                        }));
                } else {
                    res.end('{ "return" : "ok", "status" : false, "data" : "data seems to be invalid" }');
                }
            });
        } else if (req.body.type=="usernameAvailable" && req.body.value) {
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
            dilabConnection.query(`SELECT pseudo FROM DilabUser WHERE pseudo="${mysql_real_escape_string(req.body.value)}"`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                }
                else if (results.length!=0) {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : false
                        }));
                } else {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : true
                    }));
                }
            });
        } else if (req.body.type=="emailAvailable" && req.body.value) {
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
            dilabConnection.query(`SELECT pseudo FROM DilabUser WHERE email="${mysql_real_escape_string(req.body.value)}"`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                }
                else if (results.length!=0) {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : false
                        }));
                } else {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : true
                    }));
                }
            });
        } else if (req.body.type=="projectNameAvailable" && req.body.projectName && req.body.groupName) {
            dilabConnection.query(`SELECT name FROM DilabProject
            JOIN DilabMusicGroups ON DilabProject.groupAuthor=DilabMusicGroups.id
            WHERE DilabProject.name="${mysql_real_escape_string(req.body.projectName)}" AND DilabMusicGroups.groupName="${mysql_real_escape_string(req.body.groupName)}" LIMIT 1;`,(err,results,fields)=> {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                }
                else if (results.length!=0) {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : true
                        }));
                } else {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : false
                    }));
                }
            });
            //Temp file cleanup (to avoid keeping ignored files..)
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        } else {
            res.status(400).end('{ "return" : "invalid POST data" }')
        }
    } else {
        res.status(400).end('{ "return" : "no valid path" }')
        //Temp file cleanup (to avoid keeping ignored files..)
        if (req.files) {
            for (var i=0;i<req.files.length;i++)
            fs.unlink(req.files[i].path,()=>{return;});
        }
    }
});
