
// Program to convert the data that I gathered into the data that i can use (all data with OCC_Code of 15-....)

// By Jack Pharies






var screen = {width:1000,height:900}
var margins = {top:10,right:25,left:55,bottom:50}





var statePromise = d3.csv("/stateData/stateData.csv")
var stateData = []

var planPromise = d3.csv("/stateData/stateDatapt2.csv")
var planData = []
var statePopData = []

var newData =[]







var success = function(data)
{
    

    console.log(data)
    stateData = data.filter(filterTheStates)
    
    statePopData = data.filter(filterTotalStates)
    console.log(statePopData)
    
    
    
    stateData= stateData.map(editEMP)
    statePopData = statePopData.map(editEMP)
    console.log(stateData)
    
    
    
    

    for (items in stateData)
        {
            
            
            var obj = makeData(stateData[items], items)
            
            
            newData.push(obj)
        }
    
    console.log(newData)
    setup(newData)
    
    
    
}

var fail = function(data)
{
    
    console.log("404 not found")
    
    
    
}
var fill = function(data)
{
    
    planData = data
    
    
    console.log(planData)
    
    
}
planPromise.then(fill,fail)
statePromise.then(success, fail)


var filterTheStates = function(state)
{
    

    
    if (state.OCC_CODE == "15-0000" && state.ST != "GU" && state.ST != "PR" && state.ST != "VI")
        {
            return state

        }
    

}

var filterTotalStates = function(state)
{
    

    
    if (state.OCC_CODE == "00-0000" && state.ST != "GU" && state.ST != "PR" && state.ST != "VI")
        {
            return state

        }
    

}

var makeData = function(cscData, index)
{
    
    
    var avgEmp = (cscData.totalEmp / statePopData[index].totalEmp) * 100
    
    var newState = {
        
        ST: cscData.ST,
        STATE: cscData.STATE,
        totalEmp: avgEmp
        
   
        
        
        
        
    }
    
    
    
     return newState
    
    
    
}
var editEMP = function(state)
{
    var totEmp = ""
    var empSplit = state.TOT_EMP.split(",")
    for (items in empSplit)
        {
            totEmp =  totEmp + empSplit[items] 
        }
        
        
   totalEmp = parseInt(totEmp) 
   totalEmp = totalEmp
    
    
    
    
    state.totalEmp = totalEmp
    return state
    
    
    
    
    
}

var setup = function(data)
{
    
    
     d3.select("svg")
      .attr("width",screen.width)
      .attr("height",screen.height)
      .append("g")
      .attr("id","graph")
      .attr("transform","translate("+margins.left+","+margins.top+")");
    
    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;

    var xScale = d3.scaleLinear()
                   .domain([0,51])
                   .range([0,width])
    
    
    var yScale = makeYScale(data)
    
    
    
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)
    
    
    d3.select("svg")
      .append("g")
      .classed("axis",true)
    
    d3.select(".axis")
      .append("g")
      .attr("id","xAxis")
      .attr("transform","translate("+margins.left+","+(margins.top+height + 30)+")")
      .call(xAxis)
    
    d3.select(".axis")
      .append("g")
      .attr("id","yAxis")
      .attr("transform","translate(50, "+margins.top+")")
      .call(yAxis)
    
    
    drawPoints(data, xScale, yScale)
    
    
   
    
    
    
 
    
    
    
    
    
    
    
    
    
    
}



var drawPoints = function(data, xScale, yScale)
{
    
    //d3.selectAll("circle").remove()
   
    var arrays = d3.select("#graph")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",function(q,i){ return xScale(i)})
        .attr("cy",function(q){return yScale(q.totalEmp)})
        .attr("r",7)
        .style("fill", function(d)
              {
            
            
            var color = makeColor(d)
          
            
            return color
            
            
        })
    
    
    
    
    
}

var makeColor = function(state)
{

    for (items in planData)
        {
             
            if (state.ST == planData[items].Stateabbv)
            {
                
                if(planData[items].Preserviceincentives == "Yes")
                    {
                        
                        
                        return "green"
                        
                        
                    }
                else if (planData[items].Preserviceincentives == "In progress")
                    {
                        
                        return "yellow"
                        
                    }
                else if (planData[items].Preserviceincentives == "No")
                    {return "red"}
                else{
                    
                    return "black"
                }
                
                
            }
         
          
            
            
            
            
        }
      //return "blue"
    
    
    
    
}






var makeYScale = function(data)
{
var yScale=d3.scaleLinear()
 yScale.domain(
 [
     d3.min(data,function(d){return d.totalEmp}),
  
        d3.max(data,function(d){return d.totalEmp})
        
 ]
 )
yScale.range([screen.height,0])
return yScale
    
}


