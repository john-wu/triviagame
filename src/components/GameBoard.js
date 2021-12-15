import ScoreBoard from "./ScoreBoard"
import GameTimer from "./GameTimer";
import Button from "./Button"

const GameBoard = ({ game_data, click_ball }) => {
    const on_click_ball = (e) => {
        const ball_id = e.target.id;
        click_ball(ball_id);
    };
    
    const game_board = []
    Object.entries(game_data.board_state).forEach(([key, value]) => {
        game_board.push(
            <Button width="80px" height="80px" key={key} id={key} onClick={on_click_ball} />
        )
    });
    
    return (
        <>
            <p>Game ID: {game_data.id}</p>
            <div className="gameHeader">
                <ScoreBoard game_data={game_data} />
                <GameTimer game_data={game_data} />
            </div>
            <div className="gameBoard" >
                {game_board}
            </div>
        </>
    )
}

export default GameBoard
