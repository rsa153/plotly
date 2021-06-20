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

  var barHeights = sampleValues[starter].slice(0,10);
  var otuNames = otuIDs[starter].slice(0,10);
  var barTicks = otuNames.map(d=>`OTU ${d}`);
  var barHover = otuLabels[starter].slice(0,10);
  var yAxis = [9,8,7,6,5,4,3,2,1,0];


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