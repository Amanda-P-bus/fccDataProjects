const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";


const req = new XMLHttpRequest();
const margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  },
  width = 920 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;
  
const timeDisp = d3.timeFormat("%M:%S");
let color = d3.scaleOrdinal(d3.schemeCategory10);


const x = d3.scaleLinear().range([0, width]);
const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));


const y = d3.scaleTime().range([0, height]);
const yAxis = d3.axisLeft(y).tickFormat(timeDisp);


const div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0);

const svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "graph")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

d3.json(url).then(data => {
    data.forEach(function(d) {
        d.Place = +d.Place;
        let showTime = d.Time.split(":");
        d.Time = new Date(1970, 0, 1, 0, showTime[0], showTime[1]);
    });

    x.domain([
        d3.min(data, function(d) {return d.Year -1}),
        d3.max(data, function(d) {return d.Year+1})
    ]);

    y.domain(d3.extent(data, function(d) {return d.Time;}))

svg
.append('g')
.attr('class', 'x axis')
.attr('id', 'x-axis')
.attr('transform', 'translate(0,' + height + ')')
.call(xAxis)
.append('text')
.attr('class', 'x-axis-label')
.attr('x', width)
.attr('y', -6)
.style('text-anchor', 'end')
.text('Year');

svg
.append('g')
.attr('class', 'y axis')
.attr('id', 'y-axis')
.call(yAxis)
.append('text')
.attr('class', 'label')
.attr('transform', 'rotate(-90)')
.attr('y', 6)
.attr('dy', '.71em')
.style('text-anchor', 'end')
.text('Best Time (minutes)');

svg
.append('text')
.attr('transform', 'rotate(-90)')
.attr('x', -160)
.attr('y', -44)
.style('font-size', 18)
.text('Time in Minutes');

svg
.selectAll('.dot')
.data(data)
.enter()
.append('circle')
.attr('class', 'dot')
.attr('r', 6)
.attr('cx', function (d) {
  return x(d.Year);
})
.attr('cy', function (d) {
  return y(d.Time);
})
.attr('data-xvalue', function (d) {
  return d.Year;
})
.attr('data-yvalue', function (d) {
  return d.Time.toISOString();
})
.style('fill', function (d) {
  return color(d.Doping !== '');
})
.on('mouseover', function (event, d) {
  div.style('opacity', 0.9);
  div.attr('data-year', d.Year);
  div
    .html(
      d.Name +
        ': ' +
        d.Nationality +
        '<br/>' +
        'Year: ' +
        d.Year +
        ', Time: ' +
        timeDisp(d.Time) +
        (d.Doping ? '<br/><br/>' + d.Doping : '')
    )
    .style('left', event.pageX + 'px')
    .style('top', event.pageY - 28 + 'px');
})
.on('mouseout', function () {
  div.style('opacity', 0);});



  var legendContainer = svg.append('g').attr('id', 'legend');

  var legend = legendContainer
    .selectAll('#legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend-label')
    .attr('transform', function (d, i) {
      return 'translate(0,' + (height / 2 - i * 20) + ')';
    });

  legend
    .append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', color);

  legend
    .append('text')
    .attr('x', width - 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(function (d) {
      if (d) {
        return 'Riders with doping allegations';
      } else {
        return 'No doping allegations';
      }
    });



});

/*
req.open("GET", url, true);
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(data.map((item) => {return item}));
   
}
req.send();*/