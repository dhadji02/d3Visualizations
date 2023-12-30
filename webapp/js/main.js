//Getting the genre selected for the Key Chart
d3.select("#keySelect").on("change", function (d) {
  // recover the option that has been chosen
  var selectedOption = d3.select(this).property("value");
  document.getElementById("key_chart").innerHTML = "";
  keyChart(selectedOption);
});

//Getting the genre selected for the Genre popularity per Month/Day Charts
d3.select("#genreSelect").on("change", function (d) {
  // recover the option that has been chosen
  var selectedOption = d3.select(this).property("value");
  document.getElementById("genre_month").innerHTML = "";
  if (document.getElementById("genre_day").innerHTML != ""){
    document.getElementById("genre_day").innerHTML = "";
    document.getElementById("my_dataviz").innerHTML = "";
  }
  graphMD(selectedOption);
});

function chkcontrol(j) {
  var sum =0;
  var checked=[];
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for (var checkbox of checkboxes) {
      if (sum<3){
        checked.push(checkbox.value);
        sum++;
      }
      else {
        checkbox.checked=false;
        alert("Please select up to 3 genres!")
      }
    }
    genreChart(checked);
  }

function returnGenre(value){
  if (value=== "ballad")
    return "Ballad";
  else if (value=== "country")
    return "Country";
  else if (value=== "dance pop")
    return "Dance Pop";
  else if (value=== "edm")
    return "Electronic Dance Music";
  else if (value=== "indie")
    return "Indie";
  else if (value=== "Jazz")
    return "Jazz";
  else if (value=== "Punk Rock")
    return "Punk Rock";
  else if (value=== "rock")
    return "Rock";
  else if (value=== "rb")
    return "R&B";
  else if (value=== "rap")
    return "Rap";
}

function returnGenre1(value){
  if (value === '0')
    return "Ballad";
  else if (value=== '1')
    return "Country";
  else if (value=== '2')
    return "Dance Pop";
  else if (value=== '3')
    return "Electronic Dance Music";
  else if (value=== '4')
    return "Indie";
  else if (value=== '5')
    return "Jazz";
  else if (value=== '6')
    return "Punk Rock";
  else if (value=== '9')
    return "Rock";
  else if (value=== '8')
    return "R&B";
  else if (value=== '7')
    return "Rap";
}

