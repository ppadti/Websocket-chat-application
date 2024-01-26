import ReactDOM from "react-dom";
import React, { Component } from "react";
import { w3cwebsocket as w3cwebsocket } from "websocket";
import { Card, Avatar, Input, Typography } from "antd";
import "antd/dist/reset.css";
import "./index.css";

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const client = new w3cwebsocket("ws://127.0.0.1:8000");

export default class APP extends Component {
  state = {
    userName: "",
    isLoggedIn: false,
    messages: [],
  };

  onButtonClicked = (value) => {
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: this.state.userName,
      })
    );
    this.setState({ searchVal: "" });
  };

  componentDidMount() {
    client.onopen = () => {
      console.log("websocket client connected");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("got reply! ", dataFromServer);
      if (dataFromServer.type === "message") {
        this.setState((state) => ({
          messages: [
            ...state.messages,
            {
              msg: dataFromServer.msg,
              user: dataFromServer.user,
            },
          ],
        }));
      }
    };
  }
  render() {
    return (
      <div className="main">
        {this.state.isLoggedIn ? (
          <div>
            <div className="title">
              <Text type="secondary" style={{ fontSize: "36px" }}>
                WebSocket
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: 50,
              }}
            >
              {this.state.messages.map((message) => (
                <Card
                  key={message.msg}
                  style={{
                    width: 300,
                    margin: "16px 16px 0 4px",
                    alignSelf:
                      this.state.userName === message.user
                        ? "flex-end"
                        : "flex-start",
                  }}
                  loading={false}
                >
                  <Meta
                    avatar={
                      <Avatar
                        src="https://api.dicebear.com/7.x/miniavs/svg?seed=2"
                        style={{ color: "#f5ba00", backgroundColor: "#141415" }}
                      />
                    }
                    title={message.user}
                    description={message.msg}
                  />
                </Card>
              ))}
            </div>
            <div className="bottom">
              <Search
                placeholder="Input message and send "
                enterButton="Send"
                value={this.state.searchVal}
                size="large"
                onChange={(e) => this.setState({ searchVal: e.target.value })}
                onSearch={(value) => this.onButtonClicked(value)}
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: "200px 40px" }}>
            <Search
              placeholder="Enter username"
              enterButton="Login"
              size="large"
              onSearch={(value) =>
                this.setState({ isLoggedIn: true, userName: value })
              }
            />
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<APP />, document.getElementById("root"));
