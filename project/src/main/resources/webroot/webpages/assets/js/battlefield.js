"use strict";

/* global EventBus */
let eb = new EventBus("http://localhost:8021/tetris-21/socket");
// let eb = new EventBus("http://172.31.27.98:8021/tetris-21/socket");
// let eb = new EventBus("http://192.168.0.251:8021/tetris-21/socket");
let game = {
    gameRun: false, gameRun2: false, gameLoop: null, countdown: null, timer: 180, speed: 50,
    area: makeMatrix(1, 1),
    area2: makeMatrix(1, 1),
    context: player1.getContext("2d"),
    context2: player2.getContext("2d"),
    fieldPlayer: {name: null, pos: {x: 0, y: 0}, matrix: null, score: 0, width:12,height:20},
    fieldPlayer2: {name: null, pos: {x: 0, y: 0}, matrix: null, score: 0,width:12,height:20},
    color: null
};

document.addEventListener("DOMContentLoaded", init);

function init() {
    eb.onopen = function () {
        initialize();
    };
    countdown(game.timer);
    addEventHandler("#openmodal", "click", openModal);
    addEventHandler("body", "click", onModalClose);
    addEventHandler("#keepplaying", "click", keepPlaying);
}

function initialize() {
    registers();
}


function registers() {
    eb.send("tetris-21.socket.gamestart", "Im ready!", function (error) {
        if (error) {
            console.log(error)
        }
    });

    eb.registerHandler("tetris-21.socket.game", function (error, message) {
        setGamePlay(JSON.parse(message.body));
        let gameInfo = JSON.parse(message.body);
        // console.log(gameInfo);

        let playfieldInfo = gameInfo.players[0].playfields;
        let firstName = gameInfo.players[0].name;
        let secName = gameInfo.players[1].name;

        giveMatrixNumbers(playfieldInfo, firstName, secName);
        backgroundStuff();
    });


    eb.registerHandler("tetris-21.socket.BattleField", function (error, message) {
        if (error) {
            console.log(error)
        }
        console.log(message);

    });

}


function giveMatrixNumbers(playfields, firstPlayerName, secPlayerName) {
    let playfieldheight = playfields[firstPlayerName].playfield.length;
    let playfieldWidth = playfields[firstPlayerName].playfield[0].length;
    let playfield2Height = playfields[secPlayerName].playfield.length;
    let playfield2Width = playfields[secPlayerName].playfield[0].length;

    game.area2 = makeMatrix(playfield2Width, playfield2Height);
    game.area = makeMatrix(playfieldWidth, playfieldheight);

}


function f(context, fieldPlayer, area) {
    context.scale(20, 20);
    nextBlock(fieldPlayer.name);
    draw(fieldPlayer, context, area);
}


function makeMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

