function d3_Tree2(domId, data, callbackClick, callbackDbClick,callbackLineClick) {
  var groups = data.nodes;
  var links = data.links;
  var nodes = {};
  var selectedName = "";
  var groupType = {
    "0": "未知信息",
    "1": "手机号码",
    "2": "车牌号码",
    "3": "微信号码",
    "4": "QQ号码",
    "5": "姓名",
    "6": "身份证号",
    "7": "住址详址",
    "8": "邮箱",
    "9": "IMEI",
    "10": "IMSI",
    "11": "MAC",
    "12": "护照号",
    "13": "微博号",
    "14": "公司名称",
    "15": "服务处所",
    "16": "父母亲姓名",
    "17": "子女姓名",
    "19": "父亲姓名",
    "20": "小型汽车",
    "21": "轻便摩托车",
    "22": "普通摩托车",
    "23": "大型汽车",
    "24": "挂车汽车",
    "25": "警用汽车",
    "26": "警用摩托车",
    "27": "跨行政辖区临时移动使用的临时行驶车号牌",
    "28": "临时摩托车",
    "29": "其他车辆",
    "30": "监护人身份证号",
    "31": "监护人姓名",
    "32": "监护人服务处所",
    "33": "监护人住址详址",
    "34":"监护人手机号码",
    "49":"寄件人身份证号",
    "50":"寄件人姓名",
    "51":"寄件人手机号码",
    "52":"收件人身份证号",
    "53":"收件人姓名",
    "54":"收件人手机号码",
    "55":"房东身份证号",
    "56":"房东姓名",
    "57":"房东手机号码",
    "58":"房屋地址",
    "62":"租客身份证号",
    "63":"租客姓名",
    "64":"租客手机号码",
    "74":"租车人身份证号",
    "75":"租车人姓名",
    "76":"租用车牌号",
    "77":"租车人手机号码",
    "78":"车主身份证号",
    "79":"车主姓名",
    "80":"车主手机号码",
    "81":"租用车辆识别码",
    "82":"租用车辆号牌类型",
    "87":"嫌疑人姓名",
    "89":"案件名称",
    "100":"公司联系电话",
    "104":"公司负责人身份证号",
    "105":"公司负责人姓名",
    "106":"公司负责人手机号码",
    "107":"公司法人身份证号",
    "108":"公司法人姓名",
    "109":"公司法人手机号码",
    "110":"公司详址"
  }

  links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = {
      name: link.source
    });
    link.target = nodes[link.target] || (nodes[link.target] = {
      name: link.target
    });
    console.log(nodes[link.source]);
  });

  groups.forEach(function(group) {
    nodes[group.name].group = group.group;
    nodes[group.name].selected = group.selected;
  });
  var dom = $("#" + domId);
  dom.empty();
  var width = dom.width(),
    height = dom.height();

  var dragEvent = 0;

  var force = d3.layout.force() //layout将json格式转化为力学图可用的格式
    // .nodes(d3.values(nodes))//设定节点数组
    // .links(links)//设定连线数组
    .size([width, height]) //作用域的大小
    .linkDistance(180) //连接线长度
    .charge(-1500) //顶点的电荷数。该参数决定是排斥还是吸引，数值越小越互相排斥
    .on("tick", tick); //指时间间隔，隔一段时间刷新一次画面
  // .start()//开始转换