//Function that creates the Genre popularity per day/month charts
function graphMD(genre) {
  //Month Chart
  var popular = [];
  d3.json("data\\music_data.json").then(function (data) {
    data.forEach((element) => {
      var dateFormat = new Date(element.release_date);
      if (element.genre === genre)
        popular.push({
          popularity: element.popularity,
          month: dateFormat.getMonth() + 1,
          day: dateFormat.getDay()
        });
    });
    var final = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //Calculation of the sum of the popularity per month
    for (var l = 0; l < popular.length; l++) {
      for (var p = 0; p < 12; p++) {
        if (popular[l].month == p + 1) {
          counts[p]++;
          final[p] += popular[l].popularity;
        }
      }
    }
    //Calculation of the mean popularity
    for (var p = 0; p < 12; p++) {
      var add = final[p] / counts[p];
        if (!isNaN(add))
        final[p] =  add;
        else
        final[p]=0;
    }

    var dataset = final; //assign the dataset

    // Calculate Margins and canvas dimensions
    var margin = { top: 40, right: 40, bottom: 40, left: 60 },
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Scales
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var line = d3
      .line()
      .x(function (d, i) {
        return x(i);
      })
      .y(function (d, i) {
        return y(dataset[i]);
      });

    var svg = d3
      .select("#genre_month")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Arguments for axes : Ranges for X, y
    x.domain([0, 11]);
    y.domain([0, 100]);

    var tickLabels = ["Jan", "Feb", "Mar","Apr", "May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];

    // Axes
    svg
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(function (d, i) {
        return tickLabels[i];
        })
      );

    svg.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y));

    // Labels
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .attr("transform","translate(" + (margin.left - 94) + "," + height / 2 + ")rotate(-90)")
      .text("Popularity");

    svg
      .append("text")
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("transform","translate(" + width / 2 + "," + (height - (margin.bottom - 74)) + ")")
      .text("Month");

    //  Chart Title Month
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(returnGenre(document.getElementById("genreSelect").value) + " popularity per month");

    // Data Lines append 
    svg.append("path").datum(dataset).attr("class", "line").attr("d", line);

    //Day Chart + specific month selected
    d3.selectAll(".tick").on("click", function (d) {
      
  document.getElementById("genre_day").innerHTML = "";
  document.getElementById("my_dataviz").innerHTML = "";
      // set the dimensions and margins of the graph
  var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 450 - margin.left - margin.right,
  height = 100 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

// Labels of row and columns
const myGroups = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const myVars = ["%"];

// Build X scales and axis:
var x = d3.scaleBand()
.range([ 0, width ])
.domain(myGroups)
.padding(0.01);
svg.append("g")
.attr("transform", `translate(0, ${height})`)
.call(d3.axisBottom(x))
// Build X scales and axis:
var y = d3.scaleBand()
.range([ height, 0 ])
.domain(myVars)
.padding(0.01);
svg.append("g")
.call(d3.axisLeft(y));

// Build color scale
const myColor = d3.scaleLinear()
.range(["#CAFFE1", "#175132"])
.domain([1,100])

//Day Chart + specific month selected
    var m = d.target.innerHTML;
    //Checking the month selected
    var monthSel;
    if (d.target.innerHTML === "Jan") monthSel = 1;
    else if (d.target.innerHTML === "Feb") monthSel = 2;
    else if (d.target.innerHTML === "Mar") monthSel = 3;
    else if (d.target.innerHTML === "Apr") monthSel = 4;
    else if (d.target.innerHTML === "May") monthSel = 5;
    else if (d.target.innerHTML === "Jun") monthSel = 6;
    else if (d.target.innerHTML === "Jul") monthSel = 7;
    else if (d.target.innerHTML === "Aug") monthSel = 8;
    else if (d.target.innerHTML === "Sep") monthSel = 9;
    else if (d.target.innerHTML === "Oct") monthSel = 10;
    else if (d.target.innerHTML === "Nov") monthSel = 11;
    else if (d.target.innerHTML === "Dec") monthSel = 12;
   
    var finalD = [0, 0, 0, 0, 0, 0, 0], countsD = [0, 0, 0, 0, 0, 0, 0];
    //Calculating the sum for the popularity per day
    for (var l = 0; l < popular.length; l++) {
      if (popular[l].month === monthSel) {
        for (var p = 0; p < 7; p++) {
          if (popular[l].day === p) {
            countsD[p]++;
            finalD[p] += popular[l].popularity;
          }
        }
      }
    }
    //Final Calculation of the mean
    for (var p = 0; p < 7; p++) {
      var add = finalD[p] / countsD[p];
      if (!isNaN(add))
        finalD[p] = add;
      else
        finalD[p]=0;
    }
    data = finalD; //assign the dataset

  svg.selectAll()
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return x(myGroups[i]);
    })
    .attr("y", function (d, i) {
      return y(i);
    })
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth() )
    .style("fill", function(d,i) { return myColor(data[i])} )
      
      var m = d.target.innerHTML;
      //Checking the month selected
      var monthSel;
      if (d.target.innerHTML === "Jan") monthSel = 1;
      else if (d.target.innerHTML === "Feb") monthSel = 2;
      else if (d.target.innerHTML === "Mar") monthSel = 3;
      else if (d.target.innerHTML === "Apr") monthSel = 4;
      else if (d.target.innerHTML === "May") monthSel = 5;
      else if (d.target.innerHTML === "Jun") monthSel = 6;
      else if (d.target.innerHTML === "Jul") monthSel = 7;
      else if (d.target.innerHTML === "Aug") monthSel = 8;
      else if (d.target.innerHTML === "Sep") monthSel = 9;
      else if (d.target.innerHTML === "Oct") monthSel = 10;
      else if (d.target.innerHTML === "Nov") monthSel = 11;
      else if (d.target.innerHTML === "Dec") monthSel = 12;
     
      var finalD = [0, 0, 0, 0, 0, 0, 0], countsD = [0, 0, 0, 0, 0, 0, 0];
      //Calculating the sum for the popularity per day
      for (var l = 0; l < popular.length; l++) {
        if (popular[l].month === monthSel) {
          for (var p = 0; p < 7; p++) {
            if (popular[l].day === p) {
              countsD[p]++;
              finalD[p] += popular[l].popularity;
            }
          }
        }
      }
      //Final Calculation of the mean
      for (var p = 0; p < 7; p++) {
        var add = finalD[p] / countsD[p];
        if (!isNaN(add))
          finalD[p] = add;
        else
          finalD[p]=0;
      }
      dataset = finalD; //assign the dataset

    

      // Calculate Margins and canvas dimensions
      margin = { top: 40, right: 40, bottom: 40, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // Scales
      x = d3.scaleLinear().range([0, width]);
      y = d3.scaleLinear().range([height, 0]);
      var line = d3.line()
        .x(function (d, i) {
          return x(i);
        })
        .y(function (d, i) {
          return y(dataset[i]);
        });

      svg = d3
        .select("#genre_day")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Arguments for axes : Ranges for X, y
      x.domain([0, 6]);
      y.domain([0, 100]);

      var tickLabels1 = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

      // Axes
      svg
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(7).tickFormat(function (d, i) {
            return tickLabels1[i];
          })
        );

      svg.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y));

      // Labels
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("transform","translate(" + (margin.left - 94) + "," + height / 2 + ")rotate(-90)")
        .text("Popularity");

      svg
        .append("text")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("transform","translate(" + width / 2 + "," + (height - (margin.bottom - 74)) + ")")
        .text("Day");

      //  Chart Title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 20 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(returnGenre(document.getElementById("genreSelect").value) + " popularity per Day for " + m);

      // Data Lines append
      svg.append("path").datum(dataset).attr("class", "line").attr("d", line);
    });
  });
}

