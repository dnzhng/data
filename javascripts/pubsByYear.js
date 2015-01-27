d3.json("/datasets/goldstein_david.json", function(error, json) {
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

  var svg = d3.select("#pubByYear").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0,0,1200,500")
    .attr("class", "vis")
    .attr("width", width + margin.left + margin.right)
    .attr("height", (width + margin.top + margin.bottom)*aspect)
    .append("g")
      .attr("transform", "translate(" + 0 + "," + margin.top + ")");

  var circle = svg.append("circle");
  var years = svg.append("text").style("text-anchor", "middle");
  var pubs = svg.append("text").style("text-anchor", "middle");

  resize();
  d3.select(window).on('resize.vis', resize);

  svg.append("text")
    .style("text-anchor", "middle")
    .attr("x", 577.5)
    .attr("y", 25)
    .text(nameSplit.reverse().join(" ") + "'s Publications by Year");

  circle.attr("cx", 577.5)
    .attr("cy", height/2+10);

  years.attr("x", 577.5)
    .attr("y", 75);

  pubs.attr("x", 577.5)
    .attr("y", height/2 + 200);

  // iterateThroughYears();
  changeYear(d3.select("#slider").property("value"));
  d3.select("#slider").property("max", Object.keys(pubYearCount).length-1)
    .on("input", function() {changeYear(this.value);});
  // Animate through years, currently unused
  function iterateThroughYears() {
    Object.keys(pubYearCount).forEach(function(d, i) {
      circle.transition().ease("elastic").duration(1000).delay(i*1000)
        .attr("r", pubYearCount[d]*15);

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
    });
  }
  //Change year value based on value from slider
  function changeYear(sliderInput) {
    var yearlist = Object.keys(pubYearCount);
    circle.transition().ease("elastic").duration(1000)
      .attr("r", pubYearCount[yearlist[sliderInput]]*15);

    years.transition().duration(1000)
      .text(yearlist[sliderInput]);

    pubs.transition().duration(1000)
      .text(function() {
        if (pubYearCount[yearlist[sliderInput]] === 1) {
          return pubYearCount[yearlist[sliderInput]] + " publication";
        } else {
          return pubYearCount[yearlist[sliderInput]] + " publications";
        }
      });

  }

  function addYearToMap (year) {
    if (!isNaN(year)) {
    	if (pubYearCount[year]) {
    		pubYearCount[year]++;
    	} else {
    		pubYearCount[year]=1;
    	};
    }
  }

	function resize() {
	  width = parseInt(d3.select("#pubByYear").style("width"), 10);
	  d3.select("svg.vis").attr("width", width + margin.left + margin.right);
	  d3.select("svg.vis").attr("height", (width + margin.top + margin.bottom) * aspect);
    d3.select("#slider").style("width", (width/2) + "px")
      .style("margin", "30px " + (width/4) +"px")
	}
}