var firstsvg=d3.select("#" + domId).append("svg").attr("width", width)
    .attr("height", height);

    // 专门用于 拖动 / 缩放，为了避免 translate 的共同作用缺陷(方法是使用一个rect图形作为公共zoom层)
    firstsvg.append('rect').attr({
        width:width,
        height:height,
        fill:'white',
        transform : 'translate(0,0)scale(1)'
    }).call(
        d3.behavior.zoom()
            .scaleExtent([0.5, 1.5])
            .on("zoom", zoom)
    )

  var svg =firstsvg
    .on('dblclick.zoom', null).append("g");






  function zoom() {
    if (dragEvent != 2) {
      svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
  }

  var drag = force.drag()
    .on("dragstart", function(d, i) { //拖拽开始
      dragEvent = 1;
      d.fixed = true; //拖拽开始后设定被拖拽对象为固定
    })
    .on("dragend", function(d, i) { //拖拽结束
      dragEvent = 0;
    })
    .on("drag", function(d, i) { //拖拽
      dragEvent = 2;
    });

  var edges_line;
  var edges_text;
  var nodes_img;
  var text;
  //箭头
  var marker = svg.append("marker")
    .attr("id", "resolved")
    .attr("markerUnits", "userSpaceOnUse")
    .attr("viewBox", "0 -5 10 10") //坐标系的区域
    .attr("refX", 32) //箭头坐标
    .attr("refY", -1)
    .attr("markerWidth", 12) //标识的大小
    .attr("markerHeight", 12)
    .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
    .attr("stroke-width", 2) //箭头宽度
    .append("path")
    .attr("d", "M0,-5L10,0L0,5") //箭头的路径
    .attr('fill', '#B43232'); //箭头颜色
  function update() {

    force
      .nodes(d3.values(nodes))
      .links(links)
      .start();

    //设置连接线    
    svg.selectAll(".edgepath").remove();
    edges_line = svg.selectAll(".edgepath")
      .data(force.links())
      .enter()
      .append("path")
      .attr({
        'd': function(d) {
          return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
        },
        'class': 'edgepath',
        'id': function(d, i) {
          return 'edgepath' + i;
        }
      })
      .style("stroke", function(d) {
        var lineColor;
        lineColor = "#B43232";
        return lineColor;
      })
      // .style("pointer-events", "none")
      .style("stroke-width", 2) //线条粗细
      .attr("marker-end", function(line) { //根据箭头标记的id号标记箭头 "url(#resolved)"
        if(force.links().length > 1) {
          return "url(#resolved)";
        }else {
          return "";
        }
      });

    edges_line.on("click",function(line) {
        //单击时让连接线加粗
        edges_line.style("stroke-width", function(sourceLine) {
          if (sourceLine.source.name == line.source.name && sourceLine.target.name == line.target.name) {
            return 4;
          } else {
            return 2;
          }
        });
        edges_text.style("fill", function(sourceLine) {
          if (sourceLine.source.name == line.source.name && sourceLine.target.name == line.target.name) {
            return "red";
          } else {
            return "black";
          }
        });
        edges_text.style("font", function(sourceLine) {
          if (sourceLine.source.name == line.source.name && sourceLine.target.name == line.target.name) {
            return "18px Microsoft YaHei";
          } else {
            return "12px Microsoft YaHei";
          }
        });
        callbackLineClick(line);
    });

    svg.selectAll(".edgelabel").remove();
    edges_text = svg.append("g").selectAll(".edgelabel")
      .data(force.links())
      .enter()
      .append("text")
      // .style("pointer-events", "none")
      // .style("fill", "red")
      .style("font", "12px Microsoft YaHei")
      .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
      .attr({
        'class': 'edgelabel',
        'id': function(d, i) {
          return 'edgepath' + i;
        },
        'dx': 80,
        'dy': 0
      });

    //设置线条上的文字
    edges_text.append('textPath')
      .attr("transform","rotate(-20)")
      .attr('xlink:href', function(d, i) {
        return '#edgepath' + i
      })
      // .style("pointer-events", "none")
      .text(function(d) {
        return d.rela;
      });

    edges_text.on("click",function(line) {
        //单击时让连接线加粗
        edges_line.style("stroke-width", function(sourceLine) {
          if (sourceLine.source.name == line.source.name && sourceLine.target.name == line.target.name) {
            return 4;
          } else {
            return 2;
          }
        });
        edges_text.style("fill", function(sourceLine) {
          if (sourceLine.source.name == line.source.name && sourceLine.target.name == line.target.name) {
            return "red";
          } else {
            return "black";
          }
        });
        edges_text.style("font", function(sourceLine) {
          if (sourceLine.source.name == line.source.name && sourceLine.target.name == line.target.name) {
            return "18px Microsoft YaHei";
          } else {
            return "12px Microsoft YaHei";
          }
        });
        callbackLineClick(line);
    });

    svg.selectAll("image").remove();
    nodes_img = svg.append("g").selectAll("image")
      .data(force.nodes())
      .enter()
      .append("image")
      .attr("width", 56)
      .attr("height", 56)
      .attr("xlink:href", function(d) {
        var link = links[d.index];
        if (d.group == 0) return "images/icon-0.png";
        return "images/icon-"+d.group+".png";
      })
      .attr("transform", function(d) {
        return "translate(23,23)";
      })
      .on("mouseover", function(d, i) {
        d.show = true;
      })
      .on("mouseout", function(d, i) {
        d.show = false;
      })
      .on("click", function(node) {
        edges_text.style("fill", "black");
        edges_text.style("font", "12px Microsoft YaHei");
        //单击时让连接线加粗
        selectedName = node.name;
        edges_line.style("stroke-width", function(line) {
          if (line.source.name == node.name || line.target.name == node.name) {
            return 4;
          } else {
            return 2;
          }
        });
        callbackClick(node);
      })
      .on("dblclick", function(node) { //dblclick 
        edges_text.style("fill", "black");
        edges_text.style("font", "12px Microsoft YaHei");
        if (node.group == 5) return; // 姓名
        if (node.group == 7) return; // 住址详址
        callbackDbClick(node, update, links, nodes);
      })
      .call(force.drag);

    nodes_img.append("svg:title")
      .text(function(node) {
        return groupType[node.group]
      });

    svg.selectAll("text.t123").remove();
    text = svg.append("g").selectAll("text")
      .data(force.nodes())
      //返回缺失元素的占位对象（placeholder），指向绑定的数据中比选定元素集多出的一部分元素。
      .enter()
      .append("text")
      .attr("class", "t123")
      .style("font", "12px Microsoft YaHei")
      .style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
      .attr("dy", ".35em")
      // .attr("display", "none")
      .attr("text-anchor", "middle") //在圆圈中加上数据 
      .style("font-weight", "bold")
      .style('fill', function(node) {
        var color; //文字颜色
        var link = links[node.index];
        if (node.selected) return "red";
        if (node.name == selectedName) return "red";
        color = "#480b48";
        return color;
      }).attr('x', function(d) {
          d3.select(this).append('tspan')
          .attr('x', 0)
          .attr('y', 2)
          .text(function() {
            return d.name;
          });
      })
      .on("click", function(node) {
        edges_text.style("fill", "black");
        edges_text.style("font", "12px Microsoft YaHei");
        //单击时让连接线加粗
        edges_line.style("stroke-width", function(line) {
          if (line.source.name == node.name || line.target.name == node.name) {
            return 4;
          } else {
            return 2;
          }
        });
        text.style("font", function(node1) {
          selectedName = node.name;
          if (node1.name == node.name) {
            return "18px Microsoft YaHei";
          } else {
            return "12px Microsoft YaHei";
          }
        });
        text.style("fill", function(node1) {
          if (node1.name == node.name) {
            return "red";
          } else {
            return "#480b48";
          }
        });
        callbackClick(node);
      })
      .on("dblclick", function(node) { //dblclick 
        edges_text.style("fill", "black");
        edges_text.style("font", "12px Microsoft YaHei");
        if (node.group == 5) return; // 姓名
        if (node.group == 7) return; // 住址详址
        callbackDbClick(node, update, links, nodes);
      });

  }
  update();

  function tick() {
    //更新结点图片和文字  
    nodes_img.attr("x", function(d) {
      return d.x - 100 / 2;
    });
    nodes_img.attr("y", function(d) {
      return d.y - 100 / 2;
    });

    text.attr("transform", transform2); //顶点文字

    edges_line.attr('d', function(d) {
      var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
      return path;
    });

    // edges_text.attr('transform',function(d,i){
    //       if (d.target.x<d.source.x){
    //           bbox = this.getBBox();
    //           rx = bbox.x+bbox.width/2;
    //           ry = bbox.y+bbox.height/2;
    //           return 'rotate(180 '+rx+' '+ry+')';
    //       }
    //       else {
    //           return 'rotate(0)';
    //       }
    //  });
  }

  //设置连接线的坐标,使用椭圆弧路径段双向编码
  function linkArc(d) {
    return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
  }

  //设置圆圈和文字的坐标
  function transform1(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }

  function transform2(d) {
    return "translate(" + (d.x) + "," + d.y + ")";
  }
}