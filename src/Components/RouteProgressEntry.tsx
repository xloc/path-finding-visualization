import {
  CheckCircle as CheckIcon,
  ErrorOutline as ErrorOutlineIcon,
  RemoveCircle as BannedIcon,
} from "@material-ui/icons";
import { Box } from "@material-ui/core";

import {
  IntermediateRouteFailAll,
  IntermediateRouteFailNet,
  IntermediateRouteSucceed,
} from "../Routers/Router";
import NetColors from "./NetColorTheme";
import "./RouteProgressEntry.css";
import { v4 as uuidv4 } from "uuid";

type ConnectedSucceedProps = {
  result: IntermediateRouteSucceed;
};
export function ConnectSucceed({ result }: ConnectedSucceedProps) {
  const id = uuidv4();
  return (
    <div className="entry-row">
      <Box color="success.main" className="icon-alignment">
        <CheckIcon fontSize="small" />
      </Box>
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
    <div className="entry-row">
      <Box color="error.main" className="icon-alignment">
        <ErrorOutlineIcon fontSize="small" />
      </Box>
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
    <div className="entry-row">
      <Box color="error.main" className="icon-alignment">
        <BannedIcon fontSize="small" />
      </Box>
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
