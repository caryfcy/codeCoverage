function checkLat() {
    var inputVal = document.getElementById("txtLat");
    if (inputVal.value >= -90 && inputVal.value <= 90 && inputVal.value != 0 ) {
        inputVal.style.backgroundColor = "";
        $("#btnBuffer").show();
    }
    else{
        inputVal.style.backgroundColor = "#ff9999";
        $("#btnBuffer").hide();
        }
    }
	
    function checkLong() {
    var inputLong = document.getElementById("txtLong");
    if (inputLong.value >= -180 && inputLong.value <= 180 && inputLong.value != 0 ) {
        inputLong.style.backgroundColor = "";
        $("#btnBuffer").show();
    }
    else{
        inputLong.style.backgroundColor = "#ff9999";
        $("#btnBuffer").hide();
        }
    }

    function checkRad() {
    var inputVal = document.getElementById("txtRadius");
    if (inputVal.value >= 100 && inputVal.value <= 5000) {
        inputVal.style.backgroundColor = "";
        $("#btnBuffer").show();
    }
    else{
        inputVal.style.backgroundColor = "#ff9999";
        $("#btnBuffer").hide();
        }
    }
    //
     require([
              "dojo/dom","dojo/parser", "dojo/_base/array","dojo/promise/all",
              "esri/map", "esri/layers/FeatureLayer", 
              "esri/tasks/query","esri/urlUtils",
              "esri/layers/ArcGISDynamicMapServiceLayer",
              "esri/tasks/QueryTask","esri/geometry/Circle",
              "esri/geometry/Point", "esri/SpatialReference",
              "esri/tasks/GeometryService","esri/tasks/BufferParameters",
              "esri/toolbars/navigation","dijit/registry","dojo/on",
              "esri/graphic", "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol","esri/dijit/Scalebar",
              "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
              "esri/config", "esri/Color","esri/dijit/analysis/OverlayLayers","dojo/dom", "dojo/domReady!"
          ], function(dom,parser,arrayUtils,all,
          Map, FeatureLayer,
          Query,urlUtils,ArcGISDynamicMapServiceLayer,
          QueryTask, Circle,
          Point,SpatialReference,
          GeometryService,BufferParameters,
          Navigation,registry,on,
          Graphic, InfoTemplate, SimpleMarkerSymbol,Scalebar,
          SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer,
          esriConfig, Color,OverlayLayers
  ) 
  {
      parser.parse(); 
      esriConfig.defaults.io.proxyUrl = "/proxy/";
      esriConfig.defaults.io.alwaysUseProxy = false;
      esriConfig.defaults.geometryService =
    new GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");
      
       var map = new Map("mapDiv", { 
          basemap: "topo",
          center: [-77.43, 39.01],
          zoom: 10,
          slider: true
          }); 
       var gridArray=[];
      
   var bufferSymb = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
           new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([105, 105, 255]),2), new Color([255, 255, 0, 0.25]));
   var gridSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255, 122, 0]),2), new Color([255, 122, 0, 0.5]));
   var bufferGeom=null;
   var count =0;
   
   $("#btnBuffer").click(function(){ 
         //wkluczila kotik
         
               var lat = document.getElementById("txtLat").value;
               var longt = document.getElementById("txtLong").value;
               //http://localhost:55340/Home/GetLatLongToUTM?lat=-55&longt=-89
               var apiUrl = 'http://localhost:57597/Home/GetLatLongToUTM?'
                   $.get(apiUrl+'lat='+lat+'&longt='+longt)
        .done(function (data,arr) {
            // On success, 'data' contains a list of products.
           debugger;
        }); 
   		var point;
   		if(count > 0){ 
   			start();
             
   		} 



       var xLong=Number($("#txtLong").val());
       var yLat=Number($("#txtLat").val());                   
      //var point = new Point([-77.468,38.854],new SpatialReference({ wkid:4326 }));
      point = new Point([xLong,yLat],new SpatialReference({ wkid:4326 }));
      count++;
      createBuffer(point);
      /*pointQueryResults(featureSet);
      queryGrids();
      gridQueryResults(featureSet);*/
  });
