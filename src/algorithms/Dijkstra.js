import { RouteStrategy } from './RouteStrategy.js';

export class DijkstraStrategy extends RouteStrategy {
    constructor(mode) { 
        super();
        this.mode = mode; 
    }
    
    calculate(graph, startId, endId) {
        const dists = {}, prev = {}, pq = new Set(Object.keys(graph.nodes));
        Object.keys(graph.nodes).forEach(id => { dists[id] = Infinity; prev[id] = null; });
        dists[startId] = 0;

        while (pq.size > 0) {
            let curr = [...pq].reduce((a, b) => dists[a] < dists[b] ? a : b);
            if (curr === endId || dists[curr] === Infinity) break;
            pq.delete(curr);

            (graph.adjacencyList[curr] || []).forEach(edge => {
                const alt = dists[curr] + edge[this.mode];
                if (alt < dists[edge.to]) {
                    dists[edge.to] = alt;
                    prev[edge.to] = { from: curr, edge };
                }
            });
        }
        return this.reconstruct(prev, endId);
    }
    
    reconstruct(prev, endId) {
        let path = [], curr = endId, totals = { time: 0, cost: 0, walk: 0 };
        while (prev[curr]) {
            totals.time += prev[curr].edge.time;
            totals.cost += prev[curr].edge.cost;
            totals.walk += prev[curr].edge.walk;
            path.unshift(prev[curr]);
            curr = prev[curr].from;
        }
        return path.length > 0 ? { path, totals } : null;
    }
}