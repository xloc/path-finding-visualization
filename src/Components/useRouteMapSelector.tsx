import { List, ListItem } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { parseRoutingMapString, RouteMap } from "../Models/RouteMap";

export function useRouteMapSelector(setRouteMap: (arg0: RouteMap) => void) {
  const [infiles, setInfiles] = useState<Array<string>>();
  useEffect(() => {
    axios.get("benchmarks/infiles.json").then((res) => {
      setInfiles(res.data);
    });
    return () => {};
  }, []);

  const [mapName, setMapName] = useState("rusty.infile");
  useEffect(() => {
    if (mapName === "") return;
    axios.get<string>(`benchmarks/${mapName}`).then((res) => {
      setRouteMap(parseRoutingMapString(res.data));
    });

    /// TODO clean up
  }, [mapName, setRouteMap]);

  const routeMapSelector = (
    <List>
      {infiles?.map((filename) => (
        <ListItem
          button
          key={filename}
          onClick={() => setMapName(filename)}
          selected={filename === mapName}
        >
          {filename.split(".")[0]}
        </ListItem>
      ))}
    </List>
  );

  return { routeMapSelector, mapName };
}