function drawMatrix(matrix, offset, context) {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = game.color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                let imgTag = document.createElement("IMG");
                imgTag.src = game.color;
                context.drawImage(imgTag, x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}



function setGamePlay(infoBackend) {

    console.log(infoBackend);
    setPlayer1(infoBackend.players[0]);
    setPlayer2(infoBackend.players[1]);

    setEvents(infoBackend.events);
}

function setPlayer1(player) {
    // console.log(player);

    game.fieldPlayer.name = sessionStorage.getItem("PlayerName");
    select('#player1name').innerHTML =  sessionStorage.getItem("PlayerName");
    select('#abilty1p1').innerHTML = player.hero.abilitySet[0].name + " <img src=\"assets/media/1.png\" "
        + "class='key' title='key1' alt='key1'>";
    select('#abilty2p1').innerHTML = player.hero.abilitySet[1].name + " <img src=\"assets/media/2.png\" " +
        "class='key' title='key2' alt='key2'>";

    select("#heroimgplayer1").innerHTML = '<img src="assets/media/' + player.hero.name + '.png">';
}

function setPlayer2(player) {
    // console.log(player);

    game.fieldPlayer2.name = 'User2';
    select('#player2name').innerHTML = 'User2';
    select('#abilty1p2').innerHTML = player.hero.abilitySet[0].name + " <img src=\"assets/media/9.png\" " +
        "class='key' title='key9' alt='key9'>";
    select('#abilty2p2').innerHTML = player.hero.abilitySet[1].name + " <img src=\"assets/media/0.png\" " +
        "class='key' title='key0' alt='key0'>";
    select("#heroimgplayer2").innerHTML = '<img src="assets/media/' + player.hero.name + '.png">';

}

function setEvents(events) {
    // console.log(events);
    // console.log(events.events);
    // console.log(events.events[0].name);
    // console.log(events.events[1].name);
}

function setWidth(lines, id) {
    let multiply = 0 ;
    let maxVal = 0;
    if (id === "#abilty1p1" || id === "#abilty1p2") {
        multiply = 10;
        maxVal = 10
    } else if (id === "#abilty2p1" || id === "#abilty2p2") {
        multiply = 5;
        maxVal = 20;
    }
    if(0 <= lines < maxVal) {
        select(id).style.backgroundSize = lines * multiply + "%";
    } else {
        select(id).style.width = 100 + "%";
    }
}



function backgroundStuff() {

    f(game.context, game.fieldPlayer, game.area);
    f(game.context2, game.fieldPlayer2, game.area2);
    startGame();

    const move = 1;
    document.addEventListener('keydown', function (e) {
        //links Q
        if (e.keyCode === 81) {
            playerMove(game.fieldPlayer, -move, game.area);
        }
        // draai Z
        else if (e.keyCode === 90) {
            playerRotate(game.fieldPlayer, game.area);
        }
        // Beneden S
        else if (e.keyCode === 83) {
            playerDrop(game.fieldPlayer, game.context, game.area);
        }
        // rechts D
        else if (e.keyCode === 68) {
            playerMove(game.fieldPlayer, +move, game.area);
        }
    });

    document.addEventListener('keydown', function (e) {
        // links
        if (e.keyCode === 37) {
            playerMove(game.fieldPlayer2, -move, game.area2);
        }
        // rechts
        else if (e.keyCode === 39) {
            playerMove(game.fieldPlayer2, +move, game.area2);
        }
        // beneden
        else if (e.keyCode === 40) {
            playerDrop(game.fieldPlayer2, game.context2, game.area2);
        }
        // draaien
        else if (e.keyCode === 38) {
            playerRotate(game.fieldPlayer2, game.area2);
        }

        // todo
        // eb.send("tetris.infoBackend.updateGame", "update!", function (error, reply) {
        //     if (error) {
        //         console.log(error)
        //     }
        // });
    })
}

function startGame() {
    game.gameRun = true;
    game.gameRun2 = true;

    let number = 0;
    game.gameLoop = setInterval(function () {
        number++;
        if ((number % game.speed === 0)) {
            playerDrop(game.fieldPlayer, game.context, game.area);
            playerDrop(game.fieldPlayer2, game.context2, game.area2)
        }
        if (!game.gameRun) {
            youLose(game.context);
            youWon(game.context2);
        }
        else if (!game.gameRun2) {
            youLose(game.context2);
            youWon(game.context);
        }
        else if (game.gameRun && game.gameRun2) {
                draw(game.fieldPlayer, game.context, game.area);
                draw(game.fieldPlayer2, game.context2, game.area2);
        }
        // console.log(game.area2)
    }, 10);
}

function countdown(durationInSeconds) {
    let timer = durationInSeconds, minutes, seconds;

    game.countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + (seconds - 1) : seconds;

        document.querySelector("#time").textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = durationInSeconds;
        }

        if (timer === 0) {
            if (game.fieldPlayer.score < game.fieldPlayer2.score) {
                youLose(game.context);
                youWon(game.context2);
            }
            else if (game.fieldPlayer.score > game.fieldPlayer2.score) {
                youLose(game.context2);
                youWon(game.context);

            } else if (game.fieldPlayer.score === game.fieldPlayer2.score) {
                Tie();
            }
        }
    }, 1000);
}


function nextBlock(player) {
    if (game.fieldPlayer.name === player) {
        makePieces(game.fieldPlayer, game.area);
    }
    if (game.fieldPlayer2.name === player) {
        makePieces(game.fieldPlayer2, game.area2);
    }
}



function points(player, area) {

    let addScore = 0;
    let rowCount = 1;
    outer:for (let y = area.length - 1; y > 0; --y) {
        for (let x = 0; x < area[y].length; ++x) {
            if (area[y][x] === 0) {
                continue outer;
            }
        }
        const row = area.splice(y, 1)[0].fill(0);
        area.unshift(row);
        ++y;

        addScore = rowCount * 100;
        rowCount *= 2;

        let object = JSON.stringify({score: addScore, player: player.name});
        eb.send("tetris-21.socket.updateScore", object, function (error, reply) {
            if (error) {
                console.log(error)
            }
            // console.log(reply.body);
            let info = JSON.parse(reply.body);
            addScoreToPlayer(player, info)
        });
    }
}

