function route(isBlocked, isConnected, {searchHistory, expansionList, iExpand}) {
    const nextExpansionList = [];
    expansionList.forEach( ([i, j]) => {
        searchHistory[i][j] = iExpand;
        
        const connected = isConnected(i, j);
        if(connected) {
            return {
                finished: true, 
                connectedCoor: connected, 
                expansionList: [], 
                searchHistory, iExpand
            }
        }

        [[i+1, j], [i-1, j], [i, j+1], [i, j-1]].forEach( ([i, j]) => {
            if(!isBlocked(i, j) && searchHistory[i][j] !== 0) {
                nextExpansionList.push([i, j]);
            }
        } )
    });

    return {
        searchHistory, 
        expansionList: nextExpansionList, 
        iExpand: iExpand + 1
    }
}