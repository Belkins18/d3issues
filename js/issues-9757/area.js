const margin    = {top: 50, right: 30, bottom: 30, left: 30};
const width     = 620 - (margin.left + margin.right);
const height    = 400 - (margin.top + margin.bottom);

const svg_wraper = d3.select(".chart-wrapper.chart-wrapper_area")
    .attr("style", "width: "+(width + margin.left + margin.right)+"px; height: "
        +(height + margin.top + margin.bottom)+"px")
    .style("margin", "auto")
    .style("position", "relative");

const x = d3.time.scale().range([0, width])
      y = d3.scale.linear().range([height, 0]);

const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

const area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.close); });

const svg = d3.select("#chart-area")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("class", "chart__cnt")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // добавляем заголовок
  svg.append("text")
      .attr("x", 0)
      .attr("y", -15 )
      .attr("text-anchor", "start")
      .attr("fill", "#ffffff")
      .style("font-size", "22px")
      .style("font-family", "Arial")
      .text("Converter Leads");

d3.tsv("area.tsv", function(error, data) {
  if (error) throw error;

  // data.forEach(function(d) {
  //   d.date = +d.date;
  //   d.close = +d.close;
  // });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");
});


function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}
