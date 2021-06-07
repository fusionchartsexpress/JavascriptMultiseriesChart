// src/index.js

// Include the core fusioncharts file from core
import FusionCharts from 'fusioncharts/core';

// Include the chart from viz folder
// E.g. - import ChartType from fusioncharts/viz/[ChartType]
import Scatter from 'fusioncharts/viz/scatter';

// Include the fusion theme
import FusionTheme from 'fusioncharts/themes/es/fusioncharts.theme.fusion';

//add the div tag for the chart container
const myDiv = document.createElement('div');
myDiv.id = 'chart-container';
document.body.appendChild(myDiv);

//define the position of X,Y variables in data file
const CLASS_IND = 8;
const X_IND = 3;
const Y_IND = 0;

async function main() {
    //Get the data
    let response = await fetch('/mlRepo');
    let data = await response.text();
    if (response.ok){        
        renderPage(data);
    }
    else {
        alert('Error reading data from ML repository');
    }
}

//renders the html page when passed data as text
function renderPage(text){
    var classes=["chevrolet","ford","toyota"];
    var matrix = textToMatrix(text);
    var dataset = convertMatrixToJson(matrix,classes);
    var dataSource = constructDataSource(dataset);
    renderChart(dataSource);
}

//convert text to matrix
function textToMatrix(text){
    var matrix = [];
    var rows = text.split("\n");
    for(var i=0;i<rows.length;i++){
        var cols = rows[i].split(/\s+/);
        if (cols.length > 1)
        matrix.push(cols);
    }
    return matrix;
}

//returns JSON text for 'dataset' key 
function convertMatrixToJson(matrix,classes){
    //JSON for dataset
    var dataset = [];
    var colors = ["#0000ff","#00ff00","#ff0000","ffff00"];
    
    for (var k=0;k<classes.length;++k)
    {
        var className = classes[k];        
        var seriesObj = {seriesname: className,
                          color: colors[k],
                          anchorbgcolor: colors[k],
                          anchorbordercolor: colors[k]
                        };
        var data = [];

        var subset = matrix.filter(r=>r[CLASS_IND].match(className));
        for (var i=0;i<subset.length;++i)                         
            data.push({x:subset[i][X_IND],y:subset[i][Y_IND]});

        seriesObj.data = data;
        dataset.push(seriesObj);
    }
    return dataset;
}

//constructs JSON text for 'dataSource' key
function constructDataSource(dataset){

    var dataSource = {"chart": {
        "caption": "Miles Per Gallon vs. Horsepower",
        "subcaption": "Data Source: UCI Machine Learning Repository",
        "xAxisName": "Horsepower",
        "YAxisName": "Miles Per Gallon",
        "ynumbersuffix": " mpg",
        "theme": "fusion",
        "showRegressionLine": "1",
        "plotToolText": "<b>$yDataValue</b> done by a <b>$seriesName</b> with horsepower <b>$xDataValue</b>"

    }, 
    dataset};    
    return dataSource;
}

// Draw the chart
function renderChart(dataSrc){

    FusionCharts.addDep(Scatter);
    FusionCharts.addDep(FusionTheme);

    //Chart Configurations
    const chartConfig = {
        type: 'scatter',
        renderAt: 'chart-container',
        width: '80%',
        height: '600',
        dataFormat: 'json',
        dataSource: dataSrc
    }

    //Create an Instance with chart options and render the chart
    var chartInstance = new FusionCharts(chartConfig);
    chartInstance.render();
}

//Call main method
main();
