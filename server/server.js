const path = require("path");
const http = require("http");
const { v4: uuidv4 } = require('uuid');
const ws_server = require("websocket").server;
const { client } = require("websocket");

// create server and listen for requests
const http_server = http.createServer();
http_server.listen(8080, () => console.log("Listening on port 8080 for client requests..."));

// declare game data objects
const clients = {};
const games = {};
const player_colours = {
    "0": "red",
    "1": "green",
    "2": "yellow"
};

const websocket_server = new ws_server({
    "httpServer": http_server
});
websocket_server.on("request", request => {

    console.log(request);

    // accept incoming connection
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("Connection opened!"));
    connection.on("close", () => console.log("Connection closed!"));
    connection.on("message", message => {
        // message received
        const response = JSON.parse(message.utf8Data);

        console.log(response)
        
        // user wants to create new game
        if (response.method === "create") {
            const client_id = response.client_id;
            const game_id = uuidv4();
            const num_players = response.num_players;
            const time_limit = response.time_limit;
            games[game_id] = {
                "id": game_id,
                "balls": 20,
                "num_players": parseInt(num_players),
                "time_remaining": parseInt(time_limit),
                "clients": {},
                "state": {},
                "scores": {},
                "winners": [],
                "status": "pending"
            };

            const payload = {
                "method": "create",
                "game": games[game_id]
            };

            const con = clients[client_id].connection;
            con.send(JSON.stringify(payload));
        };

        // user wants to join existing game
        if (response.method === "join") {
            const client_id = response.client_id;
            const game_id = response.game_id;
            let player_name = response.player_name;
            let game = games[game_id];
            const max_players = game.num_players;

            if (!game) {
                const payload = {
                    "method": "join",
                    "game": null,
                    "error": "Invalid Game ID!"
                }

                clients[client_id].connection.send(JSON.stringify(payload));
                return;
            }
            if (Object.keys(game.clients).length >= max_players) {
                // max players
                const payload = {
                    "method": "join",
                    "game": null,
                    "error": "Game is full!"
                }

                clients[client_id].connection.send(JSON.stringify(payload));
                return;
            }

            const player_colour = player_colours[Object.keys(game.clients).length]
            if (player_name === "")
                player_name = player_colour;
            game.clients[client_id] = {
                "id": client_id,
                "player_colour": player_colour,
                "player_name": player_name
            };
            game.scores[client_id] = 0;
            
            // start game once max players reached
            if (Object.keys(game.clients).length === max_players) {
                games[game_id].status = "started";
                game = games[game_id];
                update_game_state(game_id);
                start_timer(game_id);
            }

            const payload = {
                "method": "join",
                "game": game
            }

            // notify existing players
            for (const client_id of Object.keys(game.clients)) {
                clients[client_id].connection.send(JSON.stringify(payload));
            };
        };

        // user wants to play
        if (response.method === "play") {
            const client_id = response.client_id;
            const game_id = response.game_id;
            const ball_id = response.ball_id;
            const game = games[game_id];
            let state = game.state;

            state[ball_id] = game.clients[client_id];
            games[game_id].state = state;
        };
    });

    // generate a new client_id
    const client_id = uuidv4();
    clients[client_id] = {
        "connection": connection
    };

    const payload = {
        "method": "connect",
        "client_id": client_id
    };

    // send back client connect message
    connection.send(JSON.stringify(payload));
});

function update_game_state(game_id) {
    // calculate scores and send updated game state to each client
    const game = games[game_id];
    const state = game.state;
    const scores = game.scores;
    for (const client_id of Object.keys(scores)) {
        scores[client_id] = 0;
    };
    for (const ball_id of Object.keys(state)) {
        scores[state[ball_id].id] += 1;
    };

    game["scores"] = scores;

    if (game.status === "finished") {
        client_ids = Object.keys(scores);
        highest_score = Math.max.apply(null, client_ids.map(client_id => scores[client_id]));
        winners = client_ids.reduce((result, client_id) => {
            if (scores[client_id] === highest_score)
                result.push(client_id);
            return result;
        }, []);

        game.winners = winners;
    };

    const payload = {
        "method": "update",
        "game": game
    };

    for (const client_id of Object.keys(game.clients)) {
        clients[client_id].connection.send(JSON.stringify(payload));
    };
    
    if (game.status === "finished")
        return;

    // repeat every 100ms
    setTimeout(() => {update_game_state(game_id)}, 100);
}

function start_timer(game_id) {
    let interval = 1000;
    let expected = Date.now() + interval;
    const step = () => {
        let dt = Date.now() - expected;
        if (dt > interval) 
            console.log("Timer drifted too far!");

        games[game_id].time_remaining -= 1
        if (games[game_id].time_remaining === 0) {
            games[game_id].status = "finished";
            return;
        }

        expected += interval;
        setTimeout(step, Math.max(0, interval - dt));
    }
    setTimeout(step, interval);
}