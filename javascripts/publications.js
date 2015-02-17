loadJson(d3.select("#dataSelect").property("value"));
d3.select("#dataSelect").on("change", function() { loadJson(this.value) });
d3.select("#submit").on("click", function() { d3.select("svg").remove(); visualize(JSON.parse(d3.select("#textarea").property("value"))); });

function loadJson(dataSet) {
  d3.json("/datasets/" + dataSet + ".json", function(error, json) {
    if (error) return console.warn(error);
    d3.select("svg").remove();
    visualize(json);
  });
}

function visualize (data) {

  var wordCounts = {};  

  data.publications.map(function(x) { incrementWordCount(x.label, wordCounts); });

  var margin = {top: 20, right: 20, bottom: 80, left: 40},
  width = 1200 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom
  aspect = 500/1200;

  var fill = d3.scale.category20();
  var svg = d3.select("#publications").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0,0,1200,500")
    .attr("class", "class")
    .attr("width", width + margin.left + margin.right)
    .attr("height", (width + margin.top + margin.bottom)*aspect);

  resize();
  d3.select(window).on('resize.class', resize);

  var cloud = d3.layout.cloud().size([d3.select("svg.class").attr("width"), d3.select("svg.class").attr("height")])
    .words(Object.keys(wordCounts).filter(function(d) {
      return d.length > 3 && wordCounts[d] > 2;
    }).map(function(d) {
      return {text: d, size: 5 * wordCounts[d]}
    }))
    .padding(5)
    .rotate(function(d) { return d.text.length > 5 ? 0 : 90; })
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();



  function draw(words) {

    svg.append("g")
    .attr("transform", "translate(" + d3.select("svg.class").attr("width")/4 + "," + d3.select("svg.class").attr("height")/4 + ")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("fill", function(d, i) { return fill(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
  }



  function incrementWordCount(s, obj) {
    var title = s.split(/\W+/);
    title.map(function(word) {
      if (word.length > 2) {   
        var w = word.toLowerCase();
        if (obj[w]) {
          obj[w]++;
        } else {
          obj[w] = 1;
        }
      }
    });
  }

  function resize() {
   width = parseInt(d3.select("#publications").style("width"), 10);
   width = width - margin.left - margin.right;
   d3.select("svg.class").attr("width", width + margin.left + margin.right);
   d3.select("svg.class").attr("height", (width + margin.top + margin.bottom) * aspect); 

 }
}
