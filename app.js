function finalassignment(){
    var filePath="ts.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);

    var images = ['https://people.com/thmb/-CFk2SUsPbgYeOcrtvMGO35IWOc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/taylor-swift-albums-1-93026ca98408417097660e117a10a6a9.jpg',
'https://people.com/thmb/Dm39HuJ8gVWk1FRlezyGyifkLkU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/taylor-swift-albums-2-c7e2e4bd213b4c189cd75399622bae6b.jpg',
'https://people.com/thmb/ZxlF1yRFzGVcEf3MD-ROHtak2aE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/taylor-swift-albums-3-5831d0787fb94e94b56b89cd1d203689.jpg',
'https://people.com/thmb/YC7DQECGLdGPQYm1wOJsSJ8pocI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/taylor-swift-albums-4-431520e5189f42ff81a638580d5ac8a2.jpg',
'https://people.com/thmb/2-3jppD1J2TKBN-eDLUzNYfbiDA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/taylor-swift-albums-5-76d90fcaeaa84286a78c344dbeae9209.jpg',
'https://people.com/thmb/bnv58OSnUSsOsnwP_c9f85fBdv0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(992x0:994x2)/taylor-swift7-2000-48f9bfb372c34e36866773b1ede0b372.jpg',
'https://people.com/thmb/kPIp7Wm8qq_myynBtfykBj_5fSc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2)/taylor-swift-lover-2000-e4a62abb38b9483e8d371eda823d2fcb.jpg',
'https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png',
'https://media.newyorker.com/photos/5fd79b014a2e0a2853da7625/2:2/w_1536,h_1536,c_limit/Petrusich-TaylorSwift.jpg',
'https://i.iheart.com/v3/re/new_assets/63502b9eaee0f4b0e56f9a54?ops=contain(1480,0)'];
    var index = 0;

    function change() {
    document.getElementById("mainPhoto").src = images[index];
    if (index == 9) {
        index = 0;
    } else {
        index++;
    }

    setTimeout(change, 4000);
    }

    window.onload = change();
}


