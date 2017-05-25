function d3_Tree(domId,data,callback1,callback2) {
	var dom = $("#"+domId);
	dom.empty();
	var width = dom.width(),
		height = dom.height(),
		dragEvent = 0,
  		ii = 0,//ii在外部，可实现_children生效
		root = data;
	var force = d3.layout.force()
		.linkDistance(function(d) { // 线的长度
			if(d.source.storey == 2) {
				if(d.source.children[0].name == 1) {
					return 30;
			  	}
			}
			if(d.source.storey == 3) {
				if(d.source.children[0].name == 1) {
					return 30;
			  	}
				return 80;
			}
			if(d.source.storey == 4) return 25;
			if(d.source.storey == 5) return 60;
			return 150;
		})
		.charge(-120)
		.gravity(.01)
		.size([width, height])
		.on("tick", tick);

var firstsvg=d3.select("#" + domId).append("svg").attr("width", width)
    .attr("height", height);
	firstsvg.append('rect').attr({
        width:width,
        height:height,
        fill:'white',
        transform : 'translate(0,0)scale(1)'
    }).call(
            d3.behavior.zoom() 
                .scaleExtent([0.5, 1.5]) 
                .on("zoom", zoom) 
        ).append("g");

  var svg =firstsvg
    .on('dblclick.zoom', null).append("g");
    
	var link = svg.selectAll(".link"),//连接线
		node = svg.selectAll(".node");//节点
	
	setTimeout(function() {
	    function changeData(obj) {
	    	if(obj.selected == 0) {
		    	obj.selected = 1;
		    	callback1(obj,update);
	    	}else {
	    		for (var i = 0; i < obj.children.length; i++) {
			    	changeData(obj.children[i]);
			    };
	    	}
	    }
	    changeData(root);
	},2000);

	function zoom() {
		if(dragEvent!=2) { 
			svg.attr("transform", "translate(" 
	            + d3.event.translate 
	            + ")scale(" + d3.event.scale + ")");
		}
    }

	function update() {
	  var nodes = flatten(root),
		  links = d3.layout.tree().links(nodes);

	  force
		  .nodes(nodes)
		  .links(links)
		  .start();

	  link = link.data(links, function(d) {
	  	return d.target.id; 
	  });

	  link.exit().remove();

	  link.enter().insert("line", ".node")
		.attr("class", "link")
	  	.style("fill", "none") 
	  	.style("stroke", "#EEEEEE") 
		.style("stroke-width",function(d){ // 连接线粗细
			if(d.source.children[0].name == 1) {
			return 0;
			}
			return 3;
		});

	  node = node.data(nodes, function(d) { return d.id; });

	  node.exit().remove();

	  var drag = force.drag()
				.on("dragstart",function(d,i){//拖拽开始
					dragEvent=1;
					// d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
				})
				.on("dragend",function(d,i){//拖拽结束
					dragEvent=0;
				})
				.on("drag",function(d,i){//拖拽
					dragEvent=2;
				});
	  var nodeEnter = node.enter().append("g")
		  .attr("class", "node")
		  .on("click", click)
		  .call(drag);

	 //  nodeEnter.append("circle") 
	 //  	.style("cursor", "pointer") 
	 //  	.style("stroke", "#fff") 
		// .attr("r", function(d) { 
		// 	if(d.storey == 1) return 50; 
		// 	if(d.storey == 2) return 40; 
		// 	if(d.storey == 3) return 30; 
		// 	if(d.storey == 4) return 20; 
		// 	return 30; 
		// });

	  // nodeEnter.append("text")
		 //  .attr("dy", ".35em")
		 //  .attr("transform", function(d) { 
			// 	return "translate(0,-15)"; 
		 //  })
		 //  .style("text-shadow", "1px 1px 10px #aa23cc")
		 //  .style("font", "12px sans-serif")
		 //  .style("pointer-events", "none")
		 //  .style("text-anchor", "middle")
		 //  .text(function(d) { return d.val; });

	  nodeEnter.append("image")
		.attr("width",function(d) {
			if(d.storey == 5) {
				return 15;
			}else if(d.storey == 6) {
				return 0;
			}else {
				return 56;
			}
		})
		.attr("height",function(d) {
			if(d.storey == 5) {
				return 15;
			}else if(d.storey == 6) {
				return 0;
			}else {
				return 56;
			}
		})
		.attr("transform", function(d) { 
			if(d.storey == 5) {
				return "translate(-7.5,-7.5)";
			}else {
				return "translate(-28,-28)"; 
			}
		})
		.attr("xlink:href",function(d) {
			if(d.storey == 5) {
				if(d.name=="1") {
					return "images/icon01.png";//icon01.png
				}else if(d.name=="2") {
					return "images/icon02.png";//icon02.png
				}
			}else {
				if(d.group==0) return "images/icon-0.png";  // 
				if(d.group==1) return "images/icon-1.png";  // 电话
				if(d.group==2) return "images/icon-2.png";  // 车牌号
				if(d.group==3) return "images/icon-3.png";  // 微信
				if(d.group==4) return "images/icon-4.png";  // QQ
				if(d.group==5) return "images/icon-5.png";  // 姓名
				if(d.group==6) return "images/icon-6.png";  // 身份证
				
				if(d.group==7) return "images/icon-7.png";  // 住址
				if(d.group==8) return "images/icon-8.png";  // 邮箱
				if(d.group==9) return "images/icon-9.png";  // IMEI
				if(d.group==10) return "images/icon-10.png";  // IMSI
				if(d.group==11) return "images/icon-11.png";  // MAC
				if(d.group==12) return "images/icon-12.png";  // 护照
				if(d.group==13) return "images/icon-13.png";  // 微博

				if(d.group==14) return "images/icon-14.png";  // 人物信息
				if(d.group==15) return "images/icon-15.png";  // 车辆信息

		        if(d.group == 20) return "images/icon-20.png"; // 小型汽车
		        if(d.group == 21) return "images/icon-21.png"; // 轻便摩托车
		        if(d.group == 22) return "images/icon-22.png"; // 普通摩托车
		        if(d.group == 23) return "images/icon-23.png"; // 大型汽车
		        if(d.group == 24) return "images/icon-24.png"; // 挂车汽车
		        if(d.group == 25) return "images/icon-25.png"; // 警用汽车
		        if(d.group == 26) return "images/icon-26.png"; // 警用摩托车
		        if(d.group == 27) return "images/icon-27.png"; // 跨行政辖区临时移动使用的临时行驶车号牌
		        if(d.group == 28) return "images/icon-28.png"; // 临时摩托车 
		        if(d.group == 29) return "images/icon-29.png"; // 其他车辆

		        if(d.group == 30) return "images/icon-30.png"; // 父亲
		        if(d.group == 31) return "images/icon-31.png"; // 母亲
		        if(d.group == 32) return "images/icon-32.png"; // 配偶
		        if(d.group == 33) return "images/icon-33.png"; // 子女
			}
		 });

	  nodeEnter.append("text")
    	.attr("class", function(d) {
    		if(d.storey == 6) {
    			return "";
    		}else {
    			return "t123";
    		}
    	})  
		.attr("dy", ".35em")
		.text(function(d) { 
			if(d.name=="1"||d.name=="2"){ return "";}
			return d.name; 
		}) 
	    .style("font", "12px Microsoft YaHei")
	    .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
	    .attr("dy", ".35em")  
	    .attr("display", function(d) {
    		if(d.storey == 6) {
    			return "";
    		}else {
    			return "none";
    		}
    	})  
	    .attr("text-anchor", "middle")//在圆圈中加上数据 
	    .style("font-weight","bold") 
		.style("fill", textColor);//粗细 font-weight="bold"

	  // node.select("circle")
		 //  .style("fill", color)
		 //  .style("opacity", function(d) {
		 //  	if(d.storey == 6) {
			// 	return 0;
		 //  	}
		 //  	if(d.storey == 5) {
			// 	return 0;
		 //  	}
		 //  	return 0.9;
		 //  });
	}
	update();
	//拖动更改坐标位置
	function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });
	  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
	//主节点判别 修改字体为粗体
	function fontWeight(d){
		if(d.name.indexOf("人物信息") != -1 ){
			// return "bold";
		}
	}
	//主节点判别 修改字体颜色
	function textColor(d){
		if(d.storey == 6) return "#b92727";
		return "#480b48";
	}
	
	// 节点圆的填充色
	function color(d) {
		if(d.selected == 0) return "#e6e8ef";// 如果没有数据则为浅灰色
// #4e86df ,  #25cb8b ,  #fca418,  #ff7859,  #e6e6e6
		// if(d.storey == 1) return "#35b2f3";
		// if(d.storey == 2) return "#6e7992";
		// if(d.storey == 3) return "#58e4d9";
		// if(d.storey == 4) return "#efb322";
		// if(d.storey == 5) return "pink";
		// if(d.storey == 6) return "#6cec6c";
		if(d.storey == 1) return "#4e86df";
		if(d.storey == 2) return "#25cb8b";
		if(d.storey == 3) return "#fca418";
		if(d.storey == 4) return "#ff7859";
		if(d.storey == 5) return "pink";
		if(d.storey == 6) return "#e6e6e6";
	}

	// 点击事件
	function click(d) {
	  if(d.storey == 6) {
		overclick(d);
	  }else{
		  if (d3.event.defaultPrevented) return; // ignore drag
		  if (d.children) {
			d._children = d.children;
			d.children = null;
		  } else {
			d.children = d._children;
			d._children = null;
		  }
	  }
	  update();
	}

	//点击事件 最后一层
	function overclick(d) {
		callback2(d);
	}
	
	function flatten(root) {
	  var nodes = [];
      function recurse(node) {
        if (node.children) {
          node.children.forEach(recurse);
        }
        if (!node.id) {
          node.id = ++ii;
        }
        nodes.push(node);
      }
      recurse(root);
      return nodes;
	}

}