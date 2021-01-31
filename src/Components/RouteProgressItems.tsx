import React from "react";
import {
  IntermediateRouteFailAll,
  IntermediateRouteFailNet,
  IntermediateRouteSucceed,
} from "../Routers/Router";
import NetColors from "./NetColorTheme";
import "./RouteProgressItems.css";
import { v4 as uuidv4 } from "uuid";

type ConnectedSucceedProps = {
  result: IntermediateRouteSucceed;
};
export function ConnectSucceed({ result }: ConnectedSucceedProps) {
  const id = uuidv4();
  return (
    <div>
      <div className="history-list">
        {result.connectionHistory.map((conn, i) => {
          return (
            <div
              key={`${id} ${i}`}
              className="history-cell"
              style={{ backgroundColor: NetColors[conn.netID] }}
            ></div>
          );
        })}
        <div
          className="history-cell"
          style={{ backgroundColor: NetColors[result.newConnection.netID] }}
        ></div>
      </div>
    </div>
  );
}

type ConnectFailNetProps = {
  result: IntermediateRouteFailNet;
};
export function ConnectFailNet({ result }: ConnectFailNetProps) {
  const id = uuidv4();
  return (
    <div>
      <div className="history-list">
        {result.connectionHistory.map((conn, i) => {
          return (
            <div
              key={`${id} ${i}`}
              className="history-cell"
              style={{ backgroundColor: NetColors[conn.netID] }}
            ></div>
          );
        })}
        <div
          className="history-cell"
          style={{ backgroundColor: NetColors[result.failedNet.netID] }}
        ></div>
      </div>
    </div>
  );
}

type ConnectFailAllProps = {
  result: IntermediateRouteFailAll;
};
export function ConnectFailAll({ result }: ConnectFailAllProps) {
  const id = uuidv4();
  return (
    <div>
      <div className="history-list">
        {result.connectionHistory.map((conn, i) => {
          return (
            <div
              key={`${id} ${i}`}
              className="history-cell"
              style={{ backgroundColor: NetColors[conn.netID] }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
