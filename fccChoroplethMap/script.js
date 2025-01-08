var svg = d3.select("svg")
width = +svg.attr("width"),
height = +svg.attr("height");
      
var path = d3.geoPath();

//tooltip for later use
const tip = d3.tip()
    .attr("class", "d3-tip")
    .attr("id", "tooltip")
    .html(function (d) {return d;})
    .direction('n')
    .offset([-10, 0]);

//only need x-axis here
var x = d3.scaleLinear().domain([2, 76]).rangeRound([600, 860]);


var color = d3
  .scaleThreshold()
  .domain(d3.range(2, 76, (2, 76) /7))
  .range(d3.schemePurples[7]);

var leg = svg
  .append("g")
  .attr("class", "key")
  .attr("id", "legend")
  .attr("transform", "translate(30,40)");

  leg.selectAll("rect")
        .data(
          color.range().map(function (d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
          })
        )
        .enter()
        .append("rect")
        .attr("height", 15)
        .attr("x", function (d) {
          return x(d[0]);
        })
        .attr("width", 38)
        .attr("fill", function (d) {
          return color(d[0]);
        });

     leg.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -5)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("font-size", "12.5px")
        .text("Baccalaureate Attainment per County");

      leg.call(
        d3
          .axisBottom(x)
          .tickSize(25, 0)
          .tickFormat(x => Math.round(x)+"%")
          .tickValues(color.domain())
      )
        .select(".domain")
        .remove();

const edSrc =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countySrc =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

Promise.all([d3.json(countySrc), d3.json(edSrc)])
  .then(data => ready(data[0], data[1]))
  .catch(err => console.log(err));



function ready(us, ed) {
   svg
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("data-fips", d => d.id)
    .attr('data-education', function (d) {
        var getPer = ed.filter(i => {return i.fips === d.id});
        if (!getPer[0]) {return 0}
        return getPer[0].bachelorsOrHigher;})
    .attr("fill", function (d) {
        var getPer = ed.filter(i => {return i.fips === d.id});

        if (!getPer[0]) {return color(0)}
        return (color(getPer[0].bachelorsOrHigher));})
    .attr("d", path)
    .call(tip)
    .on("mouseover", function (event, d) {
      
        var getPer = ed.filter(i => {return i.fips === d.id});

        let toolText =
        `${getPer[0].area_name}, ${getPer[0].state}: ${getPer[0].bachelorsOrHigher}%`;
        

        tip.attr("data-education", `${getPer[0].bachelorsOrHigher}`);
        tip.show(toolText, this);})
        .on("mouseout", tip.hide);

    svg
      .append("path")
      .datum(
        topojson.mesh(us, us.objects.states, function (a, b) {
              return a !== b;}))
      .attr("class", "states")
      .attr("d", path);

}