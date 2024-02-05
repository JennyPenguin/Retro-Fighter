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
    window.location.href = "./game.html";
}

function showCode(roomId) {
    const r = document.getElementById("roomCode");
    if (r)
        r.innerHTML = "Your room code is: " + roomId;
}


function initializeData(name, room) {
    console.log(room);
    let playerId;
    let playerRef;
    let allPlayersRef;
    let roomId;
    let players;

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
                name,
                direction: "right",
                score: 0,
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

            //Remove me from Firebase when I diconnect
            playerRef.onDisconnect().remove();

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