function addScoreToPlayer(player, info) {
    if (player.name === game.fieldPlayer2.name ){

        let score = select('#scoreplayer2').innerHTML;
        select('#scoreplayer2').innerHTML = parseInt(score) + info.addToScore;
        player.score += info.addToScore;

        let numberOfLines = parseInt(select('#linesPlayer2 p span').innerHTML) + info.addlines;
        select('#linesPlayer2 p span').innerHTML = numberOfLines;
        abilityBars(player, numberOfLines);


    } else if(player.name === game.fieldPlayer.name){

        let score = select('#scoreplayer1').innerHTML;
        select('#scoreplayer1').innerHTML = parseInt(score) + info.addToScore;
        player.score += info.addToScore;

        let numberOfLines = parseInt(select('#linesPlayer1 p span').innerHTML)+ info.addlines;
        select('#linesPlayer1 p span').innerHTML = numberOfLines;
        abilityBars(player, numberOfLines);
    }

}

function abilityBars(player, lines){
    let linesp = lines;
    if(player.name === game.fieldPlayer.name ){
        setWidth(linesp, "#abilty1p1");
        setWidth(linesp, "#abilty2p1");
    } else {
        setWidth(linesp, "#abilty1p2");
        setWidth(linesp, "#abilty2p2");
    }
}



function collide(player, area) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (area[y + o.y] && area[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(player, area) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                area[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
    let object = JSON.stringify({playerName:player.name ,x: player.pos.x, y:player.pos.y});
    eb.send("tetris-21.socket.battleField.blockOnField", object, function (error, reply) {
        if (error) {
            console.log(error);
        }
        let rotatedBlock = JSON.parse(reply.body);

    });

    console.log(player.name + "  y: " + player.pos.y);
    console.log(player.name + "  x: " + player.pos.x);
}

function rotate(player, area) {
    let object = JSON.stringify({matrix: player.matrix, playerName:player.name});

    eb.send("tetris-21.socket.battleField.rotate", object, function (error, reply) {
            if (error) {
                console.log(error);
            }
            let rotatedBlock = JSON.parse(reply.body);
            player.matrix = rotatedBlock.block;
            collide2(player, area);
    })

}


function collide2(player, area){
    while (collide(player, area)){
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            player.pos.x = 5;
                return;
            }
    }
}

function makePieces(player, area) {
    let object = JSON.stringify({playername: player.name});
    eb.send("tetris-21.socket.battleField.getNewBlock", object, function (error, reply) {
        if (error) {
            console.log(error)
        }
        let block = JSON.parse(reply.body);
        let newBlock = block.block;
        game.color = block.color;
        player.matrix = newBlock;
        player.pos.y = 0;
        player.pos.x = 5;

        collidefunction(player, area);
    });
}


// function makeStringAColor(string) {
//     console.log(string);
//
//     return "rgb(255,255,0)"
// }

function collidefunction(player, area) {
    if (collide(player, area)) {
        area.forEach(row => row.fill(0));
        // player.score = 0;
        if (player.name === "player1") {
            game.gameRun = false;
        } else if (player.name === "player2") {
            game.gameRun2 = false;
        }
    }
}

function playerDrop(player, context, area) {
    player.pos.y++;
    if (collide(player, area)) {
        player.pos.y--;
        merge(player, area);
        points(player, area);
        nextBlock(player.name);
    }
}

function playerMove(player, dir, area) {
    player.pos.x += dir;
    if (collide(player, area)) {
        player.pos.x -= dir;
    }
}

function playerRotate(player, area) {
    const pos = player.pos.x;
    let offset = 1;
    player.matrix = rotate(player, area);
}

function draw(player, context, area) {
    context.clearRect(0, 0, player.width, player.height);
    context.fillStyle = "#000000";
    context.fillRect(0 , 0, player.width, player.height);
    drawMatrix(area, {x: 0, y: 0}, context);
    if (player.matrix != null) {
        drawMatrix(player.matrix, player.pos, context);
    }
}

function resultscore(context) {
    clearInterval(game.gameLoop);
    clearInterval(game.countdown);
    context.font = "2px Comic Sans MS";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.textBaseline = "middle";
}

function youLose(context) {
    resultscore(context);
    context.fillText("YOU LOSE!", (player1.width / 20) / 2, (player1.width / 20) / 2);
}

function youWon(context) {
    resultscore(context);
    context.fillText("YOU WON!", (player1.width / 20) / 2, (player1.width / 20) / 2);
}

function Tie() {
    resultscore(game.context);
    resultscore(game.context2);
    game.context.fillText("DRAW", (player1.width / 20) / 2, (player1.width / 20) / 2);
    game.context2.fillText("DRAW", (player2.width / 20) / 2, (player2.width / 20) / 2);
}
