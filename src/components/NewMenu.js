import Button from "./Button"
import { useState } from "react";
import { Link } from "react-router-dom";

const NewMenu = ({ interface_data, new_game }) => {
    const [num_players, set_num_players] = useState("");
    const [num_questions, set_num_questions] = useState("");
    const [player_name, set_player_name] = useState("");

    const on_click_new = (e) => {
        e.preventDefault();
        new_game(num_players, num_questions, player_name);
    }

    return (
        <div className="newMenu">
            <label>Number of Players</label>
            <input type="text" placeholder="Enter Number of Players" value={num_players} onChange={(e) => set_num_players(parseInt(e.target.value))} ></input>

            <label>Number of Questions</label>
            <input type="text" placeholder="Enter Number of Questions" value={num_questions} onChange={(e) => set_num_questions(parseInt(e.target.value))}></input>

            <label>Player Name</label>
            <input type="text" placeholder="Enter Player Name" value={player_name} onChange={(e) => set_player_name(e.target.value)} ></input>

            <Button text="New Game" onClick={on_click_new} />
            <label style={{color: "red"}} >{interface_data && interface_data.error_message}</label>

            <Link className="smallMenuLink" to="/" >Back</Link>
        </div>
    )
}

export default NewMenu
