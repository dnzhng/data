d3.json("/baker_lee.json", function(error, json) {
  if (error) return console.warn(error);
  visualize(json);
});

function visualize (data) {
	pubYearCount = {}
	data.publications.map(function(x) { addYearToMap( new Date(x.attributes.year).getFullYear() ); });
  var nameSplit = data.label.split(", ");
  var margin = {top: 20, right: 20, bottom: 80, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom
    aspect = 500/1200;

  var svg = d3.select("#lee_baker").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0,0,1200,500")
    .attr("class", "baker")
    .attr("width", width + margin.left + margin.right)
    .attr("height", (width + margin.top + margin.bottom)*aspect)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var circle = svg.append("circle");
  var years = svg.append("text");
  var pubs = svg.append("text");

  // Drop Shadow Filter
  var defs = svg.append("defs");

  var filter = defs.append("filter")
      .attr("id", "dropshadow")

  filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 4)
      .attr("result", "blur");
  filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

  resize();
  d3.select(window).on('resize.baker', resize);

  svg.append("text")
    .attr("x", 50)
    .attr("y", 50)
    .attr("filter", "url(#dropshadow)")
    .text(nameSplit.reverse().join(" ") + "'s Publications by Year");

  circle.attr("cx", 505)
    .attr("cy", height/2+10);

  years.attr("x", 460)
    .attr("y", height/2)
    .attr("filter", "url(#dropshadow)");

  pubs.attr("x", 400)
    .attr("y", height/2 + 50)
    .attr("filter", "url(#dropshadow)");

  Object.keys(pubYearCount).forEach(function(d, i) {
    if (!isNaN(d)) {
      circle.transition().duration(1000).delay(i*1000)
        .attr("r", pubYearCount[d]*25);

      years.transition().duration(1000).delay(i*1000)
        .text(d);

      pubs.transition().duration(1000).delay(i*1000)
        .text(function() {
          if (pubYearCount[d] === 1) {
            return pubYearCount[d] + " publication";
          } else {
            return pubYearCount[d] + " publications";
          }
        });
    }
  });

  function addYearToMap (year) {
  	if (pubYearCount[year]) {
  		pubYearCount[year]++;
  	} else {
  		pubYearCount[year]=1;
  	};
  }

	function resize() {
	  width = parseInt(d3.select("#lee_baker").style("width"), 10);
	  width = width - margin.left - margin.right;
	  d3.select("svg.baker").attr("width", width + margin.left + margin.right);
	  d3.select("svg.baker").attr("height", (width + margin.top + margin.bottom) * aspect);
	}
}
