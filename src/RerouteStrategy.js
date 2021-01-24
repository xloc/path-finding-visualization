import DijkstraRouting from "./DijkstraRouting";


export function routeNet(gridModel, netID) {
  let [source, ...targets] = gridModel.nets[netID];
  let sources = [source];
  while (targets.length > 0) {
    const router = new DijkstraRouting(gridModel, sources, targets, netID);
    while(router.next());
    console.log(router.states);
    if (!router.states.trackFound) {
      return false;
    }

    const [ci, cj] = router.states.connectedCoor;
    targets = targets
      .map(({x, y}) => [x, y])
      .filter(([i, j]) => !(i === ci && j === cj))
      .map(([x, y]) => ({x, y}));
      
    const track = router.states.track;
    sources = [{x:ci, y:cj}, ...sources, ...track.map(([x, y]) => ({x, y}))];

    console.log({sources, targets});
  }
  return true;
}

function rerouteStrategy(gridModel) {
  const nets = gridModel.nets.slice();
  function helper(netsToBeRoute) {
    for (let iCurrentNet = 0; iCurrentNet < netsToBeRoute.length; iCurrentNet++) {
      const net = netsToBeRoute[iCurrentNet];
      /// route this net
      const success = true;
      if (success) {
        helper([
          ...netsToBeRoute.slice(0, iCurrentNet),
          ...netsToBeRoute.slice(iCurrentNet + 1)
        ]);
      }
    }
  }

  helper(nets);
}

// export default class RerouteStrategy {}