var question0=function(filePath){
    var rowConverter = function(d) { 
        return {acousticness: parseFloat(d.acousticness),
        album: d.album,
        danceability: parseFloat(d.danceability),
        duration_ms: parseInt(d.duration_ms),
        duration: parseInt(d.duration_ms) / 60000,
        energy: parseFloat(d.energy),
        id: d.id,
        instrumentalness: parseFloat(d.instrumentalness),
        liveness: parseFloat(d.liveness),
        loudness: parseFloat(d.loudness),
        name: d.name,
        popularity: parseInt(d.popularity),
        release_date: d.release_date,
        speechiness: parseFloat(d.speechiness),
        tempo: parseFloat(d.tempo),
        track_number: parseInt(d.track_number),
        uri: d.uri,
        valence: parseFloat(d.valence)
        }
    }
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 400, bottom: 80, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q1_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    d3.csv(filePath, rowConverter).then(function(dt){
        console.log(dt)
        let albums_list = [
            "Taylor Swift", "Fearless", "Fearless Platinum Edition", 
            "Fearless (Taylor's Version)", "Speak Now", 
            "Speak Now (Deluxe Edition)", "Red", "Red (Deluxe Edition)", 
            "Red (Taylor's Version)", "1989", "1989 (Deluxe Edition)", 
            "reputation", "Lover", "folklore", "folklore (deluxe version)", 
            "evermore", "evermore (deluxe version)", "Midnights", 
            "Midnights (3am Edition)"];

        data1 = d3.filter(dt, function(d){return albums_list.includes(d.album)});
        avg_duration = d3.rollup(dt, v=>(d3.mean(v, d=>d.duration_ms)/60000), d=> d.album);
        avg_pop = d3.rollup(dt, v=>(d3.mean(v, d=>d.popularity)), d=> d.album);


        data = [];
        for (let index = 0; index < albums_list.length; index++) {
            const element = albums_list[index];
            m = {};
            m.album = element;
            m.duration = avg_duration.get(element);
            m.popularity = avg_pop.get(element);
            m.date = data
            data.push(m);
        }

        extX = d3.extent(data, function(d){return d.duration});

        console.log(extX)
        // Add X axis
        var xScale = d3.scaleLinear()
        .domain([extX[0]-0.02, extX[1] + 0.02])
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

        extY = d3.extent(data, function(d){return d.popularity});
        // Add Y axis
        var yScale = d3.scaleLinear()
        .domain([0, extY[1]+10])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(yScale));

        // title
        y_text = -10;
        x_text = width/2 + margin.left
        svg.append("text")
            .attr("x", x_text)
            .attr("y", y_text)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Albums with Song Durations Averaging 4 Minutes are More Popular");
        
        // y axis title
        yax = -40
        svg.append("text")
            .attr("x", margin.left - width/2)
            .attr("y", yax)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(270)")
            .style("font-size", "15px")
            .text("Avg Album Popularity");

        // x axis title
        y_text1 = height + margin.bottom + yax;
        svg.append("text")
            .attr("x", width/2)
            .attr("y", y_text1)
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Avg Song Duration, in Minutes");

        
        // color scale
        var colors = d3.scaleOrdinal()
            .domain(albums_list)
            .range(["#8fce00", "#f1c232", "#dfa700", "#ffc000", "#7f5fd2", "#957bd7", "#f44336", "#bf271c", "#ff1100",
            "#6fa8dc", "#0085ff", "#000000", "#ffb4e2", "#b7afb4", "#747474", "#bc801f", "#a76d0f", "#16537e", "#09358b"
        ]);

        // create a tooltip
        var tooltip = d3.select("#q1_plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var mousemove = function(e, d) {
            tooltip
            .attr("id", "tooltip")
            .html("Album: " + d.album + "<br> Avg Song Duration, in Mins: "+d.duration + "<br> Avg Popularity: "+d.popularity)
            .style('left', e.layerX)
            .style('top', e.layerY)
            .style("position", "absolute")
            .transition()
            .duration(200)
            .style("opacity", 0.9);
        }

        var mouseover = function(e,d) {
            tooltip.style("opacity", 1)
          }

          var mouseleave = function(e, d) {
            tooltip.style("opacity", 0)
            d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)

            console.log("leave")
          }

        svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.duration); } )
        .attr("cy", function (d) { return yScale(d.popularity); } )
        .attr("r", 7)
        .style("fill", function(d){return colors(d.album)})
        .style("stroke", "white")
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

        var legend = d3.legendColor()
            .scale(colors)
            .labels(albums_list);
        svg.append("g")
            .attr("transform", "translate("+(width + margin.left)+","+30+")")
            .call(legend);
    });
}

