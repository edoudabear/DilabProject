/*
Attention : ce code est en réalité une portion du code qui tourne sur le serveur accessible à l'adresse https://e.diskloud.fr. Cette portion du code correspond à l'ensemble des fonctions cruciales pour le fonctionnement du projet Web Dilab
Le code ne fonctionne cependant pas de manière indépendante, car il y a certaines librairies qui ne sont pas initialisées dans ce script.

Ne vous laissez pas faire impressionner ! Cela a pris des mois de développement et même si le code est très conséquent, il n'est finalement pas si compliqué. Avec le club Web, vous aurez le moyens de tout comprendre :)
*/

dilabConnection.connect();
var cryptoKey=String(fs.readFileSync(__dirname + '/../expressjs/dilabKey.txt')).replace(/\n/g,'');
// node native promisify -> Creates an async query function (for "await query()")
const dilabQuery = util.promisify(dilabConnection.query).bind(dilabConnection);

Date.prototype.addHours = function(h) { // to set universal time to GMT +2 hours
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}  

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
    } else if (req.params.action == "releaseFile") {
        if (parseInt(req.params.file)>=0) { // req.params.file must correspond to the release id here
            if (fs.existsSync(`/media/edouda/DiskloudExt/DilabFiles/releaseFiles/${parseInt(req.params.file)}.audio`)) {
                res.sendFile(`/media/edouda/DiskloudExt/DilabFiles/releaseFiles/${parseInt(req.params.file)}.audio`);
            } else {
                res.status(404).end("No such file");
            }
        } else {
            res.status(404).send("Bad input");
        }
    } else {
        res.status(404).end("Bad Path");
    }
});

app.get("/Dilab/:action/:groupName/:projectName/", function(req,res) {
    console.log(`/media/edouda/DiskloudExt/DilabFiles/projectPP/${decodeURI(req.params.groupName).replace(/\//g,"")}/${decodeURI(req.params.projectName).replace(/\//g,"")}.png`);
    if (req.params.action == "project" ) {
        if (fs.existsSync(`/media/edouda/DiskloudExt/DilabFiles/projectPP/${decodeURI(req.params.groupName).replace(/\//g,"")}/${decodeURI(req.params.projectName).replace(/\//g,"")}.PNG`)) {
            res.sendFile(`/media/edouda/DiskloudExt/DilabFiles/projectPP/${decodeURI(req.params.groupName).replace(/\//g,"")}/${decodeURI(req.params.projectName).replace(/\//g,"")}.PNG`);
        } else {
            res.status(404).end("No such file");
        }
    } else {
        res.status(404).send("Bad path");
    }
});

app.get("/Dilab/:action/:groupName/:projectName/:fileName", function(req,res) {
    console.log(`/media/edouda/DiskloudExt/DilabFiles/projectFiles/${decodeURI(req.params.groupName).replace(/\//g,"")}/${decodeURI(req.params.projectName).replace(/\//g,"")}/${decodeURI(req.params.fileName).replace(/\//g,"")}`);
    if (req.params.action == "project" ) {
        if (fs.existsSync(`/media/edouda/DiskloudExt/DilabFiles/projectFiles/${decodeURI(req.params.groupName).replace(/\//g,"")}/${decodeURI(req.params.projectName).replace(/\//g,"")}/${decodeURI(req.params.fileName).replace(/\//g,"")}`)) {
            res.sendFile(`/media/edouda/DiskloudExt/DilabFiles/projectFiles/${decodeURI(req.params.groupName).replace(/\//g,"")}/${decodeURI(req.params.projectName).replace(/\//g,"")}/${decodeURI(req.params.fileName).replace(/\//g,"")}`);
        } else {
            res.status(404).end("No such file");
        }
    } else {
        res.status(404).end("Bad path");
    }
});

