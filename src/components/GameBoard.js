import ScoreBoard from "./ScoreBoard"
import GameTimer from "./GameTimer";
import Button from "./Button"

const GameBoard = ({ game_data, click_ball }) => {
    const on_click_ball = (e) => {
        const ball_id = e.target.id;
        click_ball(ball_id);
    };

    return (
        <>
            <p>Game ID: {game_data.id}</p>
            <div className="gameHeader">
                <ScoreBoard game_data={game_data} />
                <GameTimer game_data={game_data} />
            </div>
            <div className="gameBoard" >
                {game_data.balls && [...Array(game_data.balls)].map((item , index) => (
                    <Button color={game_data.state[`${index}`] && game_data.state[`${index}`].player_colour} borderRadius="50%" width="80px" height="80px" key={index} id={index} onClick={on_click_ball} />
                ))}
            </div>
        </>
    )
}

export default GameBoard