var question1=function(filePath){
    var rowConverter = function(d) { 
        return {acousticness: parseFloat(d.acousticness),
        album: d.album,
        danceability: parseFloat(d.danceability),
        duration_ms: parseInt(d.duration_ms),
        energy: parseFloat(d.energy),
        id: d.id,
        instrumentalness: parseFloat(d.instrumentalness),
        liveness: parseFloat(d.liveness),
        loudness: parseFloat(d.loudness),
        name: d.name,
        popularity: parseInt(d.popularity),
        release_date: d.release_date,
        speechiness: parseFloat(d.speechiness),
        tempo: parseFloat(d.tempo),
        track_number: parseInt(d.track_number),
        uri: d.uri,
        valence: parseFloat(d.valence)
        }
    }
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 30, bottom: 80, left: 300},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q2_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

    d3.csv(filePath, rowConverter).then(function(data){
        total_duration = d3.rollup(data, v=>(d3.sum(v, d=>d.duration_ms)/60000), d=> d.album);
        console.log();
        sort_dt = d3.sort(total_duration, function(x, y){return d3.ascending(x.value, y.value);})
        sort_dt = sort_dt.slice().sort((a, b) => d3.descending(a[1], b[1]));
      
        data = [];
        for (let index = 0; index < sort_dt.length; index++) {
            const element = sort_dt[index];
            m = {};
            m.album = element[0];
            m.duration = element[1];
            data.push(m);
        }


        let albums_list = data.map(({album}) => album);
        extX = d3.extent(data, function(d){return d.duration});
        // Add Y axis

        var xScale = d3.scaleLinear()
        .domain([0, extX[1]])
        .range([ 0, width]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

        var yScale = d3.scaleBand()
            .domain(d3.range(albums_list.length))
            .range([height, 0])
            .paddingInner(0.1);
        var yScale2 = d3.scaleBand()
            .domain(albums_list)
            .range([height, 0])
            .paddingInner(0.1);

        var axisY = svg.append("g")
            .call(d3.axisLeft(yScale2));

        // title
        y_text = -margin.top + margin.right;
        x_text = width/2
        svg.append("text")
            .attr("x", x_text)
            .attr("y", y_text)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("folklore: the long pond studio sessions is Swift's longest album");
        
        // y axis title
        yax = -margin.left + margin.right
        svg.append("text")
            .attr("x", -height/2)
            .attr("y", yax)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(270)")
            .style("font-size", "15px")
            .text("Album");

        // x axis title
        y_text1 = height + margin.bottom - 40;
        svg.append("text")
            .attr("x", width/2)
            .attr("y", y_text1)
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Duration (minutes)");

        
        // color scale
        var colors = d3.scaleOrdinal()
            .domain(albums_list)
            .range(["#6e40aa","#743fac","#7a3fae","#803eb0","#873eb1","#8d3eb2",
            "#ba3cb0","#c13dae","#c73dac","#cd3daa","#d33ea7","#d83fa4",
            "#de3fa1","#e3409e","#e8429a","#ed4396","#f14592","#f5468e",
            "#f9488a","#fd4a85","#fe4b83","#ff4f7b","#ff625e","#ff645b",
            "#ff6659","#ff6857","#ff6a54","#ff6c52","#ff6e50","#ff7d42",
            "#ff8040","#f4a030","#f2a32f","#f0a52f","#eea82f","#ecaa2e",
            "#e4b52e","#e2b72f","#e0ba2f","#debc30","#dbbf30","#d9c131",
            "#d1cb35","#cece36","#ccd038","#cad239","#c8d53b","#c6d73c",
            "#bee044","#bce247","#bae449",,"#b3eb53","#b1ed56","#b0ef59",
            "#adf05a","#aaf159","#a6f159","#a2f258","#9ef258","#9af357",
            "#8bf457","#87f557","#83f557","#74f65a","#71f65b","#6df65c",
            "#6af75d","#66f75e","#63f75f","#5ff761","#5cf662","#59f664",
            "#4cf56a","#49f56c","#46f46e","#3bf277","#39f279","#37f17c",
            "#34f07e","#27e98f","#25e892","#24e795","#22e597","#21e49a",
            "#20e29d","#1fe19f","#1edfa2","#1ddea4"]);

        

        svg.append('g').selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .on("mouseover", function(event, d){
            // console.log(d);		  		

            d3.select(this)
                .attr("fill", colors(d.album))

        })
        .on("mouseout", function(event,d){
            d3.select(this)
            .transition()
            .duration(80)
                .attr("fill", "black")
        })
        .attr("x", 0)
        .attr("y", function(d, i) { return yScale2(d.album); })
        .attr("width", function(d) { return xScale(d.duration); })
        .attr("height",yScale.bandwidth())
        // .style("fill", function(d){return colors(d.album)});

        var isDescending = false;
        const sortBars = function(){
            svg.selectAll('.bar')
                .sort((a, b) => {
                    return isDescending?d3.descending(a.duration, b.duration):d3.ascending(a.duration, b.duration);
                })
                .transition("sorting")
                .duration(1000)
                .attr('y', (d, i) => {
                    return yScale(i)
                })

                rev = albums_list.reverse();
                yScale2.domain(rev);
                axisY.selectAll("text").remove();
                axisY = svg.append("g")
                    .call(d3.axisLeft(yScale2));

                isDescending = !isDescending;
        }


        // select the "Sort me" button and define the interaction
        d3.select('#sort_button')
            .on('click', function(){
                sortBars();
            }); 
    });
}

