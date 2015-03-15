// mouse over effect before click
// filter out less words? 
// options to change filters - sliders? -- change css? 
// getting cloud more tight

var stopWords = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your","ain't","aren't","can't","could've","couldn't","didn't","doesn't","don't","hasn't","he'd","he'll","he's","how'd","how'll","how's","i'd","i'll","i'm","i've","isn't","it's","might've","mightn't","must've","mustn't","shan't","she'd","she'll","she's","should've","shouldn't","that'll","that's","there's","they'd","they'll","they're","they've","wasn't","we'd","we'll","we're","weren't","what'd","what's","when'd","when'll","when's","where'd","where'll","where's","who'd","who'll","who's","why'd","why'll","why's","won't","would've","wouldn't","you'd","you'll","you're","you've"]

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
  var maxCount = 0;  
  var zoom = d3.behavior.zoom()
    .scaleExtent([0, 10])
    .on("zoom", zoomed);

  data.publications.map(function(x) { incrementWordCount(x.label, wordCounts); });


  var margin = {top: 20, right: 20, bottom: 80, left: 40},
  width = 1200 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom
  aspect = 700/1200;

  var fill = d3.scale.category20();
  var svg = d3.select("#publications").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0,0,1200,700")
    .attr("class", "class")
    .attr("width", width + margin.left + margin.right)
    .attr("height", (width + margin.top + margin.bottom)*aspect)
    .call(zoom);

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
    .fontSize(function(d) { return 50 * (d.size / maxCount); })
    .on("end", draw)
    .start();



  function draw(words) {

    svg.append("g")
    .attr("transform", "translate(" + d3.select("svg.class").attr("width")/4 + "," + d3.select("svg.class").attr("height")/4 + ")")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("fill", function(d, i) { return fill(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; })
    .on("dblclick", function(d) {dblclick(d);})
    .on("mouseover", function(d){ 
      d3.select(this).transition()
        .ease('elastic')
        .duration(1000)
        .style('font-size', d.size*1.3);

     })
    .on("mouseout", function(d){ 
      d3.select(this).transition()
        .ease('elastic')
        .duration(1000)
        .style('font-size', d.size);

     });
  }

  function dblclick(d) {
    window.open("https://scholars.duke.edu/search?querytext=" + d.text, "_blank");
  }

  function zoomed() {
    svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  function incrementWordCount(s, obj) {
    var title = s.split(/\W+/);
    title.map(function(word) {
      if ($.inArray(word, stopWords) === -1) {   
        var w = word.toLowerCase();
        if (obj[w]) {
          obj[w]++;
          if (obj[w] > maxCount) {
            maxCount = obj[w];
          }
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
