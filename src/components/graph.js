class Graph {
  constructor(vertices) {
    this.v = vertices
    this.adjList = new Array(vertices).fill([])
  }

  addEdge(u,v) {
    this.adjList[u].push(v);
  }

  printAllPaths(s,d) {
    let isVisited = new Array(this.v).fill(false);
    let paths = []
    isVisited[i]=false;
    let pathList = [];
    pathList.push(s);
    paths.push(this.printAllPathsUtil(s, d, isVisited, pathList));
    return paths;
  }

  printAllPathsUtil(u,d,isVisited,localPathList) {
    if (u == (d)) {
        // console.log(localPathList)
        // routesPaths.push(...localPathList)
        return localPathList;
      }

      isVisited[u] = true;

      for (let i=0;i< this.adjList[u].length;i++) {
        if (!isVisited[this.adjList[u][i]]) {
          localPathList.push(this.adjList[u][i]);
          this.printAllPathsUtil(this.adjList[u][i], d, isVisited, localPathList);
          localPathList.splice(localPathList.indexOf(this.adjList[u][i]),1);
        }
      }

      isVisited[u] = false;
  }
}

export default Graph;