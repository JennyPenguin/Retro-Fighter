let playerId;
let playerRef;
let allPlayersRef;
let roomId;
let players;
let pName;

function getName() {
    const n = document.getElementById("nameInput").value;
    initializeData(n, -1);
    document.getElementById("nameScreen").style.display = 'none';
}

function enterRoom() {
    const n = document.getElementById("nameInput").value;
    const roomCode = document.getElementById("roomId").value;
    const room = firebase.database().ref(`${roomCode}`);
    if (room) {
        initializeData(n, roomCode);
    }
}

function initGame() {
    if (document.getElementById("identifier").innerHTML == "Enemy") {
        playerRef.update({
            side: "Enemy"
        })
        sessionStorage.setItem("side", "Enemy");
    } else {
        sessionStorage.setItem("side", "Player");
    }
    sessionStorage.setItem("roomId", roomId);
    sessionStorage.setItem("playerId", playerId);
    sessionStorage.setItem("name", pName);
    window.location.href = "./game.html";
}

function showCode(roomId) {
    const r = document.getElementById("roomCode");
    if (r)
        r.innerHTML = "Your room code is: " + roomId;
}


function initializeData(name, room) {
    pName = name;
    console.log(room);
    firebase.auth().onAuthStateChanged((user) => {
        console.log(user)
        if (user) {
            //logged in
            playerId = user.uid;
            console.log(room);
            if (room == -1) {
                roomId = getRandomKey();

            } else {
                roomId = room;
            }
            console.log(roomId);
            playerRef = firebase.database().ref(`${roomId}/players/${playerId}`);
            allPlayersRef = firebase.database().ref(`${roomId}/players`);

            playerRef.set({
                id: playerId,
                pName,
                score: 0,
                keyPressed: []
            })

            console.log(allPlayersRef);

            allPlayersRef.on("child_added", (snapshot) => {
                players = snapshot.val() || {};
                allPlayersRef.once("value")
                    .then(function (snapshot) {
                        // if players all here
                        if (snapshot.numChildren() == 2) {
                            initGame();
                        } else {
                            console.log("wait for players");
                            showCode(roomId);
                        }
                    });
            })

        } else {
            //You're logged out.
        }
    })

    firebase.auth().signInAnonymously().catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
}