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

  console.log(wordCounts);
  var margin = {top: 20, right: 20, bottom: 80, left: 40},
  width = 1200 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom
  aspect = 500/1200;

  var svg = d3.select("#publications").append("svg")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0,0,1200,500")
  .attr("class", "class")
  .attr("width", width + margin.left + margin.right)
  .attr("height", (width + margin.top + margin.bottom)*aspect)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  resize();
  d3.select(window).on('resize.class', resize);

  function incrementWordCount(s, obj) {
    var title = s.split(/\W+/);
    title.map(function(word) {
      if (word) {   
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
