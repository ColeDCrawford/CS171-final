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

    allData.acts = debtData;

    console.log(allData);

    //(4) Event handler(s)? If needed

    //(5) Visualization instances

    //(6) Bind event handlers? If needed


  }
