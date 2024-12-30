const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"; 

const req = new XMLHttpRequest();

const width = 600;
const height = 800;
const padding = 50; 
let data;
let values = [];
let heightScale;


let xScale;
let xAxisScale;

let yScale;
let yAxisScale;

const svg = d3.select("svg");

const setSize = () => {
    svg.attr("width", width);
    svg.attr("height", height);
}

const setScales = () => {

    heightScale = d3.scaleLinear()
    .domain([0, d3.max(values, (item) => {return item[1]})])
    .range([0, (height-(padding*2))])

    xScale = d3.scaleLinear()
    .domain([0, values.length-1])
    .range([padding, width-padding])

    const dateArr = values.map((item) => {return new Date(item[0])})

    xAxisScale = d3.scaleTime()
    .domain([d3.min(dateArr), d3.max(dateArr)])
    .range([padding, width-padding])

    yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(values, (item) => {return item[1]})])
    .range([height-padding, padding])

}



const setBars = () => {

 
    const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "auto")

    svg.selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - (padding*2)) / values.length)
    .attr("data-date", (item) => {return item[0]})
    .attr("data-gdp", (item) => {return item[1]})
    .attr("height", (item) => {return heightScale(item[1])})
    .attr("x", (item, index) => {return xScale(index)})
    .attr("y", (item) => {return (height-padding) - heightScale(item[1])})
    .on("mouseover", (event, item) => {
        tooltip.transition()
        .style("visibility", "visible")

        tooltip.text(item[0])
      ;

        document.querySelector('#tooltip')
        .setAttribute('data-date', item[0])
     //   console.log(values[][0])
    })
    .on("mouseout", (event, item) => {
        
        tooltip.transition()
    .style("visibility", "hidden")})

 

   
  
/*
 .on('mouseout', (event, item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        }) 
*/
}


const setAxes = () => {
    const xAxis = d3.axisBottom(xAxisScale);

    svg.append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height-padding) + ")")

    const yAxis = d3.axisLeft(yAxisScale);

    svg.append("g").call(yAxis).attr("id", "y-axis").attr("transform", "translate(" + padding + ")")

}

req.open("GET", url, true);
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(values);
    setSize();
    setScales();
    setBars();
    setAxes();
}
req.send();