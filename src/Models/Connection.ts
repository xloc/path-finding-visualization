import { Coors } from "./RouteMap";

export default interface Connection {
  netID: number;
  segments: Array<Coors>;
}
