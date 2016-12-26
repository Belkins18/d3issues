const margin    = {top: 50, right: 30, bottom: 30, left: 30};
const width     = 620 - (margin.left + margin.right);
const height    = 400 - (margin.top + margin.bottom);

const svg_wraper = d3.select(".chart-wrapper.chart-wrapper_area")
    .attr("style", "width: "+(width + margin.left + margin.right)+"px; height: "
        +(height + margin.top + margin.bottom)+"px")
    .style("margin", "auto")
    .style("position", "relative");

const parseDate = d3.time.format("%y-%b-%d").parse;

const x = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([height, 0]);

const color = d3.scale.category20();

const xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom')
const yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')

const area = d3.svg.area()
    .x(function(d) {
      console.log("x= " + x(d.date));
      return x(d.date); })
    .y0(function(d) {
      // console.log("y0= "+ y(d.y0));
      return y(d.y0); })
    .y1(function(d) {
      console.log("y1= "+ y(d.y0 + d.y));
      return y(d.y0 + d.y);
    });

console.log(d3.svg.area()
    .x)

    // console.log("area = "+ area.x(x(function(d) {return x(d.date)} )))
const stack = d3.layout.stack()
  .values(function(d){ return d.values })
  .x(function x(d) {
    // console.log(d.y);
    return d.x })


const svg = d3.select("#chart-area")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("class", "chart__cnt")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Include DATA
d3.csv("data/area.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
  console.log(data) //data in csv file
  data.forEach(function(d) {
    // console.log(d.date)
    d.date = parseDate(d.date);
  });

  const browsers = stack(color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {
          date: d.date,
          y: d[name] * 1
        };
      })
    };
  }));
  // Find the value of the day with highest total value
  const maxDateVal = d3.max(data, function(d){
    var vals = d3.keys(d).map(function(key){ return key !== "date" ? d[key] : 0 });
    console.log(vals)
    return d3.sum(vals);
  });

  // Set domains for axes
  x.domain(d3.extent(data, function(d) {
    console.log(x(d.date));
    debugger;
    return d.date; }));
  y.domain([0, maxDateVal])



  const browser = svg.selectAll(".browser")
    .data(browsers)
    .enter()
    .append("g")
      .attr("class", "browser");

  browser.append("path")
    .attr("class", "area browser__path")
    .attr("d", function(d) {
      return area(d.values); })
    .style("fill", function(d) { return color(d.name); });

  // point_wrap
  const point_wrap = svg
      .append('g')
      .attr('class', 'point-wrap')
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + 0 + "," + 0 + ")");
  // point
  const point = point_wrap.selectAll('g.point')
    .data(data)
    .enter()
    .append('g')
      .attr('class', 'point')
      .style('position', 'relative')
  point
    .append('circle')
      .attr('class', 'point__circle')
      .attr('cx', function (d) {
        return d.value
      })
      // .attr('cy', function(d, i){
      //   return y(d.value.y0 + d.value.y / 2)
      // })
      .attr('r', 6)
      .attr('fill', '#f8bd4f')

  // добавляем заголовок
  svg.append("text")
      .attr("x", 0)
      .attr("y", -15 )
      .attr("text-anchor", "start")
      .attr("fill", "#ffffff")
      .style("font-size", "22px")
      .style("font-family", "Arial")
      .text("Converter Leads");

  browser.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
      .attr("x", "-3.5em")
      .attr("dy", ".35em")
      .attr("fill", "#ffffff")
      .style("font-family", "Arial")
      .text(function(d) { return d.name; });


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // создаем набор вертикальных линий для сетки
  d3.selectAll("g.axis.x g.tick")
      .append("line") // добавляем линию
      .classed("grid-line", true) // добавляем класс
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", - (height));

  // рисуем горизонтальные линии
  d3.selectAll("g.axis.y g.tick")
      .append("line")
      .classed("grid-line", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0);


});