var question2=function(filePath){
    var rowConverter = function(d) { 
        return {acousticness: parseFloat(d.acousticness),
        album: d.album,
        danceability: parseFloat(d.danceability),
        duration_ms: parseInt(d.duration_ms),
        energy: parseFloat(d.energy),
        id: d.id,
        instrumentalness: parseFloat(d.instrumentalness),
        liveness: parseFloat(d.liveness),
        loudness: parseFloat(d.loudness),
        name: d.name,
        popularity: parseInt(d.popularity),
        release_date: d.release_date,
        speechiness: parseFloat(d.speechiness),
        tempo: parseFloat(d.tempo),
        track_number: parseInt(d.track_number),
        uri: d.uri,
        valence: parseFloat(d.valence)
        }
    }
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 400, bottom: 80, left: 60},
    width = 1300 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q3_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    
    d3.csv(filePath, rowConverter).then(function(dt1){
        // tempo = d3.rollup(data, v=>(d3.mean(v, d=>d.tempo)), d=> d.album);
        // valence = d3.rollup(data, v=>(d3.mean(v, d=>d.valence)), d=> d.album);
        


        var keys = ["tempo", "valence"];
        var total = [];

        for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            f = d3.rollup(dt1, v=>d3.mean(v, d=>d[element]), d=> d.album);
            total.push(f);
        }

        tp = Array.from(total[0]); // total tempo arr
        vl = Array.from(total[1]); // total valence arr
        let data = [];
        // make new mapping 
        for (let index = 0; index < total[0].size; index++) {
            let alb = tp[index][0];
            let temp = tp[index][1];
            let val = vl[index][1];
            data.push({album: alb, tempo: temp, valence: val});
        }

        let padding = 55;
        let album_arr = data.map(({album}) => album);


        // x axis
        var xScale = d3.scaleBand()
                        .domain(album_arr)
                        .range([0, width])
                        .paddingInner(1);

        let h = height - margin.bottom
        svg.append("g")
            .attr("transform", "translate("+margin.left+"," + h + ")")
            .call(d3.axisBottom(xScale)).selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-35)");

        //define y axis
        let valenceExtent = d3.extent(data, function(d){return d.valence});
        let tempoExtent = d3.extent(data, function(d){return d.tempo});
        
        let maximum_y = d3.max([valenceExtent[1], tempoExtent[1]]);
        let minimum_y = d3.min([valenceExtent[0], tempoExtent[0]]);
        
        // y scale
        let y_pad = -margin.bottom
        var yScale = d3.scaleLinear()
            .domain([0, maximum_y*1.3])
            .range([height, 0 ]);
        svg.append("g")
            .attr("transform", "translate("+margin.left+","+y_pad+")")
            .call(d3.axisLeft(yScale))
            .selectAll("text")  
            .style("text-anchor", "end");

        var colors = d3.scaleOrdinal()
            .domain(keys)
            .range(["#ffc3d7", "blue"]);

        //Stack the data
        var stacked  = d3.stack().keys(keys)(data);
        
        // Generate streamgraph
        var area = d3.area()
            .curve(d3.curveBasis)
            .x(function(d, i) { return xScale(d.data.album); })
            .y0(function(d) { return yScale(d[0]); })
            .y1(function(d) { return yScale(d[1]); });

        svg.selectAll("mylayers")
            .data(stacked)
            .enter()
            .append("path")
            .style("fill", function(d) { console.log(d.key, colors(d.key));return colors(d.key); })
            .attr("d", d3.area()
                .x(function(d, i) { return xScale(d.data.album) + margin.left; })
                .y0(function(d) { return yScale(d[0]) - margin.bottom; })
                .y1(function(d) { return yScale(d[1]) - margin.bottom; })
            )

        // title
        y_text = -margin.top + 20;
        x_text = width/2 + margin.left;
        svg.append("text")
            .attr("x", x_text)
            .attr("y", y_text)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Album Average Tempo and Valence are Correlated");

        // y axis title
        y_text1 = -margin.left/2 + 10;
        x_text1 = -margin.top - margin.bottom
        svg.append("text")
            .attr("x", x_text1)
            .attr("y", y_text1)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(270)")
            .style("font-size", "15px")
            .text("Average Tempo & Valence");

        // x axis title
        y_text2 = height + margin.bottom ;
        x_text2 = width/2 + margin.left
        svg.append("text")
            .attr("x", x_text2)
            .attr("y", y_text2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Album");
        // legend
        // sales gray profit blue
        svg.selectAll("texty")
            .data(stacked)
            .enter().append("circle")
            .attr("cx",650)
            .attr("cy",-25)
            .attr("r", 6)
            .style("fill", function(d) {return colors("tempo"); }) ;
        svg.selectAll("texty")
            .data(stacked)
            .enter().append("circle")
            .attr("cx",650)
            .attr("cy",0)
            .attr("r", 6)
            .style("fill", function(d) {return colors("valence"); });
        svg.append("text").attr("x", 670).attr("y", -25).text("Tempo").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 670).attr("y", 0).text("Valence").style("font-size", "15px").attr("alignment-baseline","middle")


    });



}

