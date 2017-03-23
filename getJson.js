const {readfile} = require("fs");
const {get} = require("http");

const [,, ...ticker] = process.argv
let url = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={"Normalized":false,"NumberOfDays":365,"DataPeriod":"Day","Elements":[{"Symbol":"${ticker}","Type":"price","Params":["c"]}]}`;

const getJSON = (url)=> {
  return new Promise ((resolve, reject)=>{
      get(url, (res)=>{
        const statusCode = res.statusCode;
        const contentType = res.headers["content-type"]
        console.log(contentType);

        let error = null;
        if(statusCode !== 200) {
          error = new Error(`Request faild\n Status Code: ${statusCode}`)
        } else if (!/^text\/javascript/.test(contentType)) {
          error = new Error(`Invalid content-type.\n Expected application/json but received ${contentType}`);
        }

        if(error) {
          console.log(error.message);
          res.resume();
          return
        }

  let body = ""
  res.on("data", (buff) => {
    body += buff.toString()
  })
  res.on("end", ()=>{
    //sum of all stock values
    resolve(JSON.parse(body))
    });
  });
});
}
getJSON(url).then((data)=>{
  //sum of values
  var sum = data.Elements[0].DataSeries.close.values.reduce((acc, val)=>{
      return acc +val;
    }, 0);
    //length of values array
    var valueslength = data.Elements[0].DataSeries.close.values.length;
    console.log(valueslength);
    console.log(sum)
    var average = sum / valueslength;
    console.log(average);
})