app.post("/Dilab/:action", upload.array("files"), (req,res,err) => {
    if (err instanceof multer.MulterError) {
        res.status(400).end('{ "status" : "error", "output": "false","data" : "we were unable to parse your data"}');
        if (req.files) {
            for (var i=0;i<req.files.length;i++)
            fs.unlink(req.files[i].path,()=>{return;});
        }
    } if (req.params.action=="connect") { // Path sort, THEN POST body analysis
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
        if (req.body.type=="mainReleases") {
            dilabConnection.query(`
            WITH cte AS (
                SELECT songId,COUNT(*) as nb_streams FROM DilabStreams GROUP BY songId
            )
            SELECT releaseDate, DilabMusicGroups.groupName, projectBirthDate,name,releasePicture,duration,filePath,lyrics,COALESCE(nb_streams,0) AS nb_streams
            FROM DilabReleases dr
            LEFT JOIN cte ON dr.id=cte.songId
            JOIN DilabMusicGroups ON DilabMusicGroups.id=dr.groupAuthor
            ORDER BY nb_streams DESC,releaseDate DESC LIMIT 15;`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                } else {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                }
            });
        } else if (req.body.type=="genre" && req.body.genrePattern) {
            dilabConnection.query(`SELECT id,genreName FROM DilabGenres WHERE genreName LIKE '${req.body.genrePattern}%' LIMIT 10`,(err,results,fields)=> {
                if (err) {
                    res.end(JSON.stringify({
                        return : "error",
                        status : false,
                        data : "internal server error"
                    }));
                } else {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results
                    }));
                }
            });
        } else if (req.body.type=="mainReleasesByGenre" && req.body.genreId) {
            dilabConnection.query(`
            WITH cte AS (
                SELECT songId,COUNT(*) as nb_streams FROM DilabStreams GROUP BY songId
            )
            SELECT releaseDate, DilabGenres.genreName, DilabMusicGroups.groupName, projectBirthDate,name,releasePicture,duration,filePath,lyrics,COALESCE(nb_streams,0) AS nb_streams
            FROM DilabReleases dr
            LEFT JOIN cte ON dr.id=cte.songId
            JOIN DilabMusicGroups ON DilabMusicGroups.id=dr.groupAuthor
            JOIN DilabGenres ON DilabMusicGroups.genres=DilabGenres.id
            WHERE DilabMusicGroups.genres=${dilabConnection.escape(req.body.genreId)}
            ORDER BY nb_streams DESC,releaseDate DESC LIMIT 15;`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                } else {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                }
            }); 
        } else if (req.body.type=="newestReleases") {
            dilabConnection.query(`
            WITH cte AS (
                SELECT songId,COUNT(*) as nb_streams FROM DilabStreams GROUP BY songId
            )
            SELECT releaseDate, DilabMusicGroups.groupName, projectBirthDate,name,releasePicture,duration,filePath,lyrics,COALESCE(nb_streams,0) AS nb_streams
            FROM DilabReleases dr
            LEFT JOIN cte ON dr.id=cte.songId
            JOIN DilabMusicGroups ON DilabMusicGroups.id=dr.groupAuthor
            ORDER BY dr.releaseDate DESC LIMIT 15;`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                } else {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                }
            }); 
        } else if (req.body.type=="mainGroups") {
            dilabConnection.query(`SELECT DilabMusicGroups.groupName,DilabGenres.genreName AS genres,DilabMusicGroups.groupPicture,DilabMusicGroups.dateOfBirth,DilabMusicGroups.description,
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators, COUNT(DISTINCT DilabProject.id) AS nProjects, COUNT(DISTINCT DilabReleases.id) AS nReleases FROM DilabMusicGroups
                        LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabMusicGroups.id 
                        LEFT JOIN DilabProject ON DilabProject.groupAuthor=DilabMusicGroups.id
                        LEFT JOIN DilabReleases ON DilabReleases.groupAuthor=DilabMusicGroups.id
                        LEFT JOIN DilabGenres ON DilabMusicGroups.genres=DilabGenres.id
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
                    res.end('{ "return" : "ok", "status" : false, "description" : "account is unfindable" }');
                }
            });
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        } else if (req.body.type=="mainGroupsByGenre" && req.body.genreId) {
            dilabConnection.query(`SELECT DilabMusicGroups.groupName,DilabGenres.genreName AS genres,DilabMusicGroups.groupPicture,DilabMusicGroups.dateOfBirth,DilabMusicGroups.description,
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators, COUNT(DISTINCT DilabProject.id) AS nProjects, COUNT(DISTINCT DilabReleases.id) AS nReleases FROM DilabMusicGroups
                        LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabMusicGroups.id 
                        LEFT JOIN DilabProject ON DilabProject.groupAuthor=DilabMusicGroups.id
                        LEFT JOIN DilabReleases ON DilabReleases.groupAuthor=DilabMusicGroups.id
                        LEFT JOIN DilabGenres ON DilabMusicGroups.genres=DilabGenres.id
                        WHERE DilabMusicGroups.genres=${parseInt(req.body.genreId)}
                        GROUP BY DilabMusicGroups.id
                        ORDER BY nCollaborators DESC, dateOfBirth DESC LIMIT 10;`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    console.log(err);
                    res.end(JSON.stringify({
                        "return" : "error",
                        "data" : "internal server error",
                        "stats" : false
                    }));
                } else if (results.length!=0) {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                } else {
                    res.end('{ "return" : "ok", "status" : true, "data" : [] }');
                }
            });
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        } else if (req.body.type=="mainProjects") {
            dilabConnection.query(`SELECT DilabProject.name,
            DilabProject.currentPhase,
            DilabProject.projectPicture,
            DilabProject.audioFileDir,
            DilabProject.description,
            DilabProject.dateOfBirth,
            DilabMusicGroups.groupName,
            -- DilabProject.lyrics
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators
            FROM DilabProject
            LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabProject.groupAuthor
            LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabProject.groupAuthor 
            WHERE isReleased=false 
            -- AND genres=""
            GROUP BY DilabProject.id
            ORDER BY nCollaborators DESC, DilabProject.dateOfBirth DESC LIMIT 10;`,(err,results,fields)=> {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                } else if (results.length!=0) {
                    res.setHeader("Content-Type","Application/json")
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                } else {
                    res.end('{ "return" : "ok", "status" : false, "data" : "project is unfindable" }');
                }
            });
        } else if (req.body.type=="mainProjectsByGenre" && req.body.genreId) {
            dilabConnection.query(`SELECT DilabProject.name,
            DilabProject.currentPhase,
            DilabProject.projectPicture,
            DilabProject.audioFileDir,
            DilabProject.description,
            DilabProject.dateOfBirth,
            DilabMusicGroups.groupName,
            -- DilabProject.lyrics
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators
            FROM DilabProject
            LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabProject.groupAuthor
            LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabProject.groupAuthor 
            WHERE isReleased=false 
            AND DilabMusicGroups.genres=${parseInt(req.body.genreId)}
            GROUP BY DilabProject.id
            ORDER BY nCollaborators DESC, DilabProject.dateOfBirth DESC LIMIT 10;`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    console.log(err);
                    res.end(JSON.stringify({
                        "return" : "error",
                        "data" : "internal server error",
                        "stats" : false
                    }));
                } else if (results.length!=0) {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                } else {
                    res.end('{ "return" : "ok", "status" : true, "data" : [] }');
                }
            });
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        } else if (req.body.type=="mainProjectsByGroup" && req.body.groupName ) {
            dilabConnection.query(`SELECT DilabProject.name,
            DilabProject.currentPhase,
            DilabProject.projectPicture,
            DilabProject.audioFileDir,
            DilabProject.description,
            DilabProject.dateOfBirth,
            DilabMusicGroups.groupName,
            -- DilabProject.lyrics
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators
            FROM DilabProject
            LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabProject.groupAuthor
            LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabProject.groupAuthor 
            WHERE isReleased=false 
            AND DilabMusicGroups.groupName=${dilabConnection.escape(decodeURI(req.body.groupName))}
            GROUP BY DilabProject.id
            ORDER BY nCollaborators DESC, DilabProject.dateOfBirth DESC LIMIT 10;`,(err,results,fields) => {
                if (err) { // DBS Query Error
                    console.log(err);
                    res.end(JSON.stringify({
                        "return" : "error",
                        "data" : "internal server error",
                        "stats" : false
                    }));
                } else if (results.length!=0) {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                } else {
                    res.end('{ "return" : "ok", "status" : true, "data" : [] }');
                }
            });
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        } else if (req.body.type=="groupsWhereUserIsAdmin" && req.session.dilab) {
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
                    res.end('{ "return" : "ok", "status" : false, "data" : "account is unfindable" }');
                }
            });
            if (req.files) {
                for (var i=0;i<req.files.length;i++)
                fs.unlink(req.files[i].path,()=>{return;});
            }
        } else if (req.body.type=="project" && req.body.projectGroup && req.body.projectName) {
            dilabConnection.query(`SELECT DilabProject.name,
            DilabProject.currentPhase,
            DilabProject.projectPicture,
            DilabProject.audioFileDir,
            DilabProject.lyrics,
            DilabProject.projectFileDir,
            DilabProject.lastAudioFileUpdate,
            DilabProject.lastProjectFileUpdate,
            DilabProject.description,
            DilabProject.dateOfBirth,
            DilabMusicGroups.groupName,
            DilabGenres.genreName,
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators
            FROM DilabProject
            LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabProject.groupAuthor
            LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabProject.groupAuthor
            LEFT JOIN DilabGenres ON DilabMusicGroups.genres=DilabGenres.id
            WHERE isReleased=false 
            AND DilabProject.name=${dilabConnection.escape(decodeURI(req.body.projectName))}
            AND DilabMusicGroups.groupName=${dilabConnection.escape(decodeURI(req.body.projectGroup))}
            GROUP BY DilabProject.id
            LIMIT 1;`,(err,results,fields)=> {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                } else if (results.length!=0) {
                    res.setHeader("Content-Type","Application/json")
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results.flat()}));
                } else {
                    res.end('{ "return" : "ok", "status" : false, "data" : "project is unfindable" }');
                }
            });
        } else if (req.body.type=="projectChat" && req.body.projectName && req.body.groupName && req.session.dilab) {
            dilabConnection.query(`SELECT DilabChats.message, DilabUser.pseudo, DilabChats.sendTime, DilabChats.isFileDir, DilabChats.isGroupOrProject, (${parseInt(req.session.dilab)}=DilabChats.author) AS isAuthorRequester
            FROM DilabChats
            LEFT JOIN DilabUser ON DilabUser.id=DilabChats.author
            LEFT JOIN DilabProject ON DilabChats.groupProjectPVChatId = DilabProject.id
            LEFT JOIN DilabMusicGroups ON DilabProject.groupAuthor=DilabMusicGroups.id
            WHERE isGroupOrProject="p"AND DilabProject.name=${dilabConnection.escape(decodeURIComponent(req.body.projectName))} AND DilabMusicGroups.groupName=${dilabConnection.escape(decodeURIComponent(req.body.groupName))} ${(req.body.minTime) ? ` AND DilabChats.sendTime>="${new Date(req.body.minTime).addHours(2).toISOString().slice(0, 19).replace('T', ' ')}"` : `` }
            ORDER BY sendTime`,(err,results,fields)=> {
                if (err) {
                    console.log(err);
                    res.end(JSON.stringify({
                        return : "error",
                        status : false,
                        data : "internal server error"
                    }));
                } else {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results
                    }));
                }
            });
        } else if (req.body.type=="group" && req.body.groupName) {
            var groupName=decodeURI(mysql_real_escape_string(req.body.groupName));
            dilabConnection.query(`
            /*1 (Group basic informations)*/
            SELECT DilabMusicGroups.groupPicture,DilabMusicGroups.groupName,DilabMusicGroups.description,COUNT(*) AS nCollaborators,adminTb.pseudo AS admin,DilabMusicGroups.dateOfBirth,founderTb.pseudo as founder,DilabGenres.genreName AS genres, DilabMusicGroups.admin=${typeof req.session.dilab=="number" ? req.session.dilab : "NULL"} AS isUserAdmin FROM DilabMusicGroups
            LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabMusicGroups.id
            JOIN DilabUser AS founderTb ON founderTb.id=DilabMusicGroups.founder
            JOIN DilabUser AS adminTb ON adminTb.id=DilabMusicGroups.admin
            LEFT JOIN DilabGenres ON DilabMusicGroups.genres=DilabGenres.id
            WHERE groupName="${groupName}"
            GROUP BY DilabMusicGroups.id
            LIMIT 1;

                                    /*1 (Group basic informations)*/
                                    /*SELECT DilabMusicGroups.groupPicture,DilabMusicGroups.groupName,DilabMusicGroups.description,adminTb.pseudo as admin,DilabMusicGroups.dateOfBirth,founderTb.pseudo as founder,DilabGenres.genreName AS genres, DilabMusicGroups.admin=${typeof req.session.dilab=="number" ? req.session.dilab : "NULL"} AS isUserAdmin FROM DilabMusicGroups 
                                    JOIN DilabUser AS founderTb ON founderTb.id=DilabMusicGroups.founder
                                    JOIN DilabUser AS adminTb ON adminTb.id=DilabMusicGroups.admin
                                    LEFT JOIN DilabGenres ON DilabMusicGroups.genres=DilabGenres.id
                                    WHERE groupName="${groupName}"; */

            /*2 (Group's main releases)*/
            WITH cte AS (
                SELECT songId,COUNT(*) as nb_streams FROM DilabStreams GROUP BY songId
            )
            SELECT releaseDate, projectBirthDate,name,releasePicture,duration,filePath,lyrics,COALESCE(nb_streams,0) AS nb_streams
            FROM DilabReleases dr
            LEFT JOIN cte ON dr.id=cte.songId
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
            SELECT DilabProject.name, DilabProject.currentPhase,DilabProject.projectPicture,DilabProject.description FROM DilabProject
                JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabProject.groupAuthor
                WHERE DilabProject.isReleased=FALSE AND DilabMusicGroups.groupName="${groupName}"
                ORDER BY DilabProject.dateOfBirth DESC LIMIT 20;
            `,(err,results,fields)=> {
                    if (err) { // DBS Query Error
                        console.log(err);
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
        } else if (req.body.type=="groupChat" && req.body.groupName && req.session.dilab) {
            dilabConnection.query(`SELECT DilabChats.message, DilabUser.pseudo, DilabChats.sendTime, DilabChats.isFileDir, DilabChats.isGroupOrProject, (${parseInt(req.session.dilab)}=DilabChats.author) AS isAuthorRequester
            FROM DilabChats
            LEFT JOIN DilabUser ON DilabUser.id=DilabChats.author
            LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabChats.groupProjectPVChatId
            WHERE isGroupOrProject="g"AND DilabMusicGroups.groupName=${dilabConnection.escape(decodeURIComponent(req.body.groupName))} ${(req.body.minTime) ? ` AND DilabChats.sendTime>="${new Date(req.body.minTime).addHours(2).toISOString().slice(0, 19).replace('T', ' ')}"` : `` }
            ORDER BY sendTime`,(err,results,fields)=> {
                if (err) {
                    res.end(JSON.stringify({
                        return : "error",
                        status : false,
                        data : "internal server error"
                    }));
                } else {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results
                    }));
                }
            });
        } else if (req.body.type=="artist" && req.body.artistName) {
            dilabConnection.query(`
            /* Query 1 */
            SELECT DilabUser.nom,
            DilabUser.pseudo,
            DilabUser.prenom,
            DilabUser.biographie,
            DilabGenres.genreName as genre,
            DilabUser.profilePictureName,
            DilabUser.dateCreation
            FROM DilabUser
            LEFT JOIN DilabGenres ON DilabGenres.id=DilabUser.genres
            WHERE pseudo=${dilabConnection.escape(decodeURI(req.body.artistName))} 
            LIMIT 1;
            
            /* Query 2 */
            SELECT DilabMusicGroups.groupName,DilabGenres.genreName AS genres,DilabMusicGroups.groupPicture,DilabMusicGroups.dateOfBirth,DilabMusicGroups.description,
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators, COUNT(DISTINCT DilabProject.id) AS nProjects,
            COUNT(DISTINCT DilabReleases.id) AS nReleases, founder=DilabUser.id AS isAdmin FROM DilabMusicGroups
            JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabMusicGroups.id
            JOIN DilabUser ON  DilabUser.id=DilabGroupMembers.memberId
            LEFT JOIN DilabProject ON DilabProject.groupAuthor=DilabMusicGroups.id
            LEFT JOIN DilabReleases ON DilabReleases.groupAuthor=DilabMusicGroups.id
            LEFT JOIN DilabGenres ON DilabMusicGroups.genres=DilabGenres.id
            WHERE DilabUser.pseudo=${dilabConnection.escape(decodeURI(req.body.artistName))}
            GROUP BY DilabMusicGroups.id
            ORDER BY nCollaborators DESC, dateOfBirth DESC LIMIT 10;
            
            `,(err,results,fields)=> {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                } else if (results.length!=0) {
                    res.setHeader("Content-Type","Application/json")
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results}));
                } else {
                    res.end('{ "return" : "ok", "status" : false, "data" : "project is unfindable" }');
                }
            });
        } else if (req.body.type=="search" && req.body.searchPattern) {
            if (req.body.searchPattern=="" || typeof (req.body.searchPattern)!="string") {
                res.end(JSON.stringify({
                    return : "error",
                    status : false,
                    data : "Invalid search pattern."
                }));
            }
            dilabConnection.query(`
            /*1. Releases search*/
            WITH cte AS (
                SELECT songId,COUNT(*) as nb_streams FROM DilabStreams GROUP BY songId
            )
            SELECT releaseDate, DilabMusicGroups.groupName, projectBirthDate,name,releasePicture,duration,filePath,COALESCE(nb_streams,0) AS nb_streams
            FROM DilabReleases dr
            LEFT JOIN cte ON dr.id=cte.songId
            JOIN DilabMusicGroups ON DilabMusicGroups.id=dr.groupAuthor
            WHERE (${generateSearchPatterns("name",req.body.searchPattern)}) OR (${generateSearchPatterns("groupName",req.body.searchPattern)})
            ORDER BY nb_streams DESC,releaseDate DESC LIMIT 20;

            /*2. Projects search */
            SELECT DilabProject.name,
            DilabProject.currentPhase,
            DilabProject.projectPicture,
            DilabProject.audioFileDir,
            DilabProject.description,
            DilabProject.dateOfBirth,
            DilabMusicGroups.groupName,
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators
            FROM DilabProject
            LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabProject.groupAuthor
            LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabProject.groupAuthor 
            WHERE isReleased=false AND (${generateSearchPatterns("name",req.body.searchPattern)}) OR (${generateSearchPatterns("groupName",req.body.searchPattern)})
            GROUP BY DilabProject.id
            ORDER BY nCollaborators DESC, DilabProject.dateOfBirth DESC LIMIT 20;

            /*3. Group search*/
            SELECT DilabMusicGroups.groupName,DilabGenres.genreName AS genres,DilabMusicGroups.groupPicture,DilabMusicGroups.dateOfBirth,DilabMusicGroups.description,
            COUNT(DISTINCT DilabGroupMembers.id) AS nCollaborators, COUNT(DISTINCT DilabProject.id) AS nProjects, COUNT(DISTINCT DilabReleases.id) AS nReleases FROM DilabMusicGroups
            LEFT JOIN DilabGroupMembers ON DilabGroupMembers.groupId=DilabMusicGroups.id 
            LEFT JOIN DilabProject ON DilabProject.groupAuthor=DilabMusicGroups.id
            LEFT JOIN DilabReleases ON DilabReleases.groupAuthor=DilabMusicGroups.id
            LEFT JOIN DilabGenres ON DilabMusicGroups.genres=DilabGenres.id
            WHERE  (${generateSearchPatterns("groupName",req.body.searchPattern)})
            GROUP BY DilabMusicGroups.id
            ORDER BY nCollaborators DESC, dateOfBirth DESC LIMIT 20;
            
            /*4. Artists search*/
            SELECT 
            DilabUser.nom,
            DilabUser.prenom,
            DilabUser.pseudo,
            DilabUser.biographie,
            DilabUser.dateCreation,
            DilabGenres.genreName as genre,
            DilabUser.profilePictureName
            FROM DilabUser
            LEFT JOIN DilabGenres ON DilabGenres.id=DilabUser.genres
            WHERE (${generateSearchPatterns("DilabUser.pseudo",req.body.searchPattern)})
            LIMIT 20;`,(err,results,fields)=> {
                if (err) {
                    console.error(err);
                    res.end(JSON.stringify({
                        return : "error",
                        status : false,
                        data : "There was an error while performing your request. Try again later."
                    }));
                }
                else {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : JSON.stringify(results)
                        })
                    );
                }
            });
        } else if (req.body.type=="artistChat" && req.body.artistName && req.session.dilab) {
            dilabConnection.query(`
            /* NOT OPTIMIZED YET */
            SELECT DilabChats.message, DilabUser.pseudo, DilabChats.sendTime, DilabChats.isFileDir, DilabChats.isGroupOrProject, DilabMusicGroups.groupName, (15=DilabChats.author) AS isAuthorRequester
            FROM DilabChats
            LEFT JOIN DilabUser ON DilabUser.id=DilabChats.author
            LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabChats.groupProjectPVChatId
            WHERE isGroupOrProject="t"AND DilabMusicGroups.groupName="Edoudé"
            ORDER BY sendTime`,(err,results,fields)=> {
                if (err) {
                    res.end(JSON.stringify({
                        return : "error",
                        status : false,
                        data : "internal server error"
                    }));
                } else {
                    res.end(JSON.stringify({
                        return : "ok",
                        status : true,
                        data : results
                    }));
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
        if (req.body.type=="newJoinRequest" && req.body.groupName && req.session.dilab) {
            dilabConnection.query(`INSERT INTO DilabMembersWaitList (waiter,groupId) SELECT ${req.session.dilab},id FROM DilabMusicGroups WHERE groupName=${dilabConnection.escape(decodeURIComponent(req.body.groupName))} LIMIT 1`,(err,results,fields) => {
                if (err) {
                    console.log("Went here");
                    console.log(err);
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : false,
                            "data" : "server error"
                    }));
                    return;
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
        } else if (req.body.type=="answerToJoinRequest" && (req.body.answer===false || req.body.answer===true) && req.body.groupName && req.body.userName && req.session.dilab) {
            if (req.body.answer==true) {
                dilabConnection.query(`
                INSERT INTO DilabGroupMembers (memberId,groupId)
                    SELECT waiter,groupId FROM DilabMembersWaitList
                    LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabMembersWaitList.groupId
                    LEFT JOIN DilabUser ON DilabUser.id=DilabMembersWaitList.waiter
                    WHERE DilabMusicGroups.admin = ${req.session.dilab} AND DilabMusicGroups.groupName=${dilabConnection.escape(req.body.groupName)} AND DilabUser.pseudo=${dilabConnection.escape(req.body.userName)}  LIMIT 1;

                DELETE DilabMembersWaitList FROM DilabMembersWaitList
                    LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabMembersWaitList.groupId
                    LEFT JOIN DilabUser ON DilabUser.id=DilabMembersWaitList.waiter
                    WHERE DilabMusicGroups.admin = ${req.session.dilab} AND DilabMusicGroups.groupName=${dilabConnection.escape(req.body.groupName)} AND DilabUser.pseudo=${dilabConnection.escape(req.body.userName)} ;`,(err,results,fields) => {
                        if (err) {
                            res.end(JSON.stringify(
                                { "return" : "ok",
                                    "status" : false,
                                    "data" : "server error"
                            }));
                        } else if (results[1].affectedRows==1) {
                            res.end(JSON.stringify(
                                { "return" : "ok",
                                    "status" : true,
                                    "data" : true
                                }));
                        } else {
                            res.end(JSON.stringify(
                                { "return" : "ok",
                                    "status" : false,
                                    "data" : true
                                }));
                        }
                    });
            } else {
                dilabConnection.query(`
                INSERT INTO DilabNotificationsList (targetedUser,content,type)
                SELECT DilabMembersWaitList.waiter,CONCAT("You have been rejected from the group <a href=\\"/Dilab/group?g=",DilabMusicGroups.groupName,"\\">",DilabMusicGroups.groupName,"</a>"),"denial" FROM DilabMembersWaitList
                LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabMembersWaitList.groupId
                LEFT JOIN DilabUser ON DilabUser.id=DilabMembersWaitList.waiter
                WHERE DilabMusicGroups.admin = ${req.session.dilab} AND DilabMusicGroups.groupName=${dilabConnection.escape(req.body.groupName)} AND DilabUser.pseudo=${dilabConnection.escape(req.body.userName)}  LIMIT 1;
                

                DELETE DilabMembersWaitList FROM DilabMembersWaitList
                LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabMembersWaitList.groupId
                LEFT JOIN DilabUser ON DilabUser.id=DilabMembersWaitList.waiter
                WHERE DilabMusicGroups.admin = ${req.session.dilab} AND DilabMusicGroups.groupName=${dilabConnection.escape(req.body.groupName)} AND DilabUser.pseudo=${dilabConnection.escape(req.body.userName)} ;`,(err,results,fields) => {
                    if (err) {
                        console.log(err);
                        res.end(JSON.stringify(
                            { "return" : "ok",
                                "status" : false,
                                "data" : "server error"
                        }));
                    } else if (results[1].affectedRows==1) {
                        res.end(JSON.stringify(
                            { "return" : "ok",
                                "status" : true,
                                "data" : true
                            }));
                    } else {
                        res.end(JSON.stringify(
                            { "return" : "ok",
                                "status" : false,
                                "data" : true
                            }));
                    }
                });
            }
        } else if (req.body.type="passwordViaPreviousPassword" && req.body.prevPassword && req.body.newPassword && req.session.dilab) {
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
            && req.body.email && req.body.genres && req.body.biography) {
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
                if (typeof req.body.genres!="number") {
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
                        dilabQuery(`INSERT INTO DilabUser (nom,prenom,pseudo,motDePasse,email,biographie,genres,profilePictureName) VALUES ("${mysql_real_escape_string(req.body.lastName)}", "${mysql_real_escape_string(req.body.firstName)}", "${mysql_real_escape_string(req.body.username)}", AES_ENCRYPT("${mysql_real_escape_string(req.body.password)}","${cryptoKey}"), "${mysql_real_escape_string(req.body.email)}", "${mysql_real_escape_string(req.body.biography)}", ${mysql_real_escape_string(req.body.genres)}, "${mysql_real_escape_string(req.body.username)}.png")`).catch((err) => {serverError(res,err)})
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
                    dilabQuery(`INSERT INTO DilabUser (nom,prenom,pseudo,motDePasse,email,biographie,genres) VALUES ("${mysql_real_escape_string(req.body.lastName)}", "${mysql_real_escape_string(req.body.firstName)}", "${mysql_real_escape_string(req.body.username)}", AES_ENCRYPT("${mysql_real_escape_string(req.body.password)}","${cryptoKey}"), "${mysql_real_escape_string(req.body.email)}", "${mysql_real_escape_string(req.body.biography)}", ${mysql_real_escape_string(req.body.genres)})`).catch((err) => {serverError(res,err)})
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
                    dilabConnection.query(`INSERT INTO DilabMusicGroups (groupName, groupPicture,description, admin, founder, genres) VALUES ('${groupName}','${groupName}.png','${groupDescription}',${req.session.dilab},${req.session.dilab},${dilabConnection.escape(groupOrientation)}); INSERT INTO DilabGroupMembers (memberId,groupId) SELECT ${req.session.dilab},id FROM DilabMusicGroups WHERE groupName="${groupName}";`,function(err,results,fields) {
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
                dilabConnection.query(`INSERT INTO DilabMusicGroups (groupName,description, admin, founder, genres) VALUES ('${groupName}','${groupDescription}',${req.session.dilab},${req.session.dilab},${groupOrientation}); INSERT INTO DilabGroupMembers (memberId,groupId) SELECT ${req.session.dilab},id FROM DilabMusicGroups WHERE groupName="${groupName}"`,function(err,results,fields) {
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
         req.body.projectPhase && req.body.audioFile && req.body.projectFile && req.body.projectPPFile && req.session.dilab) {
            var projectName=req.body.projectName,
            projectDescription=req.body.projectDescription ? req.body.projectDescription : "",
            projectGenre=req.body.projectGenre ? req.body.projectGenre : "",
            projectLyrics=req.body.projectLyrics ? req.body.projectLyrics : "",
            groupName=req.body.groupName,
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
                dilabConnection.query(`SELECT id FROM DilabMusicGroups WHERE groupName=${dilabConnection.escape(groupName)} AND admin=${req.session.dilab} LIMIT 1`,(err,results,fields)=> {
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
                        filename1=null,filename2=null,filename3=null,
                        filePath1=null,filePath2=null,filePath3=null;
                        fileIndex=0; //Increments when a file of a searched type has been loaded
                        if (req.body.audioFile=="true" && req.files.length>fileIndex) { // Check if file uploaded
                            if (req.files[fileIndex].size > 2097152*4){ // Check file size (8MB max)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                        fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status" : false,"data" : "Audio File is too big !" }');
                                return;
                            } else if (req.files[fileIndex].originalname.length>256) {
                                res.end('{ "return" : "error","status" : false,"data" : "File name must not exceed 255 characters." }');
                            } else if (req.files[fileIndex].mimetype.slice(0,req.files[fileIndex].mimetype.indexOf('/'))!="audio") { // Check file type (image ?)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                    fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status": false,"data" : "Uploaded Audio file must be.. an audio !" }');
                            } else {
                                if (!fs.existsSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName)) {
                                    fs.mkdirSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName);
                                }
                                if (!fs.existsSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName+"/"+projectName)) {
                                    fs.mkdirSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName+"/"+projectName);
                                }
                                filename1=req.files[fileIndex].originalname.replace(/\//g,"");
                                filePath1=req.files[fileIndex].path;
                                console.log(filename1);
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
                            } else if (req.files[fileIndex].originalname.length>256) {
                                res.end('{ "return" : "error","status" : false,"data" : "File name must not exceed 255 characters." }');
                            } else if (req.files[fileIndex].mimetype.slice(0,req.files[fileIndex].mimetype.indexOf('/'))=="audio") { // Check file type (image ?)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                    fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status": false,"data" : "Uploaded Project file must be.. a project file !" }');
                            } else {
                                if (!fs.existsSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName)) {
                                    fs.mkdirSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName);
                                }
                                if (!fs.existsSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName+"/"+projectName)) {
                                    fs.mkdirSync("/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName+"/"+projectName);
                                }
                                filename2=req.files[fileIndex].originalname.replace(/\//g,"");;
                                filePath2=req.files[fileIndex].path;
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
                            } else if (req.files[fileIndex].mimetype.slice(0,req.files[fileIndex].mimetype.indexOf('/'))=="audio") { // Check file type (image ?)
                                if (req.files) {
                                    for (var i=0;i<req.files.length;i++)
                                    fs.unlink(req.files[i].path,()=>{return;});
                                }
                                res.end('{ "return" : "error","status": false,"data" : "Uploaded Project file must be.. a project file !" }');
                            } else {
                                if (!fs.existsSync("/media/edouda/DiskloudExt/DilabFiles/projectPP/"+groupName)) {
                                    fs.mkdirSync("/media/edouda/DiskloudExt/DilabFiles/projectPP/"+groupName);
                                }
                                filename3=projectName+".PNG";
                                filePath3=req.files[fileIndex].path;
                                projectPPIndex=fileIndex;
                                projectPPFile=true;
                            }
                        } if (audioFile) {
                            fs.move(__dirname+"/"+filePath1,"/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName+"/"+projectName+"/"+filename1);
                        } if (projectFile) {
                            fs.move(__dirname+"/"+filePath2,"/media/edouda/DiskloudExt/DilabFiles/projectFiles/"+groupName+"/"+projectName+"/"+filename2);
                        } if (projectPPFile) {
                            sharp(__dirname+"/"+filePath3)
                            .resize(1248, 1248)
                            .toFile("/media/edouda/DiskloudExt/DilabFiles/projectPP/"+groupName+"/"+filename3, (err, info) => { 
                                //When conversion done, the temporary files get deleted, after the profile picture has been saved properly
                                if (err) {
                                    res.end('{"return" : "error", "status" : false, "data":"Could not load your group picture properly"}');
                                    if (req.files) {
                                        for (var i=0;i<req.files.length;i++)
                                            fs.unlink(req.files[i].path,()=>{return;}) ;
                                        return;
                                    }
                                    fs.unlink(__dirname+"/"+filePath3,()=>{return;});
                                }
                            });
                        }
                        dilabConnection.query(`INSERT INTO DilabProject (name, groupAuthor, currentPhase, projectPicture, audioFileDir, projectFileDir, lyrics, description) 
                        VALUES (${dilabConnection.escape(projectName)},${results[0].id},${projectPhase},${projectPPFile ? dilabConnection.escape(filename3) : '"disc.svg"'},
                        ${audioFile ? dilabConnection.escape(filename1) : "NULL"}, ${projectFile ? dilabConnection.escape(filename2) : "NULL"},${dilabConnection.escape(projectLyrics)},${dilabConnection.escape(projectDescription)})`,(err,results,fields)=> {
                            if (err) {
                                res.send(JSON.stringify({
                                    return : "error",
                                    status : false,
                                    data : "The server is not doing well :("
                                }));
                                throw err;
                            } else if (results.affectedRows==1) {
                                res.send({
                                    return : "ok",
                                    status : true,
                                    data : "Project created !"
                                });
                            } else {
                                res.send({
                                    return : "ok",
                                    status : false,
                                    data : "Seems like you choose a project name that already exists in your group. Find another project name or choose another group for that project."
                                });
                            }
                            if (req.files) {
                                for (var i=0;i<req.files.length;i++) {
                                    if (req.files[i].path !=filePath1 && req.files[i].path!=filePath3 && req.files[i].path!=filePath2 && fs.existsSync(req.files[i].path)) {
                                        fs.unlinkSync(req.files[i].path,()=>{return;});
                                        i--;                                      
                                    } 
                                }
                            }
                        });
                    }
                });
            }
        } else if (req.body.type=="message" && req.body.messageDestType && req.session.dilab) {
            if (req.body.messageDestType=="g" && req.body.messageContent && req.body.groupName) {
                dilabConnection.query(`INSERT INTO DilabChats (message, author, groupProjectPvChatId,isGroupOrProject,isFileDir)
                                    SELECT ${dilabConnection.escape(decodeURIComponent(req.body.messageContent))},DilabUser.id,DilabMusicGroups.id,"g",0
                                    FROM DilabMusicGroups
                                    RIGHT JOIN DilabGroupMembers ON DilabMusicGroups.id=DilabGroupMembers.groupId
                                    LEFT JOIN DilabUser ON DilabGroupMembers.memberId=DilabUser.id
                                    WHERE DilabMusicGroups.groupName=${dilabConnection.escape(decodeURIComponent(req.body.groupName))}
                                        AND DilabGroupMembers.memberId=${req.session.dilab}`,(err,results,fields) => {
                    if (err) { // DBS Query Error
                        console.log(err);
                        res.end(JSON.stringify(
                            { "return" : "error",
                                "data" : "internal server error",
                            }));
                    }
                    else if (results.affectedRows!=0) {
                        res.end(JSON.stringify(
                            { "return" : "ok",
                                "status" : true,
                                "data" : true
                            }));
                    } else {
                        res.end('{ "return" : "ok", "status" : false, "data" : "data seems to be invalid" }');
                    }
                });
            } else if (req.body.messageDestType=="p" && req.body.messageContent && req.body.projectName && req.body.groupName) {
                dilabConnection.query(`
                    INSERT INTO DilabChats (message, author, groupProjectPvChatId,isGroupOrProject,isFileDir)
                    SELECT ${dilabConnection.escape(decodeURIComponent(req.body.messageContent))},DilabUser.id,DilabProject.id,"p",0
                    FROM DilabProject
                    LEFT JOIN DilabMusicGroups ON DilabProject.groupAuthor=DilabMusicGroups.id
                    RIGHT JOIN DilabGroupMembers ON DilabMusicGroups.id=DilabGroupMembers.groupId
                    LEFT JOIN DilabUser ON DilabGroupMembers.memberId=DilabUser.id
                    WHERE DilabMusicGroups.groupName=${dilabConnection.escape(decodeURIComponent(req.body.groupName))}
                        AND DilabProject.name=${dilabConnection.escape(decodeURIComponent(req.body.projectName))}
                        AND DilabGroupMembers.memberId=${req.session.dilab}`,(err,results,fields) => {
                    if (err) { // DBS Query Error
                        console.log(err);
                        res.end(JSON.stringify(
                            { "return" : "error",
                                "data" : "internal server error",
                            }));
                    }
                    else if (results.affectedRows!=0) {
                        res.end(JSON.stringify(
                            { "return" : "ok",
                                "status" : true,
                                "data" : true
                            }));
                    } else {
                        res.end('{ "return" : "ok", "status" : false, "data" : "data seems to be invalid" }');
                    }
                });
            } else {
                res.end(JSON.stringify({
                    status : false,
                    return : "error",
                    data : "Invalid POST chat message input"
                }));
            }
        } else {
            res.end(JSON.stringify({
                status : false,
                return : "error",
                data : "Invalid POST input"
            }));
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
        } else if (req.body.type=="groupNameAvailable" && req.body.groupName) {
            dilabConnection.query(`SELECT groupName FROM DilabMusicGroups
            WHERE DilabMusicGroups.groupName="${mysql_real_escape_string(req.body.groupName)}" LIMIT 1;`,(err,results,fields)=> {
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
        } else if (req.body.type=="notAdminUserRelationToGroup" && req.body.groupName && req.session.dilab) {
            dilabConnection.query(`WITH cte AS (
                SELECT id FROM DilabMusicGroups WHERE groupName=${dilabConnection.escape(decodeURI(req.body.groupName))}
              ) SELECT cte.id, DilabGroupMembers.rule FROM cte
                 JOIN DilabGroupMembers ON cte.id=DilabGroupMembers.groupId
                 WHERE DilabGroupMembers.memberId=${req.session.dilab} LIMIT 1`,(err,results,fields)=> {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error (req1)",
                            "status" : false
                        }));
                } else if (results.length!=0 && results[0].id!=null) {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : "member",
                            "rule" : results[0].rule
                        }));
                } else {
                    dilabConnection.query(`SELECT DilabMembersWaitList.id FROM DilabMembersWaitList 
                    LEFT JOIN DilabMusicGroups ON DilabMusicGroups.id=DilabMembersWaitList.groupId
                    WHERE DilabMembersWaitList.waiter=${req.session.dilab} AND DilabMusicGroups.groupName=${dilabConnection.escape(req.body.groupName)} LIMIT 1`,(err,results,fields) => {
                        if (err) { // DBS Query Error
                            res.end(JSON.stringify(
                                { "return" : "error",
                                    "data" : "internal server error (req 2)",
                                    "status" : false
                                }));
                        }
                        else if (results.length!=0 && results[0].id!=null) {
                            res.end(JSON.stringify(
                                { "return" : "ok",
                                    "status" : true,
                                    "data" : "waiting for approval"
                                }));
                        } else {
                            res.end(JSON.stringify(
                                { "return" : "ok",
                                    "status" : true,
                                    "data" : "not a member"
                                })); 
                        }
                    });
                }
            });
        } else if (req.body.type=="notifications") {
            dilabConnection.query(`
            /* Notification of group join requests */
            SELECT DilabUser.pseudo AS requester,DilabMusicGroups.groupName FROM DilabMembersWaitList
            JOIN DilabUser ON DilabMembersWaitList.waiter=DilabUser.id
            JOIN DilabMusicGroups ON DilabMembersWaitList.groupId=DilabMusicGroups.id
            WHERE DilabMusicGroups.admin=${req.session.dilab} AND DilabMembersWaitList.hasBeenApproved=FALSE;
            /* Notifications where person has been approved in a group */
            SELECT DilabMusicGroups.groupName FROM DilabMembersWaitList
            JOIN DilabMusicGroups ON DilabMembersWaitList.groupId=DilabMusicGroups.id
            WHERE DilabMembersWaitList.waiter=${req.session.dilab} AND DilabMembersWaitList.hasBeenApproved=TRUE;`,(err,results,fields)=> {
                if (err) { // DBS Query Error
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error (req 2)",
                            "status" : false
                        }));
                } else {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : results
                        })); 
                }
            })
        } else {
            res.status(400).end('{ "return" : "invalid POST data" }')
        }
    } else if (req.params.action=="remove") {
        if (req.body.type=="leaveGroup" && req.body.groupName && req.session.dilab) {
            dilabConnection.query(`
            DELETE DilabGroupMembers FROM DilabGroupMembers
            LEFT JOIN DilabMusicGroups ON DilabGroupMembers.groupId=DilabMusicGroups.id
            WHERE DilabGroupMembers.memberId=${req.session.dilab} AND DilabMusicGroups.groupName=${dilabConnection.escape(decodeURIComponent(req.body.groupName))}
            `,(err,results,fields)=> {
                if (err) { // DBS Query Error
                    console.log(err);
                    res.end(JSON.stringify(
                        { "return" : "error",
                            "data" : "internal server error",
                        }));
                }
                else if (results.affectedRows!=0) {
                    res.end(JSON.stringify(
                        { "return" : "ok",
                            "status" : true,
                            "data" : true
                        }));
                } else {
                    res.end('{ "return" : "ok", "status" : false, "data" : "data seems to be invalid" }');
                }
            })
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

function generateSearchPatterns (column,data) {
    output=`${column} LIKE ${dilabConnection.escape(data)} OR ${column} LIKE `;
    for (var i=0; i<data.length;i++) {
        output+=`${dilabConnection.escape(`%${data.slice(0,i)}_${data.slice(i+1)}%`)} OR ${column} LIKE `;
    }
    return output+dilabConnection.escape(`%${data}%`);
}