var question3=function(filePath){
    var stateSym = {
        AZ: 'Arizona',
        AL: 'Alabama',
        AK: 'Alaska',
        AR: 'Arkansas',
        CA: 'California',
        CO: 'Colorado',
        CT: 'Connecticut',
        DC: 'District of Columbia',
        DE: 'Delaware',
        FL: 'Florida',
        GA: 'Georgia',
        HI: 'Hawaii',
        ID: 'Idaho',
        IL: 'Illinois',
        IN: 'Indiana',
        IA: 'Iowa',
        KS: 'Kansas',
        KY: 'Kentucky',
        LA: 'Louisiana',
        ME: 'Maine',
        MD: 'Maryland',
        MA: 'Massachusetts',
        MI: 'Michigan',
        MN: 'Minnesota',
        MS: 'Mississippi',
        MO: 'Missouri',
        MT: 'Montana',
        NE: 'Nebraska',
        NV: 'Nevada',
        NH: 'New Hampshire',
        NJ: 'New Jersey',
        NM: 'New Mexico',
        NY: 'New York',
        NC: 'North Carolina',
        ND: 'North Dakota',
        OH: 'Ohio',
        OK: 'Oklahoma',
        OR: 'Oregon',
        PA: 'Pennsylvania',
        RI: 'Rhode Island',
        SC: 'South Carolina',
        SD: 'South Dakota',
        TN: 'Tennessee',
        TX: 'Texas',
        UT: 'Utah',
        VT: 'Vermont',
        VA: 'Virginia',
        WA: 'Washington',
        WV: 'West Virginia',
        WI: 'Wisconsin',
        WY: 'Wyoming'

        
    };
    var rowConverter = function(d) { 
        return {acousticness: parseFloat(d.acousticness),
        album: d.album,
        danceability: parseFloat(d.danceability),
        duration_ms: parseInt(d.duration_ms),
        energy: parseFloat(d.energy),
        id: d.id,
        instrumentalness: parseFloat(d.instrumentalness),
        liveness: parseFloat(d.liveness),
        loudness: parseFloat(d.loudness),
        name: d.name,
        popularity: parseInt(d.popularity),
        release_date: d.release_date,
        speechiness: parseFloat(d.speechiness),
        tempo: parseFloat(d.tempo),
        track_number: parseInt(d.track_number),
        uri: d.uri,
        valence: parseFloat(d.valence)
        }
    }
    const projection1  = d3.geoAlbersUsa();
    const pathgeo1 = d3.geoPath().projection(projection1); 
    const mappy = d3.json("us-states.json");

    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 60, bottom: 80, left: 60},
    width = 1300 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg3 = d3.select("#q4_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .attr("transform",
    //     "translate(" + margin.left + "," + margin.top + ")")
    
    var g =svg3.append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    

    // state_arr = ['Arizona','Alabama','Alaska','Arkansas',
    // 'California','Colorado','Connecticut','District of Columbia',
    // 'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois',
    // 'Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine',
    // 'Maryland','Massachusetts','Michigan','Minnesota',
    // 'Mississippi','Missouri','Montana','Nebraska',
    // 'Nevada','New Hampshire','New Jersey','New Mexico',
    // 'New York','North Carolina','North Dakota','Ohio',
    // 'Oklahoma','Oregon','Pennsylvania','Rhode Island',
    // 'South Carolina','South Dakota','Tennessee','Texas','Utah',
    // 'Vermont','Virginia','Washington','West Virginia','Wisconsin',
    // 'Wyoming'];

    // var world = {"United States":43, "England":15, "France":5, "India":1, "Ireland":1, "Iraq":1}
    var locs = {
    "Georgia":["Tim McGraw"], 
    "California":["White Horse", "The Lucky One", "I Bet You Think About Me",
        "The Very First Night", "Gorgeous", "Invisible String", "'Tis The Damn Season", 
        "London Boy"],
    "New York":[
        "All Too Well", "Holy Ground", "The Lucky One", "Come Back...Be Here",
        "Come Back...Be Here", "All Too Well (10 Minute Version)", "Welcome to New York",
        "Delicate", "Delicate", "Cornelia Street", "Cornelia Street", "Cornelia Street", 
        "Cornelia Street", "False God", "False God","Daylight", "Invisible String", "Invisible String",
        "Hoax", "Cardigan","Coney Island","Coney Island", "Maroon", "Maroon"
    ],
    "Tennessee": ["London Boy", "London Boy", "I Think He Knows"],
    "Missouri":["The Last Great American Dynasty"],
    "Rhode Island":["The Last Great American Dynasty","The Last Great American Dynasty",
        "The Last Great American Dynasty"],
    "Mississippi": ["Dorothea", "'Tis The Damn Season"],
    "Pennsylvania": ["Seven"],
    "England":["Come Back… Be Here","Come Back… Be Here","Message In A Bottle",
        "London Boy","London Boy","London Boy","London Boy","London Boy","London Boy",
        "London Boy","London Boy","London Boy", "Invisible String","The Lakes","The Lakes"],
    "France":["The Man", "Paris","Paris","Paris","Paris"],
    "India":["Seven"], 
    "Ireland":["Wicklow"],
    "Iraq":["Cowboy Like Me"], 
    "Asia":["Bigger Than The Whole Sky"]}

    location_list_keys = ["Georgia", "California", "New York", "Tennessee",
     "Missouri", "Rhode Island", "Mississippi", "Pennsylvania", "England", "France", "India", "Ireland",
    "Iraq", "Asia"];

    // title
    y_text = margin.top;
    x_text = width/2 ;
    svg3.append("text")
        .attr("x", x_text)
        .attr("y", y_text)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Swift sings most about New York and California throughout her albums");
    

    maximum = 24;

    var colors = d3.scaleSequential().domain([0,maximum])
                .interpolator(d3.interpolateBlues);
    let linScale = d3.scaleLinear().domain([0, maximum]).range([3, location_list_keys.length]);

    america = mappy.then(function(map){
        g.selectAll("path")
            .data(map.features)
            .enter().append("path")
            .attr("d", pathgeo1)
            .style("stroke", "black")
            .style("fill", function(d){ 
                const state = stateSym[d.properties.name];
                return colors( ((locs[state] || []).length) )});
    });
    var legend = d3.legendColor()
        .scale(colors)
        .labels(["<5", "6-10", "11-15", "16-20", "21-25"]);
    y_tx = height/2 + margin.top + margin.bottom
    paddingx = 30
    paddingy = -10
    svg3.append("g")
        .attr("transform", "translate("+margin.left+","+y_tx+")")
        .call(legend)
        .style("stroke", "black");
    svg3.append("text")
        .attr("x", margin.left + paddingx)
        .attr("y", y_tx +paddingy)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("stroke", "black")
        .text("# of mentions");
    
    svg3.append("text")
        .attr("x", margin.left + paddingx)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("stroke", "black")
        .text("Try zooming in!");
    
    
    var zoom = d3.zoom()
      .scaleExtent([1, 5])
      .translateExtent([[margin.left, margin.top], [width, height]])
      .on('zoom', function(event) {
          g.selectAll('path')
           .attr('transform', event.transform);
    });
    svg3.call(zoom);
}

