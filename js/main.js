//Date formatting functions

//(1) Load data asynchronously
  queue()
    .defer(d3.csv, "data/Lucca_debt_dataset.csv")
    .await(createVis)

//(2) Create visualizations
  function createVis(error, debtData){
    if(error){
      console.log(error);
    }
    //(3) Manipulate data
    console.log(debtData);
    var allData = {};
    allData.objects = {},
    allData.objectCategories = {};
    //Get a list of counts for all objects and all object categories; turn strings into ints
    debtData.forEach(function(act){
      allData.objects[act.object] = allData.objects[act.object] ? allData.objects[act.object]+1 : 1;
      allData.objectCategories[act.object_category] = allData.objectCategories[act.object_category] ? allData.objectCategories[act.object_category]+1 : 1;
      act.act_id = +act.act_id;
      act.id = +act.id;
      act.date_day = +act.date_day;
      act.date_month = +act.date_month;
      act.date_year = +act.date_year;
      act.lat = +act.lat;
      act.lon = +act.lon;
    })

    allData.individualObjects = debtData;

    //Group objects by plunder acts
    var groupedData = {};
    debtData.forEach(function(object){
      groupedData[object.act_id] = groupedData[object.act_id] || object;
      var act = groupedData[object.act_id];
      act.objects = act.objects || [];
      act.objects.push({
        id: object.id,
        object: object.object,
        object_category: object.object_category
      })
      delete act.object;
      delete act.object_category;
      delete act.id;
    })

    allData.plunders = Object.keys(groupedData).map(function(key){
      return groupedData[key];
    });

    console.log(allData);

    //(4) Event handler(s)? If needed

    //(5) Visualization instances
    var plunderMap = new PlunderMap('map', allData, [43.837674,10.495053], 'cdc43339', 'cjp6062q814su2rp01xokpcl0', 'pk.eyJ1IjoiY2RjNDMzMzkiLCJhIjoiY2pvdTRjd2VrMTg2aDN4cWk2NDAycGI5YSJ9.kjHqMmUbP_SIwpqNq2zfBg');

    //(6) Bind event handlers? If needed


  }
