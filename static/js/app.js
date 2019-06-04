function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/"+sample;
  d3.json(url).then(function(response) {
    console.log(response);
    var results = [response];


    // Select the input value from the form
    var input =  d3.select("#selDataset").node().value;
    //console.log(input);

    // clear the input value
    //d3.select("#selDataset").node().value = "";
    // Use d3 to select the panel with id of `#sample-metadata`
    var table = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    table.html("")
    

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    results.forEach(function(belly) {
    //  var row = table.append("tr");
      Object.entries(belly).forEach(function([key, value]) {
        var row = table.append("tr");
        var cell = row.append("td");
       cell.text(key+": "+value);
      });
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var charturl = "/samples/"+sample;
  d3.json(charturl).then(function(chartdata) {
    var chartdata = [chartdata];
    // Unpack json to lists
    var otu_ids = chartdata[0].otu_ids; 
    var sample_values = chartdata[0].sample_values;
    var otu_labels = chartdata[0].otu_labels;

    // Create a list of objects for each otu_id
    result = [];
    result = otu_ids.map((d, i) => {
      return {otu_id: d, sample_value: sample_values[i], otu_label: otu_labels[i]}
    });

    // Sort data by sample_values and slice top 10 values
    result.sort((a, b) => b.sample_value-a.sample_value);
    result = result.slice(0,10);
    
    console.log(result[0].sample_value)
    
    
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: [result[0].otu_id,
      result[1].otu_id,
      result[2].otu_id,
      result[3].otu_id,
      result[4].otu_id,
      result[5].otu_id,
      result[6].otu_id,
      result[7].otu_id,
      result[8].otu_id,
      result[9].otu_id],
      y: [result[0].sample_value,
      result[1].sample_value,
      result[2].sample_value,
      result[3].sample_value,
      result[4].sample_value,
      result[5].sample_value,
      result[6].sample_value,
      result[7].sample_value,
      result[8].sample_value,
      result[9].sample_value],
      text: [result[0].otu_label,
      result[1].otu_label,
      result[2].otu_label,
      result[3].otu_label,
      result[4].otu_label,
      result[5].otu_label,
      result[6].otu_label,
      result[7].otu_label,
      result[8].otu_label,
      result[9].otu_label],
      mode: 'markers',
      marker: {
        color: [result[0].otu_id,
        result[1].otu_id,
        result[2].otu_id,
        result[3].otu_id,
        result[4].otu_id,
        result[5].otu_id,
        result[6].otu_id,
        result[7].otu_id,
        result[8].otu_id,
        result[9].otu_id],
        size: [result[0].sample_value,
        result[1].sample_value,
        result[2].sample_value,
        result[3].sample_value,
        result[4].sample_value,
        result[5].sample_value,
        result[6].sample_value,
        result[7].sample_value,
        result[8].sample_value,
        result[9].sample_value]
      }
    };
    
    var bubbledata = [trace1];
    
    var layout = {
      title: 'Belly Button Data',
      xaxis: { title: "OTU IDS"},
      showlegend: false,
      height: 600,
      width: 600
    };
    
    Plotly.newPlot('bubble', bubbledata, layout);
    // @TODO: Build a Pie Chart
    var piedata = [{
      values: [result[0].sample_value,
      result[1].sample_value,
      result[2].sample_value,
      result[3].sample_value,
      result[4].sample_value,
      result[5].sample_value,
      result[6].sample_value,
      result[7].sample_value,
      result[8].sample_value,
      result[9].sample_value],
      labels: [result[0].otu_id,
      result[1].otu_id,
      result[2].otu_id,
      result[3].otu_id,
      result[4].otu_id,
      result[5].otu_id,
      result[6].otu_id,
      result[7].otu_id,
      result[8].otu_id,
      result[9].otu_id],
      type: "pie"
    }];
  
    var layout = {
      height: 600,
      width: 800
    };
  
    Plotly.plot("pie", piedata, layout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
