use DilabProject;
-- User connect
select nom,pseudo,prenom,biographie,genres,dateCreation,profilePictureName FROM DilabUser WHERE pseudo="Bert2" AND motDePasse=aes_encrypt("bonsoir2","dilabSecret");

-- Dilab Activity
insert into DilabActivity (user,activity,location) VALUES (2,"connect","109.11.41.250");

-- Decryption example
select CAST(aes_decrypt(motDePasse,"dilabSecret") AS CHAR(128) CHARACTER SET utf8) AS mdp FROM DilabUser WHERE 1 ORDER BY id

/* set session values on node.js server */
/*
TO GET ROUTER_IP on node.js (with requestIp library) :
    var clientIp = requestIp.getClientIp(req);
*/
-- User disconnect
INSERT INTO DilabActivity (userId,activity,location) VALUES ({ID},"disconnect",{ROUTER_IP});
/* remove session values from node.js server */

-- Project select
SELECT id,name,groupAuthor,dateOfBirth,genres,currentPhase,projectPicture,audioFileDir,lastAudioFileUpdate,lastProjectFileUpdate FROM DilabProject WHERE {condition}

-- Group select
SELECT id,name,groupPicture,dateOfBirth,description,admin,founder,genre FROM DilabMusicGroups WHERE {condition}

-- Chat Select (group case)
SELECT message,CONCAT(prenom," ",nom) AS auteur,sendTime,isFileDir FROM DilabChats 
	JOIN DilabUser ON DilabUser.id=DilabChats.author WHERE groupProjectPvChatId={id} AND isGroupOrProject=1;

-- Chat Select (Private = between two users case)
SELECT message,CONCAT(prenom," ",nom) AS auteur,groupProjectPvChatId,isGroupOrProject,sendTime,isFileDir FROM DilabChats 
	JOIN DilabUser ON DilabUser.id=DilabChats.author JOIN DilabPVChats ON DilabChats.groupProjectPvChatId=DilabPVChats.id WHERE user1={minId} AND user2={maxId} AND isGroupOrProject=0;

-- !! TABLE DilabPVChats CONTIENT UNE CONTRAINTE OBLIGEANT A CHERCHER LE PLUS PETIT USERID DANS USER1 ET LE PLUS GRAND DANS USER2 (dans chaque champ, user1<user2)


USE DilabProject;
INSERT INTO `DilabProject` (`id`, `dateOfBirth`, `name`, `groupAuthor`, `genres`, `currentPhase`, `phases`, `projectPicture`, `audioFileDir`, `projectFileDir`, `lastAudioFileUpdate`, `lastProjectFileUpdate`) VALUES ('1', current_timestamp(), 'BROBROBRO', '1', 'BRORBORBOR on soutient les BRO MAIS PAS LES CRUCHES (LES PICHETS CA VA)', '2', '', 'disc.svg', '', '', current_timestamp(), current_timestamp()) 
