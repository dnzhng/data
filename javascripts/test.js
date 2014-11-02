d3.json("/baker_lee.json", function(error, json) {
  if (error) return console.warn(error);
  visualize(json);
});

function visualize (data) {
	pubYearCount = {}
	data.publications.map(function(x) { addYearToMap( new Date(x.attributes.year).getFullYear() ); });

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

  var circle = svg.selectAll("circle")
    .data(Object.keys(pubYearCount))
    .enter()
    .append("circle");

  resize();
  d3.select(window).on('resize.baker', resize);

  circle
    .attr("cx", 500)
    .attr("cy", height/2)
    .attr("fill", "orange");

  Object.keys(pubYearCount).forEach(function(d, i) {
    if (!isNaN(d)) {
      circle.transition().duration(1000).delay(i*1000)
          .attr("r", pubYearCount[d]*25);
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