function keyChart(genreU) {
  //Popularity (100 first songs of the selected genre)
  var popular = [];
  d3.json("data\\music_data.json").then(function (data) {
    data.forEach((element) => {
      if (genreU === element.genre)
        popular.push({ popularity: element.popularity, key: element.key });
    });
    popular.sort((p1, p2) =>
      p1.popularity < p2.popularity ? 1 : p1.popularity > p2.popularity ? -1 : 0
    );
    const top100 = popular.slice(0, 100);

    var final = [];
    top100.forEach((element) => {
      final.push(element.key);
    });

    var keys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < data.length; i++) {
      for (var f = 0; f < 12; f++) if (final[i] === f) 
        keys[f]++;
    }

    data = final;
    min = d3.min(data);
    max = d3.max(data) + 1;
    domain = [min, max];
    var margin = { top: 30, right: 30, bottom: 30, left: 50 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    Nbin = 12;
    var x = d3.scaleLinear().domain(domain).range([0, width]);
    var histogram = d3
      .histogram()
      .domain(x.domain()) // then the domain of the graphic
      .thresholds(x.ticks(Nbin)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);
    // Add the svg element to the body and set the dimensions and margins of the graph
    var svg = d3
      .select("#key_chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g").attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
        .tickFormat((d, i) => ["A","A#/B♭","B","C","C#/D♭","D","D#/E♭","E","F","F#/G♭","G","G#/A♭"][i]))
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", "1.5em");

    var y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(bins, function (d) {
          return d.length;
        }),
      ]);

    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#198754");

    svg
      .selectAll(".label")
      .data(keys)
      .enter()
      .append("text")
      .text(function (d,i) {
        return keys[i]})
      .attr("x", function(d, i) {
        return i * (width / keys.length) + ((width / keys.length)/4);
      })
      .attr("y", function(d) {
        return height - 10;
      });
  });
}