var question4=function(filePath){
    var rowConverter = function(d) { 
        return {acousticness: parseFloat(d.acousticness),
        album: d.album,
        danceability: parseFloat(d.danceability),
        duration_ms: parseInt(d.duration_ms),
        energy: parseFloat(d.energy),
        id: d.id,
        instrumentalness: parseFloat(d.instrumentalness),
        liveness: parseFloat(d.liveness),
        loudness: parseFloat(d.loudness),
        name: d.name,
        popularity: parseInt(d.popularity),
        release_date: d.release_date,
        speechiness: parseFloat(d.speechiness),
        tempo: parseFloat(d.tempo),
        track_number: parseInt(d.track_number),
        uri: d.uri,
        valence: parseFloat(d.valence)
        }
    }
    d3.csv(filePath, rowConverter).then(function(dt){
        let albums_list = ["Taylor Swift"];
        let albums_list1 = data.map(({album}) => album);

        data1 = d3.filter(dt, function(d){return albums_list.includes(d.album)});


        // add the options to the button
        d3.select("#selectButton")
        .selectAll("dropdown")
        .data(albums_list1)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button


        nodes1 = [];
        let not_empty = 0
        for (let index = 0; index < data1.length; index++) {
            const element = data1[index];
            m = {};
            if (not_empty == 1 && element.track_number == nodes1[0].id){
                m.id = element.track_number;
                m.name = element.name;
                m.valence = element.valence;
                m.popularity = element.popularity;
                nodes1.push(m);
                break;
            } else {
            m.id = element.track_number;
            m.name = element.name;
            m.valence = element.valence;
            m.popularity = element.popularity;
            nodes1.push(m);
            not_empty = 1;
            }
        }

        edges1 = [];
    
        for (let index = 0; index < nodes1.length; index++) {
            for (index2 = 1; index2 < nodes1.length; index2++) {
                if (index != index2){
                    n = {};
                    n.source = nodes1[index];
                    n.target = nodes1[index2];
                    edges1.push(n);
                }
            }
        }
        // console.log(edges1)

        data = {};
        data.nodes = nodes1;
        data.edges = edges1;
        console.log(data)


    
    data["links"]=[] //use as input to forceSimulation
    for(var i=0;i<data.edges.length;i++){
        var obj={}
        obj["source"]=data.edges[i]["source"].id;
        obj["target"]=data.edges[i]["target"].id;
        // obj["chem"]=data.edges[i]["chem"]
        data.links.push(obj);
    }

    // set the dimensions and margins of the graph
    let width = 1000
    let height = 1000
    var margin={
        top:50,bottom:50,left:50,right:50
    }
    // append the svg object to the div "stream" of the page
    
    var svg2 = d3.select('#q5_plot')
        .append('svg')
        .attr('width',width-margin.right-margin.left)
        .attr('height',height-margin.top-margin.bottom)
        .append('g')
    

    //create edges using "line" elements
    ext = d3.extent(data.links, function(d){return d.popularity});
    let linScale = d3.scaleLinear().domain(ext).range([3, data.links.length]);
    var link = svg2.selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", function(d){
            pop = data.nodes[d.source-1].popularity;
            return pop/20;})


    const color = d3.scaleOrdinal()
        .domain(["pts > reb","reb > pts"])
        .range(["#8acade","#f0c0c0"])

        //create nodes using "circle" elements
    var node = svg2.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 20)
        .attr("fill", function(d){return color(d.valence <= 0.5)});

    // svg.selectAll("circle").data(data.nodes).exit().remove();

    var label = svg2.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(data.nodes)
    .join("text")
    .attr("class", "label")
    .text(d => d.name);


    //create force graph
    var force = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-3000))
        .force("link", d3.forceLink(data.links).id((d) => d.id))
        .force("collide", d3.forceCollide().radius(9))
        .force("center", d3.forceCenter(width / 2, height / 2))

    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });
        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });
        label.attr("x", function (d) {
            return d.x+3;
        })
            .attr("y", function (d) {
                return d.y+3;
            })
            .style("font-size", "8px");
    
    // title
    y_text = 85;
    x_text = width/2
    var title = svg2
        .append("text")
        .attr("x", x_text)
        .attr("y", y_text)
        .text("Album positivity and popularity")
        .attr("text-anchor", "middle")
        .style("font-size", "20px");


    // legend
    svg2.append("circle").attr("cx", 60).attr("cy", 85).attr("r", 6).style("fill", "#f0c0c0");
    svg2.append("circle").attr("cx", 60).attr("cy", 105).attr("r", 6).style("fill", "#8acade");
    svg2.append("text").attr("x", 70).attr("y", 85).text("valence > 0.5").style("font-size", "15px").attr("alignment-baseline","middle")
    svg2.append("text").attr("x", 70).attr("y", 105).text("valence ≤ 0.5").style("font-size", "15px").attr("alignment-baseline","middle")

        });
    
    // A function that update the chart
    function update(selectedGroup) {

        // Create new data with the selection?  
        var albums_list = [selectedGroup];
        var dataFilter1 = d3.filter(dt, function(d){return albums_list.includes(d.album)});
        var nodes1 = [];
        var not_empty = 0
        for (let index = 0; index < dataFilter1.length; index++) {
            var element = dataFilter1[index];
            var m = {};
            if (not_empty == 1 && element.track_number == nodes1[0].id){
                m.id = element.track_number;
                m.name = element.name;
                m.valence = element.valence;
                m.popularity = element.popularity;
                nodes1.push(m);
                break;
            } else {
            m.id = element.track_number;
            m.name = element.name;
            m.valence = element.valence;
            m.popularity = element.popularity;
            nodes1.push(m);
            not_empty = 1;
            }
        }

        var edges1 = [];
        // console.log(nodes1)
    
        for (let index = 0; index < nodes1.length; index++) {
            for (let index2 = 1; index2 < nodes1.length; index2++) {
                if (index != index2){
                    var n = {};
                    n.source = nodes1[index];
                    n.target = nodes1[index2];
                    edges1.push(n);
                }
            }
        }

        var dataFilter = {};
        dataFilter.nodes = nodes1;
        dataFilter.edges = edges1;
        console.log(dataFilter);

        // delete old diagram
        svg2.selectAll("circle").remove();
        svg2.selectAll("line").remove();
        svg2.selectAll("text").remove();
        
        // Give these new data to update line
        dataFilter["links"]=[] //use as input to forceSimulation
        for(var i=0;i<dataFilter.edges.length;i++){
            var obj={}
            obj["source"]=dataFilter.edges[i]["source"].id;
            obj["target"]=dataFilter.edges[i]["target"].id;
            dataFilter.links.push(obj);
        }

        //create edges using "line" elements
        ext = d3.extent(dataFilter.links, function(d){return d.popularity});
        linScale.range([3, dataFilter.links.length]);
 
        link = svg2.selectAll("line")
        .data(dataFilter.links)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", function(d){
            pop = dataFilter.nodes[d.source-1].popularity;
            return pop/20;})
            // return linScale(d.popularity);})

        
        node = svg2.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(dataFilter.nodes)
            .enter().append("circle")
            .attr("r", 20)
            .attr("fill", function(d){return color(d.valence <= 0.5)});

        // label
        // svg2.selectAll('text').remove();
        label = svg2.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(dataFilter.nodes)
        .join("text")
        .attr("class", "label")
        .text(d => d.name);


        //create force graph
        const force = d3.forceSimulation(dataFilter.nodes)
            .force("charge", d3.forceManyBody().strength(-3000))
            .force("link", d3.forceLink(dataFilter.links).id((d) => d.id))
            .force("collide", d3.forceCollide().radius(9))
            .force("center", d3.forceCenter(width / 2, height / 2));

        force.on("tick", function () {
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
            node.attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;
                });
            label.attr("x", function (d) {
                return d.x+3;
            })
                .attr("y", function (d) {
                    return d.y+3;
                })
                .style("font-size", "8px");
      

        // title
        svg2
        .append("text")
        .attr("x", x_text)
        .attr("y", y_text)
        .text("Album positivity and popularity")
        .attr("text-anchor", "middle")
        .style("font-size", "20px");

        // legend
        svg2.append("circle").attr("cx", 60).attr("cy", 85).attr("r", 6).style("fill", "#f0c0c0");
        svg2.append("circle").attr("cx", 60).attr("cy", 105).attr("r", 6).style("fill", "#8acade");
        svg2.append("text").attr("x", 70).attr("y", 85).text("valence > 0.5").style("font-size", "15px").attr("alignment-baseline","middle")
        svg2.append("text").attr("x", 70).attr("y", 105).text("valence ≤ 0.5").style("font-size", "15px").attr("alignment-baseline","middle")
    });
        

    
    }
      // When the button is changed, run the updateChart function
      d3.select("#selectButton").on("change", function(d) {
        var selectedOption = d3.select(this).property("value");
        update(selectedOption);
      })
    
    });
}