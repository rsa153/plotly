function newUnpack(rows, index) {
    var newObject = {}
    rows.forEach(function(row){
      var id = row["id"];
      var value =  row[index];
      newObject[id]=value;
    });
    return newObject;
    
    console.log(newObject)
  }