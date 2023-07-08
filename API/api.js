const { json } = require('body-parser');
const cors =require('cors')
const { application, query } = require("express");
const express = require("express");
const app = express();
const port = 27027;

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//mongodb
var {MongoClient} = require('mongodb');
const mongoUrl = "mongodb://127.0.0.1:27017/";
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(20);

var bodyParser = require('body-parser');
const { truncate } = require('fs');
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req,res,next)=>{
    res.append('Acess-Control-Allow-Origin',['*'])
    res.append('Acess-Control-Allow-Methods','GET,PUT,POST,DELETE')
    res.append('Acess-Control-Allow-Headers','Content_Type')
    next();
})




let weekMonth = {
   
}

let weatherData = null

const weatherApi = (result,mon)=> {
  weatherData = {
    location: {
      name:result.location.name,
      region:result.location.region,
      country:result.location.country,
      localtime:result.location.localtime
    },
    current:{
      last_updated: result.current.last_updated,
      temp_c:result.current.temp_c,
      wind_kph: result.current.wind_kph,
      humidity:result.current.humidity,
      pressure_in: result.current.pressure_in,
      text:result.current.condition.text,
      icon:result.current.condition.icon
    },
    currentDay:{
      date:result.forecast.forecastday[0].date,
      day:{
        avgtemp_c:result.forecast.forecastday[0].day.avgtemp_c,
        maxwind_kph:result.forecast.forecastday[0].day.maxwind_kph,
        daily_chance_of_rain:result.forecast.forecastday[0].day.daily_chance_of_rain,
        text:result.forecast.forecastday[0].day.condition.text,
        icon:result.forecast.forecastday[0].day.condition.icon,
      },
      hour:result.forecast.forecastday[0].hour,
    },
    week:[
      {
        date:"2023-05-10",
          avgtemp_c:13.6,
          maxwind_kph:22.3,
          avghumidity:89,
          daily_chance_of_rain:88,
          text:"sunny",
          icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
        
      },
      {
        date:"2023-05-11",
        avgtemp_c:13.6,
        maxwind_kph:22.3,
        avghumidity:89,
        daily_chance_of_rain:88,
        text:"sunny",
        icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
        
      },
      {
        date:"2023-05-12",
        avgtemp_c:13.6,
        maxwind_kph:22.3,
        avghumidity:89,
        daily_chance_of_rain:88,
        text:"sunny",
        icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
        
      },
  
      {
        date:"2023-05-13",
          avgtemp_c:13.6,
          maxwind_kph:22.3,
          avghumidity:89,
          daily_chance_of_rain:88,
          text:"sunny",
          icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
      },
  
      {
        date:"2023-05-14",
          avgtemp_c:36.6,
          maxwind_kph:22.3,
          avghumidity:23,
          daily_chance_of_rain:54,
          text:"Heavy rain",
          icon:"//cdn.weatherapi.com/weather/64x64/day/143.png"
      },
      {
        date:"2023-05-15",
        avgtemp_c:23.6,
        maxwind_kph:22.3,
        avghumidity:08,
        daily_chance_of_rain:8,
        text:"cloudy",
        icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
      },
      {
        date:"2023-05-16",
        avgtemp_c:36.6,
        maxwind_kph:32.3,
        avghumidity:49,
        daily_chance_of_rain:28,
        text:"Heavy rain",
        icon:"//cdn.weatherapi.com/weather/64x64/day/143.png"
      }
    ],

  month:[
    {
      date:"May 23",
      date2:new Date('2023-05-01'),
      avgtemp_c:34.6,
      maxwind_kph:29.3,
      avghumidity:89,
      daily_chance_of_rain:48,
      text:"Party Cloudy",
      icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
      
    },
    {
      date:"Jun 23",
      date2:new Date('2023-06-01'),
      avgtemp_c:24.6,
      maxwind_kph:59.3,
      avghumidity:19,
      daily_chance_of_rain:0,
      text:"Rain",
      icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"

    },
    {
      date:"July 23",
      date2:new Date('2023-07-01'),
      avgtemp_c:14.6,
      maxwind_kph:44.3,
      avghumidity:55,
      daily_chance_of_rain:10,
      text:"misty",
      icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
    },
    {
      date:"Aug 23",
      date2:new Date('2023-08-01'),
      avgtemp_c:45.6,
      maxwind_kph:44.3,
      avghumidity:55,
      daily_chance_of_rain:10,
      text:"misty",
      icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
    },
    {
      date:"sep 23",
      date2:new Date('2023-09-01'),
      avgtemp_c:23.6,
      maxwind_kph:44.3,
      avghumidity:55,
      daily_chance_of_rain:10,
      text:"misty",
      icon:"//cdn.weatherapi.com/weather/64x64/day/308.png"
    },

  ]

  }

}




const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "2ae9ebea37msh72d9ff549be9a49p15f0a6jsn74a3f120bf44",
    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
  },
};


