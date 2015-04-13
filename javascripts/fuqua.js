loadJson('fuqua.test');

function loadJson(dataSet) {
  d3.json("/datasets/" + dataSet + ".json", function(error, json) {
    if (error) return console.warn(error);
    d3.select("svg").remove();
    visualize(json);
  });
}

function visualize (data) {

  var margin = {top: 20, right: 20, bottom: 80, left: 40},
  width = 1200 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  margin2 = {top: 430, right: 10, bottom: 20, left: 40},
  height2 = 500 - margin2.top - margin2.bottom,
  aspect = 700/1200;

  var steam = "Steam Use (lbs/hr)",
  breeden = "Breeden Hall CHW Use (ton-hrs)"
  remaining = "Remaining Fuqua CHW Use (ton-hrs)"

  var parseDate = d3.time.format.iso.parse;
  var dayFormat = d3.time.format("%Y-%d-%m")

  var x = d3.time.scale().range([0, width]),
  x2 = d3.time.scale().range([0, width]),
  y = d3.scale.linear().range([height, 0]),
  y2 = d3.scale.linear().range([height2, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
  xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
  yAxis = d3.svg.axis().scale(y).orient("left");

  var brush = d3.svg.brush()
  .x(x2)
  .on("brush", brushed)
  .on("brushend", brushed);

  var area,
  area2

  var svg = d3.select("#fuqua").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0,0,1200,700")
    .attr("class", "class")
    .attr("width", width + margin.left + margin.right)
    .attr("height", (width + margin.top + margin.bottom)*aspect);

  resize();
  d3.select(window).on('resize.class', resize);

  svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

  var focus = svg.append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg.append("g")
  .attr("class", "context")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  x.domain(d3.extent(data.map(function(d) {
    data.forEach(function(d) {
      d.date = parseDate(d['Time']);
    })
    return d.date;
  })));
  y.domain([0, d3.max(data.map(function(d) {
    data.forEach(function(d) {
      if (d[steam]) {
        d.accepted = +d[steam];
      } else {
        d.accepted = 0;
      }
    })
    return d.accepted;
  }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  updateData(steam);
  appendLegend();

  focus.append("path")
  .datum(data)
  .attr("class", "area")
  .attr("d", area);

  focus.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  focus.append("g")
  .attr("class", "y axis")
  .call(yAxis);

  context.append("path")
  .datum(data)
  .attr("class", "area")
  .attr("d", area2);

  context.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height2 + ")")
  .call(xAxis2);

  context.append("g")
  .attr("class", "x brush")
  .call(brush)
  .selectAll("rect")
  .attr("y", -6)
  .attr("height", height2 + 7);

  function updateData(type) {
    area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) {
      d.date = parseDate(d['Time']);
      return x(d.date);
    })
    .y0(height)
    .y1(function(d) {
      d.accepted = +d[type]
      return y(d.accepted);
    });

    area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) {
      d.date = parseDate(d['Time']);
      return x2(d.date);
    })
    .y0(height2)
    .y1(function(d) {
      d.accepted = +d[type];
      return y2(d.accepted);
    });

    focus.select(".area").transition().attr("d", area);
    context.select(".area").transition().attr("d", area2);

  }

  function appendLegend() {
    var legend = svg
    .append('g')
    .attr('class', 'legend');

    legend.append('rect')
    .attr("x", width-20)
    .attr("y", 0)
    .attr("width", 75)
    .attr("height", 25)
    .attr("rx", 15)
    .attr("ry", 15);

    legend.append('text')
    .attr('x', width)
    .attr('y', 16)
    .text("Total")
    .on("click", function() {updateData("total")});

    legend.append('rect')
    .attr("x", width-20)
    .attr("y", 30)
    .attr("width", 75)
    .attr("height", 25)
    .attr("rx", 15)
    .attr("ry", 15);

    legend.append('text')
    .attr('x', width+2)
    .attr('y', 46)
    .text("Bugs")
    .on("click", function() {updateData("bugs")});

    legend.append('rect')
    .attr("x", width-20)
    .attr("y", 60)
    .attr("width", 75)
    .attr("height", 25)
    .attr("rx", 15)
    .attr("ry", 15);

    legend.append('text')
    .attr('x', width-6)
    .attr('y', 76)
    .text("Chores")
    .on("click", function() {updateData("chores")});

    legend.append('rect')
    .attr("x", width-20)
    .attr("y", 90)
    .attr("width", 75)
    .attr("height", 25)
    .attr("rx", 15)
    .attr("ry", 15);

    legend.append('text')
    .attr('x', width-10)
    .attr('y', 106)
    .text("Features")
    .on("click", function() {updateData("features")});
  }

  function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
  }

  function resize() {
   width = parseInt(d3.select("#fuqua").style("width"), 10);
   width = width - margin.left - margin.right;
   d3.select("svg.class").attr("width", width + margin.left + margin.right);
   d3.select("svg.class").attr("height", (width + margin.top + margin.bottom) * aspect); 

 }
}
