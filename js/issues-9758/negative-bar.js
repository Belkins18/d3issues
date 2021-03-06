var margin  = {top: 50, right: 30, bottom: 30, left: 30};
var width   = 620 - (margin.left + margin.right);
var height  = 600 - (margin.top + margin.bottom);
// var margin = {top: 50, right: 30, bottom: 30, left: 30};
// var width = screen.width - (margin.left + margin.right);
// if ( (screen.width / 1.2) < screen.height ){
//     var height = (screen.width / 1.2) - (margin.top + margin.bottom);
// } else {
//     var height = (screen.height) - (margin.top + margin.bottom);
// }

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.15);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0)
    .tickPadding(function(d){
        return d.length
    });


var svg_wraper = d3.select(".chart-wrapper.chart-wrapper_negative-bar")
    .attr("style", "width: "+(width + margin.left + margin.right)+"px; height: "
        +(height + margin.top + margin.bottom)+"px")
    .style("margin", "auto")
    .style("position", "relative");
var svg = d3.select("#chart-negativeBar")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("class", "chart__cnt")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/data.tsv", type, function(error, data) {
  console.log(data, function(d) {
    console.log(d.value);
    console.log(d.val);
  });
  x.domain(d3.extent(data, function(d) { return d.value; })).nice();
  y.domain(data.map(function(d) { return d.name; }));

  // добавляем заголовок
  svg.append("text")
      .attr("x", 0)
      .attr("y", -15 )
      .attr("text-anchor", "start")
      .attr("fill", "#ffffff")
      .style("font-size", "22px")
      .style("font-family", "Arial")
      .text("Converter Leads");

  // размер осей
  var svg__axis = svg
      .append("g")
      .attr("class", "axis")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + 0 + "," + 0 + ")");

  var axis_bottom = svg__axis
    .append('g')
      .attr('class', 'axis__x axis__x_bottom')
      .attr('transform', 'translate(0,' + ( height ) +')')
      .call(xAxis);
  var axis_left = svg__axis
    .append('g')
      .attr('class', 'axis__y')
      .attr("transform", "translate(" + x(0) + ",0)")
      .call(yAxis);

      // создаем набор вертикальных линий для сетки
      d3.selectAll("g.axis__x g.tick")
        .append("line") // добавляем линию
          .classed("grid-line", true) // добавляем класс
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", - (height));
      // рисуем горизонтальные линии
      d3.selectAll("g.axis__y g.tick")
        .append("line")
          .classed("grid-line", true)
          .attr("x1", -width / 2)
          .attr("y1", 0)
          .attr("x2", width / 2)
          .attr("y2", 0);

  // bars_wrap
  var bars_wrap = svg
    .append('g')
      .attr('class', 'bars-wrap')
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + 0 + "," + 0 + ")");


var bars_item =  bars_wrap.selectAll(".bar")
  .data(data).enter()
  .append('g')
    .attr('class', 'bars_item');

// Create OVERLAY GRADIENT
var gradient__OVERLAY = bars_item
  .append("defs")
    .attr('class', 'gradient__OVERLAY')
    .append("linearGradient")
      .attr("id", function(d) {
        return (d.value < 0 ? "gradient_negative__OVERLAY" : "gradient_positive__OVERLAY")
      })
      .attr("x1", "0%")
      .attr("y1", "50%")
      .attr("x2", "100%")
      .attr("y2", "50%")
      .attr("spreadMethod", "pad")

  gradient__OVERLAY.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", function(d){
      return (d.value < 0 ? "rgba(245,193,58, 0.4)" : "rgba(54,215,183, 0)")
    })
    .attr("stop-opacity", 1);

gradient__OVERLAY.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", function(d){
      return (d.value < 0 ? "rgba(240,146,14, 0)" : "rgba(97,196,209, 0.4)")
    })
    // .attr("stop-color", "#f5c13a")
    .attr("stop-opacity", 1);


// Create GRADIENT
var gradient = bars_item
  .append("defs")
    .attr('class', 'gradient__RECT')
    .append("linearGradient")
      .attr("id", function(d) {
        return (d.value < 0 ? "gradient_negative" : "gradient_positive")
      })
      .attr("x1", "0%")
      .attr("y1", "50%")
      .attr("x2", "100%")
      .attr("y2", "50%")
      .attr("spreadMethod", "pad")

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", function(d){
      return (d.value < 0 ? "rgb(240,146,14)" : "rgb(63,195,128)")
    })
    .attr("stop-opacity", 1);

  gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", function(d){
        return (d.value < 0 ? "rgb(245,193,58)" : "rgb(97,196,209)")
      })
      // .attr("stop-color", "#f5c13a")
      .attr("stop-opacity", 1);

// Create RECT - OVERLAY GRADIENT
var bar_rect_overlay = bars_item
  .append('rect')
    .attr("class", function(d) {
      return "bar bar--" + (d.value < 0 ? "negative" : "positive");
    })
    .attr("x", function(d) { return x(Math.min(0, d.value)); })
    .attr("y", function(d) { return y(d.name); })
    .attr("width", function(d) {
      return Math.abs(x(d.value) - x(0));
    })
    .attr("height", y.rangeBand())
    .attr("rx", y.rangeBand() / 2)
    .style("fill", function (d) {
      return "url(#"+ (d.value < 0 ? "gradient_negative__OVERLAY" : "gradient_positive__OVERLAY")+")"
    })

// Create RECT - GRADIENT
var bar_rect = bars_item
  .append('rect')
    .attr('class', function(d){
      return "bar bar--" + (d.val < 0 ? "negative" : "positive");
    })
    .attr("x", function(d) {
      return (d.val < 0 ? -x(Math.max(d.val, 0)) : x(Math.min(0, d.val)))
      // return x(Math.min(0, d.val));
    })
    .attr('transform', function(d) {
      return (d.val < 0 ? 'scale(-1, 1)' : 'none')
    })
    // .attr("x", function(d) { return x(Math.min(d.val, 0)); })
    .attr("y", function(d) { return y(d.name); })
    .attr("width", function (d) {
      return (d.val < 0 ? 0 : 0)
    })
    .transition()
    .duration(1500)
    .attr("width", function(d) {
      return ( d.val < 0 ? Math.abs(x(d.val) - x(0)) : Math.abs(x(d.val) - x(0)) );
    })
    .attr("height", y.rangeBand())
    .attr("rx", y.rangeBand() / 2)
    .style("fill", function (d) {
      return "url(#"+ (d.val < 0 ? "gradient_negative" : "gradient_positive")+")"
    })

});
function type(d) {
  d.value = +d.value;
  return d;
}
