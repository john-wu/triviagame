import Header from "./components/Header";
import MainMenu from "./components/MainMenu";
import NewMenu from "./components/NewMenu";
import JoinMenu from "./components/JoinMenu";
import GameBoard from "./components/GameBoard";
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";


function App() {
  const navigate = useNavigate();
  const [socketUrl, setSocketUrl] = useState("ws://www.jozwu.com:8080");
  const [messageHistory, setMessageHistory] = useState([]);
  const [interface_data, set_interface_data] = useState({});
  const [client_data, set_client_data] = useState({});
  const [game_data, set_game_data] = useState({});

  useEffect(() => {
    set_interface_data(JSON.parse(window.localStorage.getItem('interface_data')));
    set_client_data(JSON.parse(window.localStorage.getItem('client_data')));
    set_game_data(JSON.parse(window.localStorage.getItem('game_data')));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('interface_data', JSON.stringify(interface_data));
  }, [interface_data]);

  useEffect(() => {
    window.localStorage.setItem('client_data', JSON.stringify(client_data));
  }, [client_data]);

  useEffect(() => {
    window.localStorage.setItem('game_data', JSON.stringify(game_data));
  }, [game_data]);

  const {
    sendMessage,
    lastMessage,
    readyState
  } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));

      const response = JSON.parse(lastMessage.data);
      // receive connect response from server
      if (response.method === "connect") {
        set_client_data({"client_id": response.client_id});
      };

      // receive create response from server
      if (response.method === "create") {
        const game_id = response.game.id;
        join_game(client_data.player_name, game_id);
      };

      // receive join response from server
      if (response.method === "join") {
        const game = response.game;

        if (!game) {
          set_interface_data(interface_data => ({...interface_data, error_message: response.error}))
          return;
        }

        set_game_data({...game});
        navigate(`/game/${game.id}`)
      };

      // receive update response from server
      if (response.method === "update") {
        if (!response.game.state)
            return;

        const game = response.game;

        // update game state
        set_game_data({...game});
      };
    }
  }, [lastMessage, setMessageHistory]);

  // on new game button press
  const new_game = async (num_players, time_limit, player_name) => {
    const client_id = client_data.client_id;

    if (!num_players) {
      set_interface_data(interface_data => ({...interface_data, error_message: "Please enter Number of Players"}));
      return;
    }
    else if (!time_limit) {
      set_interface_data(interface_data => ({...interface_data, error_message: "Please enter a Time Limit"}));
      return;
    }

    set_client_data(client_data => ({...client_data, player_name: player_name}));

    // user wants to create new game
    const payload = {
      "method": "create",
      "client_id": client_id,
      "num_players": num_players,
      "time_limit": time_limit
    };

    const response = await sendMessage(JSON.stringify(payload));
  };

  // on join game button press
  const join_game = async (player_name, game_id) => {
    const client_id = client_data.client_id;

    if (!game_id) {
      set_interface_data({...interface_data, error_message: "Please add a Game ID"});
      return
    }
    else {
      set_interface_data({...interface_data, error_message: ""});
    }

    // user wants to join existing game
    const payload = {
        "method": "join",
        "client_id": client_id,
        "game_id": game_id,
        "player_name": player_name
    };

    console.log(client_id)

    const response = await sendMessage(JSON.stringify(payload));
  };

  // on game ball button press
  const click_ball = async (ball_id) => {
    if(game_data.status !== "started")
      return;

    const client_id = client_data.client_id;
    const game_id = game_data.id;

    // user clicks a ball
    const payload = {
      "method": "play",
      "client_id": client_id,
      "game_id": game_id,
      "ball_id": ball_id
    };

    const response = await sendMessage(JSON.stringify(payload));
  }

  return (
    <div className="container">
      <Header title="Colour Fight" />
      <Routes>
        <Route path="/" exact element={
          <MainMenu />
        } />
        <Route path="/new" exact element={
          <NewMenu interface_data={interface_data} new_game={new_game} />
        } />
        <Route path="/join" exact element={
          <JoinMenu interface_data={interface_data} join_game={join_game} />
        } />
        <Route path="/game/:id" exact element={
          <GameBoard game_data={game_data} click_ball={click_ball} />
        } />
      </Routes>        
    </div>
  );
}

export default App;
