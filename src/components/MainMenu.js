import { Link } from "react-router-dom";

const MainMenu = () => {
    return (
        <div className="mainMenu">
            <Link className="menuLink" to="/new">New Game</Link>
            <Link className="menuLink" to="/join">Join Game</Link>
        </div>
    )
}

export default MainMenu
