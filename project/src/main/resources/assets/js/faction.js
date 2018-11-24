"use strict";

/* global EventBus */
let eb = new EventBus("http://localhost:8000/tetris/game");
let faction;

document.addEventListener("DOMContentLoaded", init);

function init() {
    eb.onopen = function () {
        getFactionFromDB();
    };
}

function getFactionFromDB() {
    eb.registerHandler("tetris.infoBackend.faction.get", function (error, message) {
        if (error) {
            console.log(error);
        }
        console.log(message);
    });
}