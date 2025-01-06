document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the URL
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        const dataset = data.monthlyVariance;
    //-------------------------     
        console.log(dataset[1]);
        
        const width = 800;
        const height = 400;
        const padding = 60;


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
       
        const xScale = d3.scaleLinear()
            .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)])
            .range([padding, width-padding])

        const yScale = d3.scaleBand()
        // months
        .domain(d3.range(1, 13))
        .range([padding, (height-padding)])
        .padding(0);

     
        const xAxis = d3.axisBottom()
            .scale(xScale)
            .tickFormat(d3.format("d"));
//--------------------
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d => {
            const date = new Date(0);
            date.setUTCMonth(d-1);
            return d3.timeFormat("%B")(date);
        });
      
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height-padding})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

//--------------
        const colorScale =d3.scaleSequential(d3.interpolateTurbo)
        //d3.scaleOrdinal(d3.schemeTurbo[num]);
        .domain([dataset, d => d.variance])

        const minTemp = d3.min(dataset, d=> d.variance);
        const maxTemp = d3.max(dataset, d => d.variance);

        console.log([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)]);

        console.log(minTemp, maxTemp);

     /*   export default function(t) {
            t = Math.max(0, Math.min(1, t));
            return "rgb("
                + Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))))))) + ", "
                + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))))))) + ", "
                + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66)))))))
                + ")";
          } */

    console.log(d3.interpolateTurbo);
    const legendColors = colorScale.ticks(6).map(colorScale);
    
    const legend = d3.select("#legend");

  
       

    svg.selectAll(".cell")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "cell")
       .attr("x", d => xScale(d.year))
       .attr("y", d => yScale(d.month))
       .attr("width", (width - 2 * padding) / (d3.max(dataset, d => d.year) - d3.min(dataset, d => d.year)))
       .attr("height", yScale.bandwidth())
       .attr("fill", d => colorScale(d.variance))
       .on("mouseover", function (event, d) {
         
          const [x, y] = d3.pointer(event, this);
          
          let toolText = 
            "<span class='date'>" + 
            d3.timeFormat("%B %Y")(new Date(d.year, d.month-1)) + 
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


       /*     
        tooltip.html(
            `${d3.timeFormat("%B")(new Date(d.year, d.month-1))} ${d.year}
            <br />
            Temp: ${d3.format(".1f")(data.baseTemperature + d.variance)}°C
            <br />
            Var: ${d3.format(".1f")(d.variance)}°C
            `);

        tooltip.style('display', 'block')
        .style('left', (x + 10) + 'px')
        .style('top', (y + 10) + 'px');
      d3.select(this).attr('fill', 'lightblue'); */
         
        .on("mouseout", tip.hide);
            
           /* 

           .on("mouseout", function () { 
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", d => colorScale(d.variance));
        });

 const date = new Date(0);
        date.setUTCMonth(dataset.month);
        //console.log(date.setUTCMonth(dataset[1].month));
        //console.log((dataset[1], d => d.year));
        console.log(d3.timeFormat("%B")(date.setUTCMonth(date-1)));
        
        //console.log(dataset.setUTCMonth(dataset[1].month-1), dataset.year, date);
        console.log(xAxis.innerText)

            tooltip.html(`${d3.timeFormat("%B")(new Date(d.year, d.month -1))} ${d.year} 
            <br>
            Temp: ${d3.format(".1f")(data.baseTemperature + d.variance)}°C
            <br>
            Var: ${d3.format(".1f")(d.variance)}°C`);
            
            tooltip.style("display", "block")
            .style("left", (x+10) + "px")
            .style("top", (y+10) + "px");
            
            d3.select(this).attr("fill", "lightblue"); */
     


      

        /*
        COLOR HELP
        d3.select('#wrapper')
	.selectAll('circle')
	.data(myData)
	.join('circle')
	.attr('r', 10)
	.attr('cx', function(d) {
		return linearScale(d);
	})
	.style('fill', function(d) {
		return sequentialScale(d);
	}); */


        //dataset[item].year
        //dataset[item].month
        //dataset[item].variance

        // dataset.forEach((d) => {let dataYear = d.year; let dataMonth = d.month; let dataVar = d.variance;console.log(d.year)})
    
    
    
    });
    });

