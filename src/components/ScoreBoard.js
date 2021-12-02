const ScoreBoard = ({ game_data }) => {
    return (
        <div className="scoreBoard">
            {game_data.clients && Object.keys(game_data.clients).map((client_id) => (
                <>
                    <p 
                        className={`playerName ${game_data.clients[client_id].player_name}Name`} 
                        style={{borderColor: `${game_data.clients[client_id].player_colour}`}} 
                        key={`${game_data.clients[client_id].player_name}Name`} 
                    >{game_data.clients[client_id].player_name}</p>
                    <p 
                        className={`playerScore ${game_data.clients[client_id].player_name}Score`} 
                        style={{borderColor: `${game_data.clients[client_id].player_colour}`}} 
                        key={`${game_data.clients[client_id].player_name}Score`} 
                    >{game_data.scores ? game_data.scores[client_id] : 0}</p>
                </>
            ))}
        </div>
    )
}

export default ScoreBoard
