'user strict';

const { get } = require("http");
const {readfile} = require("fs");

const [,, ...ticker] = process.argv

//api to access data
let url = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={"Normalized":false,"NumberOfDays":365,"DataPeriod":"Day","Elements":[{"Symbol":"${ticker}","Type":"price","Params":["c"]}]}`;

get(url, (res)=>{

  let body = "";

  res.on("data", (buff)=> {
    body += buff.toString()
    console.log(body);
  })
  res.on("end", ()=> {
    //sum of all stock values
    var sum = JSON.parse(body).Elements[0].DataSeries.close.values.reduce((acc, val)=>{
      return acc + val;
    }, 0)
    //length of values array
    var valueslength = JSON.parse(body).Elements[0].DataSeries.close.values.length;
    console.log(valueslength);
    console.log(sum);

    //computation for the average
    let average = sum / valueslength;
    console.log(average);

  })

})
