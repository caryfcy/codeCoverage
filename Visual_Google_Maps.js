 var infi; 
var RadVal =function(event){
        var inputVal = document.getElementById("rad");
        if(event.target.value >= 100 && event.target.value <= 10000)
        {
            inputVal.style.backgroundColor = "";

            $("#submit").show();}
        else 
        {            
            inputVal.style.backgroundColor = "#ff9999";         
            $("#submit").hide();
        
    }
    };

    var LatVal =function(event){
        var inputVal = document.getElementById("lat");
        if(event.target.value >= -90 && event.target.value <= 90)
        {        
            inputVal.style.backgroundColor = "";
            $("#submit").show();}
        else 
        {
            inputVal.style.backgroundColor = "#ff9999";
            $("#submit").hide();}
    };

    var LongVal =function(event){
        var inputVal = document.getElementById("long");
        if(event.target.value >= -180 && event.target.value <= 180)
        {
            inputVal.style.backgroundColor = "";
            $("#submit").show();}
        else 
        {
            inputVal.style.backgroundColor = "#ff9999";
            $("#submit").hide();}
    };
function showArrays(event) 
    {
        /* Since this polygon has only one path, we can call getPath() to return the
         *          MVCArray of LatLngs.*/
        var vertices = this.getPath();
        var contentString = "<b>UTM Square polygon</b><br>" + 
                "Clicked location: <br>" + event.latLng.lat() + "," + event.latLng.lng() +
                "<br>";
        // Iterate over the vertices.
        for (var i =0; i < vertices.getLength(); i++) 
        {
            var xy = vertices.getAt(i);
            contentString += "<br>" + "Coordinate " + i + ":<br>" + xy.lat() + "," + xy.lng();
        }
        // Replace the info window's content and position.
        //infoWindow.setContent(contentString);
        //infoWindow.setPosition(event.latLng);
        //infoWindow.open(map);
    }
	/*function exportToCsv(filename, rows) {
        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }*/
	function initMap(){
		//implement the Array.insert method
		Array.prototype.insert = function ( index, item ) {
		this.splice( index, 0, item );
		};
                var map;
                //var infoWindow;
                var irad=Number(document.getElementById("rad").value);
                var ilong=Number(document.getElementById("long").value);
                var ilat=Number(document.getElementById("lat").value);
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 13,
                    center: {lat: ilat, lng: ilong},
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    scaleControl: true
                });
                var iRows = 10000;
                var iCols = 4;
                var i;
                var j;
                var m;
                var n;
                var temp;
                var dataG;
                /* Generate 10000 coordinates and generate random data of population density 
                 * and confidence level for each grid coordinates*/
                dataG =new Array();
                for (i = 0; i  < iRows; i ++) {
                  //test-arr.insert(index, item)
                  
                    var tempArray = new Array(iCols);
                    dataG.insert(i,tempArray);
                    //dataG[i] = tempArray;
                  //
                   temp = i;
			var element = dataG[temp];
                    if(temp%100 > 0){
                        for (j = 0; j < iCols; j++) {    
				
                            switch(j){
                                case 0:
                                    element.insert(0,dataG[temp-1][0] + 0.00002);
                                    break;
                                case 1:
                                    element.insert(1,dataG[temp-1][1] + 0.001152);
                                    break;
                                case 2:
                                     element.insert(2,Math.floor(Math.random()*1000));
                                    break;
                                case 3:
                                    element.insert(3,Math.floor(Math.random()*100));
                                    break;
                             }                            
                        }
                    }
                     else 
                     {
                        for (j = 0; j < iCols; j++) 
                        {
                            if(temp===0 && j===0)
                            {
                                element.insert(j,ilat-((0.00002*50)+(0.00090*50)));
                                //dataG[temp][j] = ilat-((0.00002*50)+(0.00090*50));
                            }
                            else if(temp===0 && j===1)
                            {
                                element.insert(j,ilong-((0.001152*50)+(0.000026*50)));
                                //dataG[temp][j] = ilong-((0.001152*50)+(0.000026*50));  
                                element.insert(2,Math.floor(Math.random()*1000));
                                //dataG[temp][2] = Math.floor(Math.random()*1000);
                                element.insert(3,Math.floor(Math.random()*100));
                                //dataG[temp][3] = Math.floor(Math.random()*100);
                            }
                            else
                            {
                                switch(j)
                                {
                                case 0:
                                    element.insert(0,dataG[temp-100][0] + 0.0009);
                                    break;
                                case 1:
                                     element.insert(1,dataG[temp-100][1] + 0.000026);
                                    break;
                                case 2:
                                     element.insert(2,Math.floor(Math.random()*1000));
                                    break;
                                case 3:
                                    element.insert(3,Math.floor(Math.random()*100));
                                    break;
                                 }           
                            }
                        }
 
                    }
                }
            	//print out message, click inspect and then go console
             	//exportToCsv(dataG,iRows);
             	for(m=0;m<iRows;m++){
             		for(n=0;n<iCols;n++){
             			console.log(dataG[m][n]);
             		}
             	}
                // Define the circular range.        
                var Circle = new google.maps.Circle(
                        {
                    strokeColor: "#0000FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#0000FF",
                    fillOpacity: 0.0,
                    map,
                    center: {lat: ilat, lng: ilong},
                    radius: irad
                }
                        );
                Circle.setMap(map); 
                // Construct the UTM Squares.
                for(i = 0;i < 9900;i++)
                { 
                    var coord1 = new google.maps.LatLng(dataG[i][0]+(0.00090/2), dataG[i][1]+(0.001152/2));
                    if(Circle.getBounds().contains(coord1) && google.maps.geometry.spherical.computeDistanceBetween(Circle.getCenter(), coord1) <= Circle.getRadius())
                    {
                        if(i%100 !== 99){
                        
                            var squareCoords = [
                                {lat: dataG[i][0], lng: dataG[i][1]},
                                {lat: dataG[i+100][0], lng: dataG[i+100][1]},
                                {lat: dataG[i+101][0], lng: dataG[i+101][1]},
                                {lat: dataG[i+1][0], lng: dataG[i+1][1]}
                            ];
                            var color;
                            var opacity;
                            var popColor = dataG[i][2];
                            switch (true){
                                   case(popColor >1 && popColor<50):
                                        color = "#00FF00";
                                        break;
                                   case(popColor >50 && popColor<100):
                                        color = "#FFFF00";
                                        break;
                                   case(popColor >100 && popColor<750):
                                        color = "#FF7F00";
                                        break;
                                   case(popColor >750):
                                        color = "#FF0000";
                                        break;
                            }
                            var popConf = dataG[i][3];
                            switch (true){
                                   case(popConf >0 && popConf<25):
                                         opacity = 0.25;
                                        break;
                                   case(popConf >25 && popConf<50):
                                         opacity = 0.4;
                                        break;
                                   case(popConf >50 && popConf<75):
                                         opacity = 0.55;
                                        break;
                                   case(popConf >75):
                                         opacity = 0.75;
                                        break;
                            }
                            var UTMsquare = new google.maps.Polygon({
                                paths: squareCoords,
                                strokeColor: "#FFFFFF",
                                strokeOpacity: 0.2,
                                strokeWeight: 1,
                                fillColor: color,
                                fillOpacity: opacity
                            });
                            UTMsquare.setMap(map);
                            // Add a listener for the click event.
                            UTMsquare.addListener("click", showArrays);
                            infoWindow = new google.maps.InfoWindow;
                            
                }
            }
        }
    }
    
