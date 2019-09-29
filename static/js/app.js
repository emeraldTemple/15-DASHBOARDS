function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }
  

//get data
var tData = "data/samples.json";
d3.json(tData).then(function(data) {
  var particpantNames = data.names;
 //console.log(particpantNames);
 particpantNames.forEach(function(name){
  newOpt = d3.select("#selDataset").append("option").text(name);
  });
});

//event handler to change dataset and all (3) plots
function optionChanged(val) {
  d3.json(tData).then(function(data) {
    var particpantNames = data.names;
    var participantIndex = particpantNames.indexOf(val);
    //alert(participant);
    var participant = data.samples[participantIndex];
    //console.log(data.samples[participantIndex])
    var sampleValues = data.samples[participantIndex].sample_values;
    var otu_ids = data.samples[participantIndex].otu_ids;
    var otu_labels = data.samples[participantIndex].otu_labels;
    var demographics = data.metadata[participantIndex];
    var demoWindow = d3.select("#sample-metadata");
    var washFrequency = 0;
    //Clear demographics div; for each attribute in the object selected, print key and value; append to the div
    demoWindow.selectAll("*").remove();
    for (const [key, value] of Object.entries(demographics)) {
      console.log(`${key}: ${value}`);
      enterData = demoWindow.append("p").text(`${key}: ${value}`)
      enterData.style("font-size", "9px");
        if (key == "wfreq") {
            washFrequency = value;
        }
    }
    
    //build gauge
    var gaugeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: washFrequency,
    title: { text: "Bathing Frequency" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 6 },
    gauge: {
      axis: { range: [null, 9] },
      steps: [
        { range: [0, 250], color: "lightgray" },
        { range: [250, 400], color: "gray" }
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 8
      }
    }
  }
];

var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

    // trace bar graph
    var trace1 = {
      type: 'bar',
      x: sampleValues,
      y: otu_labels,
      orientation: 'h'
    };
    
    var data = [trace1];

    var layout = {
      title: `Bellybutton Biodiversity`
    };
    // trace bubble plot
    var trace2 = {
      x: otu_ids,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otu_ids
      }
    }

    var data2 =[trace2];

    var layout2 = {
      title: 'Bacterial Samples',
      showlegend: false
    }
    //plot all
    Plotly.newPlot("bar", data, layout);
    Plotly.newPlot("bubble", data2, layout2);
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  })

    

    
}