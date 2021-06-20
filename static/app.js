function newUnpack(rows, index) {
  var newObject = {}
  rows.forEach(function (row) {
    var id = row["id"];
    var value = row[index];
    newObject[id] = value;
  });
  return newObject;
}

var url = "./data/samples.json"

d3.json(url).then(function (data) {

  var metaData = data.metadata;
  var ids = metaData.map(d => d.id);

  var dropDown = d3.selectAll("#dataset");

  ids.forEach(function (id) {
    var entry = dropDown.append("option");
    entry.text(id);
    entry.attr("value", id);
  })

  // demographic data
  var ethnicity = newUnpack(metaData, "ethnicity");
  ethnicity["stat"] = "ethnicity";

  var gender = newUnpack(metaData, "gender");
  gender["stat"] = "gender";

  var age = newUnpack(metaData, "age");
  age["stat"] = "age";

  var location = newUnpack(metaData, "location");
  location["stat"] = "location";

  var bbtype = newUnpack(metaData, "bbtype");
  bbtype["stat"] = "bbtype";

  var wfreq = newUnpack(metaData, "wfreq");
  wfreq["stat"] = "wfreq";

  attributes = [ethnicity, gender, age, location, bbtype, wfreq];

  // first
  first = 940;

  // demographics table
  var list = d3.select("#list");

  list.selectAll("li")
    .data(attributes)
    .enter()
    .append("li")
    .text(function (d) {
      return `${d.stat}: ${d[first]}`;
    })
    .exit()
    .remove();


  // bar chart variables

  var otuIDs = newUnpack(data.samples, "otu_ids");
  var otuLabels = newUnpack(data.samples, "otu_labels");
  var sampleValues = newUnpack(data.samples, "sample_values");

  var barHeights = sampleValues[first].slice(0, 10);
  var otuNames = otuIDs[first].slice(0, 10);
  var barTicks = otuNames.map(d => `OTU ${d}`);
  var barHover = otuLabels[first].slice(0, 10);
  var yAxis = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];


  var trace1 = {
    x: barHeights,
    y: yAxis,
    type: "bar",
    orientation: "h",
    text: barHover
  };

  var layout1 = {
    title: 'Top Microbes',
    yaxis: {
      tickvals: yAxis,
      ticktext: barTicks
    },
    xaxis: {
      title: {
        text: 'Sample Numbers',
      }
    }
  };

  Plotly.newPlot("bar", [trace1], layout1);

  // bubble chart variables

  var maxMarker = 50;
  var size = sampleValues[first];
  var sizeRef = 2.0 * Math.max(...size) / (maxMarker ** 2);

  var color = otuIDs[first].map(x => `rgb(${x / 17},0,${255 - x / 17})`);

  var trace2 = {
    x: otuIDs[first],
    y: sampleValues[first],
    text: otuLabels[first],
    mode: 'markers',
    marker: {
      size: size,
      sizeref: sizeRef,
      sizemode: 'area',
      color: color
    },
  };

  var layout2 = {
    title: 'Prevalence of Microbe',
    xaxis: {
      title: {
        text: 'OTU ID',
      }
    },
    yaxis: {
      title: {
        text: 'Sample Number',
      }
    }
  };

  Plotly.newPlot("bubble", [trace2], layout2);

// handle selection changes in dropdown selector

function dropdownChange() {

  var selection = dropDown.property("value");

  //update the demographic data

  demoList.selectAll("li")
  .text(function(d) {
  return `${d.stat}: ${d[selection]}`;
  });

  //update the bar chart

  barHeights = sampleValues[selection].slice(0,10);
  otuNames = otuIDs[selection].slice(0,10);
  barTicks = otuNames.map(d=>`OTU ${d}`);
  barHover = otuLabels[selection].slice(0,10);

  Plotly.restyle("bar", "x", [barHeights]);
  Plotly.restyle("bar", "text", [barHover]);

  var newBarLayout = {
    'yaxis.tickvals': yAxis,
    'yaxis.ticktext': barTicks // the ticktext didn't like not having tickvals also passed in
  };

  Plotly.relayout("bar", newBarLayout);
  
}

//event watcher:
dropDown.on("change", dropdownChange);

});