const margin    = {top: 50, right: 30, bottom: 30, left: 30};
const width     = 620 - (margin.left + margin.right);
const height    = 400 - (margin.top + margin.bottom);
const parseDate = d3.timeParse("%b %Y");

// svg vrapper
const svg_wraper = d3.select(".chart-wrapper.chart-wrapper_lineZoom")
  .attr("style", "width: "+(width + margin.left + margin.right)+"px; height: "
    +(height + margin.top + margin.bottom)+"px")
  .style("margin", "50px auto 0")
  .style("position", "relative");

// select svg
const svg = d3.select('#chart-lineZoom')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append('g')
    .attr('class', 'chart__cnt')
    .attr('transform', 'translate('+ margin.left +','+ margin.top +')');

const x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom(x),
      yAxis = d3.axisLeft(y);

const zoom = d3.zoom()
  .scaleExtent([1, 32])
  .translateExtent([[0, 0], [width, height]])
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);

const area = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x(d.date); })
  .y0(height)
  .y1(function(d) { return y(d.price); });

// добавляем заголовок
svg.append("text")
    .attr("x", 0)
    .attr("y", -15 )
    .attr("text-anchor", "start")
    .attr("fill", "#ffffff")
    .style("font-size", "22px")
    .style("font-family", "Arial")
    .text("Converter Leads");

svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

const g = svg.append("g")
  .attr("transform", "translate(10," + 0 + ")")


//connect data in our chart
d3.csv("../data/sp500.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.price; })]);

  g.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + 0 + ")")
      .call(xAxis);

  g.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

  // diapazon scale
  const d0 = new Date(2004, 0, 1),
      d1 = new Date(2004, 5, 1);

  // Gratuitous intro zoom!
  svg.call(zoom).transition()
      .duration(1500)
      .call(zoom.transform, d3.zoomIdentity
          .scale(width / (x(d1) - x(d0)))
          .translate(-x(d0), 0));
});

function zoomed() {
  var t = d3.event.transform, xt = t.rescaleX(x);
  g.select(".area").attr("d", area.x(function(d) {
    return xt(d.date); }));
  g.select(".axis--x").call(xAxis.scale(xt));
}

function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}
