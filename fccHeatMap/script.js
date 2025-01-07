//const colorArr = [(rgb(89, 19, 202)), (rgb(0, 200, 255)), (rgb(77, 248, 132)), (rgb(149, 251, 81)), (rgb(222, 221, 50)), (rgb(237, 153, 35)), (rgb(246, 95, 24)), (rgb(224, 54, 125)), (rgb(201, 35, 20))];

var colorbrewer = {
    RdYlBu: {
      3: ['#fc8d59', '#ffffbf', '#91bfdb'],
      4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
      5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
      6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
      7: [
        '#d73027',
        '#fc8d59',
        '#fee090',
        '#ffffbf',
        '#e0f3f8',
        '#91bfdb',
        '#4575b4'
      ],
      8: [
        '#d73027',
        '#f46d43',
        '#fdae61',
        '#fee090',
        '#e0f3f8',
        '#abd9e9',
        '#74add1',
        '#4575b4'
      ],
      9: [
        '#d73027',
        '#f46d43',
        '#fdae61',
        '#fee090',
        '#ffffbf',
        '#e0f3f8',
        '#abd9e9',
        '#74add1',
        '#4575b4'
      ],
      10: [
        '#a50026',
        '#d73027',
        '#f46d43',
        '#fdae61',
        '#fee090',
        '#e0f3f8',
        '#abd9e9',
        '#74add1',
        '#4575b4',
        '#313695'
      ],
      11: [
        '#a50026',
        '#d73027',
        '#f46d43',
        '#fdae61',
        '#fee090',
        '#ffffbf',
        '#e0f3f8',
        '#abd9e9',
        '#74add1',
        '#4575b4',
        '#313695'
      ]
    }
  };

document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the URL
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        const dataset = data.monthlyVariance;

    function callback(data) {console.log("data", data)}

    data.monthlyVariance.forEach(function (val) {val.month-=1})
        console.log(dataset[1]);
        
        const width = 800;
 
        const height = 35*12;
        const padding = 70;



        const tip = d3
        .tip()
        .attr("class", "d3-tip")
        .attr("id", "tooltip")
        .html(function (d) {
          return d;
        })
        .direction('n')
        .offset([-10, 0]);

  
        const svg = d3.select("#mapContainer")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .call(tip)
       
    // is this the problem??
        const xScale = d3.scaleLinear()
            .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)])
            .range([padding, width-padding])


        const xAxis = d3.axisBottom()
            .scale(xScale)
            .tickValues(d3.range(xScale.domain()[0]+7, xScale.domain()[1], 10))
            .tickFormat(d3.format("d"))
            .tickSize(10, 1)
//--------------------

        const yScale = d3.scaleBand()
            // months
            .domain([0,1,2,3,4,5,6,7,8,9,10,11])
            .range([padding-40, (height-padding)])
            .padding(0);

            console.log(dataset[1].month)

        const yAxis = d3.axisLeft()
            .scale(yScale)
            .tickValues(yScale.domain())
            .tickFormat(d => {
            const date = new Date(0);
            date.setUTCMonth(d+1);
            return d3.timeFormat("%B")(date);})
            .tickSize(10,1);
      
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height-padding})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);


    
    let legendColors = colorbrewer.RdYlBu[11].reverse();
    const legendWidth = 400;
    const legendHeight = (200/legendColors.length);
    
    let variance = data.monthlyVariance.map(d => d.variance);
    const minTemp = data.baseTemperature + Math.min.apply(null, variance);
    const maxTemp = data.baseTemperature + Math.max.apply(null, variance);

  

    var legendThreshold = d3
    .scaleThreshold()
    .domain(
      (function (min, max, count) {
        var array = [];
        var step = (max - min) / count;
        var base = min;
        for (var i = 1; i < count; i++) {
          array.push(base + i * step);
        }
        return array;
      })(minTemp, maxTemp, legendColors.length)
    )
    .range(legendColors);

  var legendX = d3
    .scaleLinear()
    .domain([minTemp, maxTemp])
    .range([0, legendWidth]);

  var legendXAxis = d3
    .axisBottom()
    .scale(legendX)
    .tickSize(10, 0)
    .tickValues(legendThreshold.domain())
    .tickFormat(d3.format('.1f'));

  var legend = svg
    .append('g')
    .classed('legend', true)
    .attr('id', 'legend')
    .attr(
      'transform',
      'translate(0,' +
        (21 * legendHeight) +
        ')'
    );

  legend
    .append('g')
    .selectAll('rect')
    .data(
      legendThreshold.range().map(function (color) {
        var d = legendThreshold.invertExtent(color);
        if (d[0] === null) {
          d[0] = legendX.domain()[0];
        }
        if (d[1] === null) {
          d[1] = legendX.domain()[1];
        }
        return d;
      })
    )
    .enter()
    .append('rect')
    .style('fill', function (d) {
      return legendThreshold(d[0]);
    })
    .attr('x', d => legendX(d[0]))
    .attr('y', 0)
    .attr('width', d =>
      d[0] && d[1] ? legendX(d[1]) - legendX(d[0]) : legendX(null)
    )
    .attr('height', legendHeight);

  legend
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + legendHeight + ')')
    .call(legendXAxis);


    svg.selectAll(".cell")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "cell")
       .attr("data-month", d=> d.month)
       .attr("data-year", d => d.year)
       .attr("data-temp", d => data.baseTemperature + d.variance)
       .attr("x", d => xScale(d.year))
       .attr("y", d => yScale(d.month))
       .attr("width", (width - 2 * padding) / (d3.max(dataset, d => d.year) - d3.min(dataset, d => d.year)))
       .attr("height", yScale.bandwidth())
       .attr("fill", d => legendThreshold(data.baseTemperature + d.variance))
       .on("mouseover", function (event, d) {
         
          const [x, y] = d3.pointer(event, this);
          
          let toolText = 
            "<span class='date'>" + 
            d3.timeFormat("%B %Y")(new Date(d.year, d.month)) + 
            "</span>" +
            "<br />" +
            "<span class='temp'>" +
            d3.format(".1f")(data.baseTemperature + d.variance) + "&#8451;" +
            "</span>" +
            "<br />" +
            "<span class='variance'>" +
            d3.format("+.1f")(d.variance) + 
            "&#8451;" +
            "</span>";

        tip.attr("data-year", d.year);
        tip.show(toolText, this);        })

         
        .on("mouseout", tip.hide);
            
          
    
    
    });
    });