function genreChart(present) {
  document.getElementById("genre_popul").innerHTML = "";
  document.getElementById("c1").innerText= "";
  document.getElementById("c2").innerText= "";
  document.getElementById("c3").innerText= "";
  // Create one dimensional array
  var gfg = new Array(94), counts = new Array(94), popular = [];

  // Loop to create 2D array using 1D array
  for (var i = 0; i < 94; i++) {
    gfg[i] = new Array(10);
    counts[i] = new Array(10);
  }

  for (var i = 0; i < 94; i++) {
    for (var j = 0; j < 10; j++) {
      gfg[i][j] = 0;
      counts[i][j] = 0;
    }
  }

  d3.json("data\\music_data.json").then(function (data) {
    data.forEach((element) => {
      var dateFormat = new Date(element.release_date), temp;
      const year = dateFormat.getFullYear();
      if (element.genre === "ballad") 
        temp=0;
      else if (element.genre === "country")
        temp=1;
      else if (element.genre === "dance pop")
        temp=2;
      else if (element.genre === "edm")
        temp=3;
      else if (element.genre === "indie")
        temp=4;
      else if (element.genre === "Jazz")
        temp=5;
      else if (element.genre === "Punk Rock")
        temp=6;
      else if (element.genre === "rap")
        temp=7;
      else if (element.genre === "rb")
        temp=8;
      else if (element.genre === "rock")
        temp=9;
      if (element.genre!="opm ost")
        popular.push({ popularity: element.popularity, genre: temp, year: year });
    });
    for (var l = 0; l < popular.length; l++) {
      counts[popular[l].year-1929][popular[l].genre] +=1;
      gfg[popular[l].year-1929][popular[l].genre] += popular[l].popularity;
    }

    for (var i = 0; i < 94; i++)
      for (var j = 0; j < 10; j++) {
        var add = gfg[i][j] / counts[i][j];
        if (!isNaN(add))
          gfg[i][j] = add;
        else
          gfg[i][j]=0;
      }
    
      var dataset = gfg; //assign the dataset

      // Calculate Margins and canvas dimensions
      var margin = { top: 40, right: 40, bottom: 40, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // Scales
      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      var svg = d3
        .select("#genre_popul")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Arguments for axes : Ranges for X, y
      x.domain([0, 93]);
      y.domain([0, 100]);
      
      var color;

      for (var f=0;f<present.length;f++){
        if (f===0){
          color="#FCC820";
          document.getElementById("c1").style.color="#FCC820";
          document.getElementById("c1").innerText= returnGenre1(present[f]);
        }
        else if (f===1){
          color= "#198754";
          document.getElementById("c2").style.color="#198754";
          document.getElementById("c2").innerText=returnGenre1(present[f]);
        }
        else {
          color = "#4682b4";
          document.getElementById("c3").style.color="#4682b4";
          document.getElementById("c3").innerText=returnGenre1(present[f]);
        }
      
       var line = d3.line()
        .x(function (d, i) {
          return x(i);
        })
        .y(function (d, i) {
          return y(dataset[i][present[f]]);
        });
      
      // Data Lines append
      svg.append("path").datum(dataset).attr("class", "line").attr("d", line).style("stroke", color);
      }

      var tickLabels1 = ["1930","1940","1950","1960","1970","1980","1990","2000","2010","2020"];
      // Axes
      svg
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10).tickFormat(function (d, i) {
            return tickLabels1[i];
          })
        );
  
      svg.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y));
    
      // Labels 

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("transform","translate(" + (margin.left - 94) + "," + height / 2 + ")rotate(-90)")
        .text("Popularity");

      svg
        .append("text")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("transform","translate(" + width / 2 + "," + (height - (margin.bottom - 74)) + ")")
        .text("Year");

      //  Chart Title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 20 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Genre popularity per year");

  });
}
