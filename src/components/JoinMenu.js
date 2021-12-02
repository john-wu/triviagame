import Button from "./Button";
import { useState } from "react";
import { Link } from "react-router-dom";

const JoinMenu = ( { interface_data, join_game } ) => {
    const [player_name, set_player_name] = useState("");
    const [game_id, set_game_id] = useState("");

    const on_click_join = (e) => {
        e.preventDefault();
        join_game(player_name, game_id);
    }

    return (
        <div className="joinMenu">
            <label>Player Name</label>
            <input type="text" placeholder="Enter Player Name" value={player_name} onChange={(e) => set_player_name(e.target.value)} ></input>

            <label>Game ID</label>
            <input type="text" placeholder="Enter Game ID" value={game_id} onChange={(e) => set_game_id(e.target.value)}></input>

            <Button text="Join Game" onClick={on_click_join} />
            <label style={{color: "red"}} >{interface_data && interface_data.error_message}</label>

            <Link className="smallMenuLink" to="/" >Back</Link>
        </div>
    );
};

export default JoinMenu;
