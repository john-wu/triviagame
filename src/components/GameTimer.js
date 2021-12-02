const GameTimer = ({ game_data }) => {
    let winner_string = ""
    const winners = []
    if (game_data.winners && !(game_data.winners.length === 0)) {
        game_data.winners.forEach(client_id => {
            winners.push(game_data.clients[client_id].player_name);
        });

        if (game_data.winners.length > 1) {
            winner_string = "Winners: " + winners.join(" and ");
        }
        else {
            winner_string = "Winner: " + winners[0];
        };
    };

    return (
        <div className="gameTimer">
            <label>Time Remaining: {game_data.time_remaining}</label>
            <h2 className="winnerString">{winner_string}</h2>
        </div>
    )
}

export default GameTimer