app.post("/all_data",async(req,res)=>{
    console.log('req',req.body.location)
    await fetch(
      `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${req.body.location || "chennai"}&days=3`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        
        weatherApi(response)
        
      })
      .catch((err) => console.error(err));

    // data = req.body.data
    console.log('rea',weatherData)

    const client = new MongoClient(mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      client.connect().then((client) => {
        let db = client.db("weather");


        console.log('req.body.location',weatherData)

        db.collection("all_datas").updateOne({"email" : req.body.email},{$set:{weatherData:weatherData}},(err,result)=>{
          if (err) {
              console.log(" no match");
              
            } else {
              console.log("update success");
              
          }
       })


       db.collection("all_datas").find({"email" : req.body.email})
          .toArray((err, result)=> {
            if (err) {
              console.log(" find1 Error: Could not retrieve Shops from DB");
              client.close();
            } else {
              if ( result.length > 0 ) {
                console.log('result data',result);
                res.json(result);
              } else {
                console.log("find2 Error: Could not retrieve Shops from DB");
              }
              client.close();
            }
          });
      });

      console.log('weatherData',weatherData)
    
});



// date api 
// app.post('/date',(req,res)=>{
//   let frdate = req.body.from;
//   let todate = req.body.to;

//     let from = new Date(frdate)
//     let to = new Date(todate)

//     console.log('date',frdate,todate);
//     console.log('ISODate',from,to);


//   const client = new MongoClient(mongoUrl, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   });

//   client.connect().then((client) => {
//     let db = client.db("weather");

//   db.collection("all_datas").find()
//   .toArray((err, result)=> {
//     if (err) {
//       console.log(" find1 Error: Could not retrieve Shops from DB");
//       client.close();
//     } else {
//       if ( result[0].month.length > 0 ) {
//         let Avgtemp = 0;
//         for(let i=0;i<result[0].month.length;i++){
//           Avgtemp += result[0].month[i].avgtemp_c
//         }
//         console.log( (result[0].month.length))
//         console.log(Avgtemp,'result data',result[0].month);
//         res.json({result:result[0].month,avgtemp:Avgtemp/result[0].month.length});
//       } else {
//         console.log("find2 Error: Could not retrieve Shops from DB");
//       }
//       client.close();
//     }
//       });
//     });

//     });



// register
app.post('/register', async(req, res) => {
  console.log('req.body',req.body)

  let name = req.body.name
  let email = req.body.email
  let pass = req.body.pass
  let confPass = req.body.confPass
  let location = req.body.location
  // let verify = /^[a-zA-Z]*$/
  // let verifye = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/


  if (name == undefined || pass == undefined || email == undefined ||confPass == undefined ||
    name == null || pass == null || email == null ||confPass == null || 
    name == '' || pass == '' || email == '' ||confPass == '' 
    ) {
      res.json('inputs should not be empty ')
      console.log('inputs should not be empty')
  }
  else {
      

        await fetch(`https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location || "chennai"}&days=3`,options)
      .then((response) => response.json())
      .then((response) => {
        weatherApi(response)
      })
      .catch((err) => console.error(err));

      let satisfyin = true
      // console.log(data, name, email, password)

          const client = new MongoClient(mongoUrl, {
              useUnifiedTopology: true,
              useNewUrlParser: true,
          });

          client.connect().then((client) => {
              var db = client.db("weather");
              
              // if(satisfyin){
                console.log('yep email')
              db.collection("users")
                .insertOne({ "name": name, "email": email, "pass": pass },(err, result)=> {
                      if (err) {
                          console.log("1 Error: Could not retrieve Shops from DB");
                          client.close();
                      } else {
                          console.log('result',result);
                          // res.json('register success')
                         
                      }
                });

              db.collection("all_datas").insertOne({name:name,email:email,weatherData:weatherData},(err,result)=>{
                    if (err) {
                        console.log("insert 1 Error: Could not retrieve Shops from DB");
                        client.close();
                      } else {
                        console.log("insert success",result);
                        //  res.json(JSON.stringify(result))
                    }
                    // client.close();
                })    

              db.collection("all_datas").find({email:email})
                .toArray((err, result)=> {
                  if (err) {
                    console.log(" find1 Error: Could not retrieve Shops from DB");
                    client.close();
                  } else {
                    if ( result.length > 0 ) {
                      console.log('result reg data',result);
                      res.json(result);
                    } else {
                      console.log("find2 Error: Could not retrieve Shops from DB");
                    }
                    client.close();
                  }
                });   
              // }else{
              //   res.json(satisfyin)
              //   client.close();
              // }
          });
      
    }
})




// login api
app.post('/login', (req, res) => {
  let email = req.body.email
  let pass = req.body.pass
  let satisfylog = true

  console.log(req.body)

  const client = new MongoClient(mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
  });

  client.connect().then((client) => {
      var db = client.db("weather");

      db.collection("users")
          .find()
          .toArray(function (err, result) {
              if (err) {
                  console.log("1 Error: Could not retrieve Shops from DB");
                  client.close();
              } else {
                  if (result.length > 0) {
                      result.forEach((ele, index) => {
                          if (ele.email == email && ele.pass == pass) {
                            satisfylog=false;
                            db.collection("all_datas").find({email:email})
                            .toArray((err, result)=> {
                              if (err) {
                                console.log(" find1 Error: Could not retrieve Shops from DB");
                                client.close();
                              } else {
                                if ( result.length > 0 ) {
                                  console.log('result login data',result);
                                  res.json(result);
                                } else {
                                  console.log("find2 Error: Could not retrieve Shops from DB");
                                }
                                client.close();
                              }
                            });  
                          }
                          else if (result.length - 1 == index && satisfylog) {
                              res.json(false)
                              console.log('noo')
                              client.close();

                          }
                      })

                  } else {
                      console.log("2 Error: Could not retrieve Shops from DB");
                  }
                  
              }
          });



  });

})





app.listen(port,()=>{
    console.log('your port',port)
})