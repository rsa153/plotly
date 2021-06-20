function newUnpack(rows, index) {
  var newObject = {}
  rows.forEach(function(row){
    var id = row["id"];
    var value =  row[index];
    newObject[id]=value;
  });
  return newObject;
}

var url = "./data/samples.json"


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

first = 940; 

// demographics table

// bar chart

// bubble chart