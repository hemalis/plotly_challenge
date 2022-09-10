function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key.toUpperCase()}:`);
      PANEL.append("h6").text(`${value}`)
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let filteredSample = samples.filter(s => s.id === sample)

    //  5. Create a variable that holds the first sample in the array.
    let fs = filteredSample
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otu_ids = fs.map(s => s.otu_ids)
    otu_labels = fs.map(s => s.otu_labels)
    sample_values = fs.map(s => s.sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // var yticks = 
    var yticks = {
      x: sample_values[0].slice(0, 10).reverse(),
      y: otu_ids[0].slice(0, 10).map(v => "OTU "+v.toString()).reverse(),
      text: otu_labels[0].slice(0, 10).reverse(),
      name: "Bacteria",
      type: "bar",
      orientation: "h"
    };
    
    // 8. Create the trace for the bar chart. 
    var barData = [
      yticks
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      width: 500, 
      height: 450, 
      paper_bgcolor: 'rgb(248,248,255)',
      plot_bgcolor: 'rgb(248,248,255)',
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: otu_ids[0],
      y: sample_values[0],
      text: otu_labels[0],
      mode: 'markers',
      marker: {
        size: sample_values[0],
        color: otu_ids[0],
        colorscale: 'Earth'
      },
    };

    var bubbleData = [
      bubbleTrace
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: { 'title': "OTU ID"},
      height: 600,
      width: 1185,
      paper_bgcolor: 'rgb(248,248,255)',
      plot_bgcolor: 'rgb(248,248,255)',
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(s => s.id == sample);
    var result = resultArray[0];

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: result.wfreq,
        title: { text: '<b>Belly Button Washing Frequency</b><br>Scrubs per week' },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 380 },
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 490, 
      height: 450, 
      margin: { t: 0, b: 0 },
      paper_bgcolor: 'rgb(248,248,255)',
      plot_bgcolor: 'rgb(248,248,255)',
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

