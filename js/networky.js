"use strict";




var networky=function(){
	/*
	nodes		[ { key: b, _delete:0, id:index, lsChild:[], label: key } ]
	edges		[ [aI, bI, key2] ]
	__nodes	{ key : index }
	__links	{ key : { value:1, weight:weight, _delete:0 } }
	*/
	var nodes = [], edges = [];
	var __links = {}, __nodes = {}, //key - index
		 _string = "string", _number = "number", _object = "object",  _sp = "y*_*y", index = 0;
	
	this.add_edge = function(edge){
		var a = edge[0], b = edge[1], aI=-1, bI=-1, weight=edge[2] || 1, type = typeof(edge[0]);
		if(_string == type){
			this._add_edge_string(a, b, weight);
		}else if(_number == type){
			this._add_edge_string(a.toString() , b.toString() , weight);
		}else if(_object == type){
			this._add_edge_object(a, b, weight);
		}	
	};
	//the common way to create network
	this._add_edge_string = function(a, b, weight){
		if(a == b)return;
		var nd = [a, b], inx = [-1, -1];
		nd.forEach(function(d, i){
			if(__nodes[d] != undefined){ //if exist d
				inx[i] = __nodes[d];
			}else{
				nodes.push({ key: d, _delete:0, id:index, lsChild:[], label: d });
				__nodes[d] = index;
				inx[i] = index++;
			}
		});
		var key1 = a + _sp + b, key2 = b + _sp + a;
		if(__links[key1]){
			__links[key1].value++;
			__links[key1].weight += weight;
		}else{
			if(__links[key2]){
				__links[key2].value++;
				__links[key2].weight += weight;					
			}else{
				__links[key2]={ value:1, weight:weight, _delete:0 };
				edges.push([inx[0], inx[1], key2]);
				nodes[inx[0]].lsChild.push(inx[1]);
				nodes[inx[1]].lsChild.push(inx[0]);		
			}
		}
	};
	//complex way to create network
	this._add_edge_object = function(a, b, weight){
		console.error("we have not implemented this type");
	}
	this.add_edges_from = function(_edges){
		for(var i=0; i<_edges.length; i++)this.add_edge(_edges[i]);
	};
	this.add_node = function(n){
		
	};
	this.add_nodes_from = function(_nodes){
		for(var i=0; i<_nodes.length; i++)this.add_node(_nodes[i]);
	};
	this.nodes = function(key){
		if(key != null)return nodes[__nodes[key]];
		return nodes.filter(function(d){ return 0==d._delete }).map(function(d){ return d.key; });
	}
	var get_nodes = function(){
		return nodes.filter(function(d){ return 0==d._delete });
	}
	this.edges = function(_weight, tuple){	
		return get_edges(_weight, tuple);
	}
	var get_edges = function(_weight, tuple){	//_weight - true or false, tuple - [key1, key2]
		if(tuple != null){
			var key = __links[tuple[0] + _sp + tuple[1]] ? tuple[0] + _sp + tuple[1] : 
				__links[tuple[1] + _sp + tuple[0]] ? tuple[1] + _sp + tuple[0] : null;
			return __links[key] && __links[key]._delete==0 ? [key.split(_sp), __links[key].weight]: null;
		}
		return edges.map(function(d){
			return _weight ? [nodes[d[0]].key, nodes[d[1]].key, __links[d[2]].weight] : [nodes[d[0].key], nodes[d[1]].key];
		});
	}
	this.weight = function(tuple){	//tuple - [id1, id2]
		var t = typeof(tuple[0]) == _number ? [nodes[tuple[0]].key, nodes[tuple[1]].key] : tuple,
			e = get_edges(true, t);
		return e ? e[1] : null;
	}
	this.labels = function(_index){	//_index - 节点索引
		if(_index != null)return nodes[_index]._delete==0 ? nodes[_index].label : null;
		return get_nodes().map(function(d){ return d.label; });
	}
	this.degree = function(node, _weight){
		return get_nodes().reduce(function(a, b){ a[b.key] = b.lsChild.length; return a; }, {});
	}
	this.number_of_nodes = function(){
		return get_nodes().length;
	}
	this.number_of_edges = function(){
		return edges.length;
	}
	this.size = function(){
		return this.number_of_edges();
	}
	this.average_degree = function(){
		return get_nodes().reduce(function(a, b){ return a + b.lsChild.length; }, 0) / this.number_of_nodes();
	}
	this.betweenness_centrality = function(){
		var dt = [];
	}
	this.dijkstra_path = function(node){	//node - key
		var bigNum = 65535, source = [{"key":node, "value":0} ], nds = get_nodes(), target=[];
		for(var i=0; i<nds.length; i++)
			if(node != nds[i].key)target.push({ "key":nds[i].key, "value":bigNum }) 
		while(source.length < nds.length){
			var last = source[source.length-1], minV = target[0].value, minI = 0;
			for(var i=0; i<target.length; i++){
				var e = this.edges(true, [last.key, target[i].key]); //是否有边
				if(e && (last.value + 1) < target[i].value) target[i].value =  last.value + 1;
				if(minV > target[i].value){ minV = target[i].value, minI = i; }				
			}
			source.push(target[minI]);
			target.splice(minI, 1);
		}
		return source.reduce(function(a, b){ a[b.key] = b.value; return a; }, {});
	}
	this.shortest_path_length = function(param){
		if(param == null){ //全部

			
		}else if(typeof(param)==_string){ //节点
			
			
		}else if(typeof(param)==_object){ //节点对
			
			
		}
	}
	this.label_propagation = function(){
		var labels = this.labels, weight = this.weight, nds = get_nodes(), times = nodes.length + 1; //同值选取方案
		function _stop(_nds){
			for(var i=0; i<_nds.length; i++)
				if(_nds[i]._delete == 0 && _nds[i].label != _get_max_label(_nds[i].key))return 0;
			return 1;
		}
		function _get_max_label(node){	//node - key
			var lbs = nodes[__nodes[node]].lsChild.reduce(function(a, b){
				a[labels(b)] = a[labels(b)]!=undefined ? a[labels(b)]+= weight([__nodes[node], b]) : weight([__nodes[node], b]);
				return a;
			}, {});	
			var st = __items(lbs).sort(function(a, b){ return a[1] < b[1]; }),
				ft = st.filter(function(d, i){ return d[1]==st[0][1]; });
			return __keys(lbs).length == 0 ? null : ft[times++ % ft.length][0];// __get_rand(ft)[0];
		};
		while(_stop(nds) == 0)
			nds.forEach(function(d, i){ nds[i].label = _get_max_label(nds[i].key); });
	}
	this.community_detection = this.label_propagation;
	this.get_graph_d3 = function(){
		var n = nodes.filter(function(d){ return 0==d._delete }),
			nd = n.reduce(function(a, b, i){ a[b.key] = i; return a }, {});	//防止删除节点
		return { "nodes":  n.map(function(d){
				return { "name":d.key, "group":d.label };	
			}), "links": edges.map(function(d){
			return { "source":nd[nodes[d[0]].key], "target":nd[nodes[d[1]].key], "value":__links[d[2]].weight };
		}) };
	}
	this.draw = function(id){
		var div=d3.select("#"+id), width=parseInt(div.style("width")), height=parseInt(div.style("height")),
			color = d3.scale.category20(), graph = this.get_graph_d3();
		var force = d3.layout.force().charge(-280).linkDistance(30).size([width, height]);
		var svg = d3.select("#" + id).append("svg").attr("width", width).attr("height", height);
		
		force.nodes(graph.nodes).links(graph.links).start();
		
		var link = svg.selectAll(".link")
			.data(graph.links).enter().append("line").attr("class", "link")
			.style("stroke-width", function(d) { return Math.sqrt(d.value); })
			.style("stroke", "#999").style("stroke-opacity", .6);

		var node = svg.selectAll(".node")
			.data(graph.nodes).enter().append("circle")
			.style("stroke", "#fff").style("stroke-width", "1.5px").attr("r", 5)
			.style("fill", function(d) { return color(d.group); })
			.call(force.drag);
		
		node.append("title").text(function(d) { return d.name; });
		
		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });
			node.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
		});
	};
	this.debug = function(){
		//cout(nodes);
		//cout(__nodes);
		//cout(nodes.map(function(d, i){ return [d.key, d.label] }))
		//cout();
		//cout(__keys(__nodes).length);		
	}
	var __keys = function(obj){
		var ls=[];
		for(var key in obj){ ls.push(key); }
		return ls;
	}
	var __items = function(obj){
		var ls=[];
		for(var key in obj){ ls.push([key, obj[key]]); }
		return ls;
	}
	var __get_rand = function(ary){
		return ary[Math.floor( Math.random() * ary.length )];
	}	
};
var n=new networky();
var ttt = "2 1,3 1,3 2,4 1,4 2,4 3,5 1,6 1,7 1,7 5,7 6,8 1,8 2,8 3,8 4,9 1,9 3,10 3,11 1,11 5,11 6,12 1,13 1,13 4,14 1,14 2,14 3,14 4,17 6,17 7,18 1,18 2,20 1,20 2,22 1,22 2,26 24,26 25,28 3,28 24,28 25,29 3,30 24,30 27,31 2,31 9,32 1,32 25,32 26,32 29,33 3,33 9,33 15,33 16,33 19 ,33 21,33 23,33 24,33 30,33 31,33 32,34 9,34 10,34 14,34 15,34 16,34 19,34 20,34 21,34 23,34 24,34 27,34 28,34 29,34 30,34 31,34 32,34 33";
var tpp = ttt.split(",");
tpp.forEach(function(d, i){
	var t = d.split(" ");
	n.add_edge([t[0], t[1]]);	
});
/*
n.add_edge(["2", "3", 4]);
n.add_edge(["4", "3", 5]);
n.add_edge(["3", "5", 5]);
n.add_edge(["3", "5", 6]);
n.add_edge(["3", "5", 6]);
*/
console.log(n.nodes());
//console.log(n.edges(true));
console.log(n.degree());
console.log(n.number_of_nodes());
console.log(n.size());
console.log(n.average_degree());
//console.log(n.edges(true, [2, 3]));
//console.log(n.weight(['2', '3']));

n.community_detection();
n.dijkstra_path("17");
n.shortest_path_length([12]);
n.shortest_path_length();
s = {};
//alert(__keys(s).length == 0);


var s = {'k1':23, 'k2':24, "k4":0};
var dc = [2, 3, 5, 7, 9];//2, 4, 6, 7
//cout(dc.map(function(d){ if(d>2)return d; }));

//console.log(n.__keys(null));
n.draw("net1");
n.debug();

//if(s['k3'] == undefined)alert(s['k3']);

//console.log(JSON.stringify(dt1)==JSON.stringify(dt2));

//alert(n.nodes.length)