function start(){}       
function clearGraphics(){
    if(gridArray.length>0){
        for(var i=0;i<gridArray.length;i++){
              map.graphics.remove(gridArray[i]);
          }
          gridArray=[]; 
      }
  }
    function showBuffer(bufferedGeometries){
               arrayUtils.forEach(bufferedGeometries, function (geometry) {
               var bufferedGeometry = new Graphic(geometry, bufferSymb);
               map.graphics.add(bufferedGeometry);  
               map.setExtent(geometry.getExtent());
               bufferGeom=bufferedGeometry;
      });
      //clearGraphics();
      queryGrids();
  }   
    function createBuffer(point){ //
      var params = new BufferParameters();
      params.distances = [Number($("#txtRadius").val())];
      params.geodesic=true;
      params.outSpatialReference = map.spatialReference;
      params.unit = GeometryService.UNIT_METER;
      params.geometries = [point];
      esriConfig.defaults.geometryService.buffer(params, showBuffer);                    
  }        
  
       var scalebar = new Scalebar({
  map: map,//: map,
   scalebarUnit: "dual"
      });

    function gridQueryResults(featureSet){
      if(featureSet.features.length>0){
          for(var i=0;i<featureSet.features.length;i++){
              var gridGeom=featureSet.features[i];
              gridGeom.setSymbol(gridSymbol);
              gridArray.push(gridGeom);
              map.graphics.add(gridGeom);
          }    
          projectGrids();
      }else{
          alert("No features found");
      }
  }
       function errorGridResults(error){
      alert("Problem in Query"); 
  }           
  function queryGrids(){
      var qryObj=new Query();
      qryObj.where="OBJECTID>0";  
      qryObj.geometry=bufferGeom.geometry;
      qryObj.returnGeometry=true;
      var qryTaskObj=new QueryTask("https://services7.arcgis.com/V0D79gP9Almspf9E/arcgis/rest/services/mgrs100/FeatureServer/0");
      qryTaskObj.execute(qryObj,gridQueryResults,errorGridResults);
  }
  var outSR = new SpatialReference(4326);
  var gridIncrement=0,projectedGeoms=[];
       function summerisePoints(){   
       if(gridIncrement<=projectedGeoms.length)
       {        
           var qryObj=new Query();
           qryObj.where="FID>0";
           qryObj.outFields=["*"];
           qryObj.geometry=projectedGeoms[gridIncrement];                          
           qryObj.returnGeometry=false;
           var qryTaskObj=new QueryTask("https://services7.arcgis.com/V0D79gP9Almspf9E/arcgis/rest/services/RandomSterlingdata/FeatureServer/0");
           qryTaskObj.execute(qryObj,pointQueryResults,pointQueryError);                        
       }
   }           
  function projectGrids(){         
      
       var gridGeoms=[];
       projectedGeoms=[];
       for(var i=0;i<gridArray.length;i++){
           gridGeoms.push(gridArray[i].geometry);
       }
       esriConfig.defaults.geometryService.project( gridGeoms, outSR, function(projectedPolygons) {
           projectedGeoms=projectedPolygons;
           summerisePoints();
       });
   }
       var gridStats=[];
       function calculateValues(featureSet){                    
       var popCount=0;
       var conlevel=0;
       var obj=new Object();                    
       if(featureSet.features.length>0){
           for(var i=0;i<featureSet.features.length;i++){
               popCount+=featureSet.features[i]["attributes"].Population;
               conlevel+=featureSet.features[i]["attributes"].Confidence;
           
           } 
           obj.fCnt=featureSet.features.length;
           obj.pCnt=popCount;
           obj.cCnt=(conlevel/(obj.fCnt*100));
       }else{
           obj.fCnt=0;
           obj.pCnt=popCount;
           //        obj.cCnt=conlevel;
            }
            gridStats.push(obj);
            applyColor(obj.cCnt,popCount);          
        }             
   function pointQueryResults(featureSet){                             
       calculateValues(featureSet);
       summerisePoints();
   }
   function pointQueryError(error){      
       summerisePoints();
       gridIncrement++;
   }   
        
   function applyColor(cCnt,pCnt){
       
       var Confidence;
       if(cCnt>=0.75){
           Confidence=0.75;
       }else if(cCnt>=0.50 && cCnt<=0.75){
          Confidence=0.55;
       }
               else if(cCnt>=0.25 && cCnt<=0.50){
           Confidence=0.40;
       } else if (cCnt>=0 && cCnt<=0.25) {
           Confidence=0.25;
       }
      var colors = [
       [0, 108, 0,Confidence],//0green
       [255,255,0,Confidence],//1yellow
       [255, 127, 0,Confidence],//2red
       [255, 0, 0,Confidence] //3red
       ];
           var gridSymbol,index=0;
          
           if(pCnt>=1 && pCnt<50){
               index=0;
               gridSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
               new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
               new Color([255,255,255]),2), new Color(colors[index]));
           }else if(pCnt>=50 && pCnt<100){
               index=1;
               gridSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
               new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
               new Color([255,255,255]),2), new Color(colors[index]));
           }else if(pCnt>=100 && pCnt<750){
               index=2;
               gridSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
               new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
               new Color([255,255,255]),2), new Color(colors[index]));
           }
           else{
               index=3;
               gridSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
               new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
               new Color([255,255,255]),2), new Color(colors[index]));
           }
           var gra=gridArray[gridIncrement];                    
           map.graphics.remove(gridArray[gridIncrement]);
           gra.setSymbol(gridSymbol);
           map.graphics.add(gra);
           gridIncrement++;
       }
   }
   );
