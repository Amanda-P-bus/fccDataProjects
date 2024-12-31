document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the URL
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => {
        const dataset = data.monthlyVariance; 
        console.log(dataset[1]);
        
        const width = 1200;
        const height = 400;
        const padding = 60;

        const svg = d3.select("#mapcontainer")
          .append("svg")
          .attr("width", width)
          .attr("height", height);
       

        //dataset[item].year
        //dataset[item].month
        //dataset[item].variance

        // dataset.forEach((d) => {let dataYear = d.year; let dataMonth = d.month; let dataVar = d.variance;console.log(d.year)})
    
    
    
    });
    });

