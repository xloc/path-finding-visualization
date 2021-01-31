import Connection from "../Models/Connection";
import { Coors, Net } from "../Models/RouteMap";

export interface ConnectionRoutingResult {
  succeed: boolean;
}

export interface ConnectionRoutingSuccess extends ConnectionRoutingResult {
  connectedPin: Coors;
  segments: Array<Coors>;
}

export interface NetRoutingResult {
  succeed: boolean;
}
export interface NetRoutingSuccess extends NetRoutingResult {
  connection: Connection;
}

////////

export interface MapRouteResult {
  succeed: boolean;
}

export interface MapRouteSuccess extends MapRouteResult {
  netRouteSequence: Array<Net>;
  connections: Array<Connection>;
}

export interface IntermediateRouteSucceed extends IntermediateRouteResult {
  connectionHistory: Array<Connection>;
  newConnection: Connection;
}

export interface IntermediateRouteFailNet extends IntermediateRouteResult {
  connectionHistory: Array<Connection>;
  failedNet: Net;
}

export interface IntermediateRouteFailAll extends IntermediateRouteResult {
  connectionHistory: Array<Connection>;
}

export enum IntermediateRouteResultType {
  Succeed = 0,
  FailNet,
  FailAll,
}

export interface IntermediateRouteResult {
  type: IntermediateRouteResultType;
}
