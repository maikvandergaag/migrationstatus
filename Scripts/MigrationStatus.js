//setup the migration status namespace
var migrationStatus = migrationStatus || {};

migrationStatus.InProgressString = 'In progress';
migrationStatus.DoneString = 'Done';
migrationStatus.NotStartedString = 'Not started'; 
migrationStatus.ListName = 'Migration';
migrationStatus.ItemsDone = 0;
migrationStatus.ItemsInProgress = 0;
migrationStatus.ItemsNotStarted = 0;

// Create a function for customizing the Field Rendering of our fields
migrationStatus.CustomizeViewRendering = function () {
    var migrationStatusContext = {};
    migrationStatusContext.Templates = {};
    migrationStatusContext.Templates.View = migrationStatus.RenderMigrationViewBodyTemplate;
    migrationStatusContext.OnPostRender = migrationStatus.OnMigrationViewPostRender;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(migrationStatusContext);
};

migrationStatus.OnMigrationViewPostRender = function (ctx) {
    if (ctx.ListTitle == migrationStatus.ListName) {

        var pieData = [
        {
            value: migrationStatus.ItemsNotStarted,
            color: "#F7464A",
            highlight: "#FF5A5E",
            label: migrationStatus.NotStartedString
        },
        {
            value: migrationStatus.ItemsDone,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: migrationStatus.DoneString
        },
        {
            value: migrationStatus.ItemsInProgress,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: migrationStatus.InProgressString
        }];
        
        var options = {
            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate: true,
            //String - A legend template
            legendTemplate: '<ul style="list-style-type:none;" class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="width:20px;height:10px;display:block;background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
        };

        //get the chart element and setup the doughnut chart
        var ctxChart = document.getElementById("myChart").getContext("2d");
        var myPie = new Chart(ctxChart).Doughnut(pieData, options);

        //generate the legend html
        var legend = document.getElementById("chartLegend");
        legend.innerHTML = myPie.generateLegend();
    }
};

migrationStatus.RenderMigrationViewBodyTemplate = function (ctx) {
    if (ctx.Templates.Body == '') {
        return RenderViewTemplate(ctx);
    }

    if (ctx.ListTitle == migrationStatus.ListName) {
        var listData = ctx.ListData;

        for (var idx in listData.Row) {
            var listItem = listData.Row[idx];

            if (listItem.Status == migrationStatus.InProgressString) {
                migrationStatus.ItemsInProgress++;
            } else if (listItem.Status == migrationStatus.NotStartedString) {
                migrationStatus.ItemsNotStarted++;
            } else if (listItem.Status == migrationStatus.DoneString) {
                migrationStatus.ItemsDone++;
            }
        }

        var htmlOutput = [];
        htmlOutput.push('<div id="listData"><a href="' + ctx.listUrlDir + '"> View this list</a></div>');
        htmlOutput.push('<div id="migrationstatusView" style="height:400px;width:400px;margin-top:10px;float:left;margin-bottom:10px;display:block;">');
        htmlOutput.push('<canvas id="myChart" width="250" height="250"></canvas>');
        htmlOutput.push('<div id="chartLegend" style="width:150px;float:right;" />');
        htmlOutput.push('</div>');
        

        var retVal = htmlOutput.join('');
        return retVal;
    }
    else {
        return RenderViewTemplate(ctx);
    }
}

migrationStatus.CustomizeFieldRendering();



