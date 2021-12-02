import Button from "./Button"
import { useState } from "react";
import { Link } from "react-router-dom";

const NewMenu = ({ interface_data, new_game }) => {
    const [num_players, set_num_players] = useState("");
    const [time_limit, set_time_limit] = useState("");
    const [player_name, set_player_name] = useState("");

    const on_click_new = (e) => {
        e.preventDefault();
        new_game(num_players, time_limit, player_name);
    }

    return (
        <div className="newMenu">
            <label>Number of Players</label>
            <input type="text" placeholder="Enter Number of Players" value={num_players} onChange={(e) => set_num_players(e.target.value)} ></input>

            <label>Time Limit</label>
            <input type="text" placeholder="Enter Time Limit" value={time_limit} onChange={(e) => set_time_limit(e.target.value)}></input>

            <label>Player Name</label>
            <input type="text" placeholder="Enter Player Name" value={player_name} onChange={(e) => set_player_name(e.target.value)} ></input>

            <Button text="New Game" onClick={on_click_new} />
            <label style={{color: "red"}} >{interface_data && interface_data.error_message}</label>

            <Link className="smallMenuLink" to="/" >Back</Link>
        </div>
    )
}

export default NewMenu
