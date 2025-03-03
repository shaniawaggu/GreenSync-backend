const db = require('../db/connect');
const Windows = require('../optimalwindows')

class Forecast {
    constructor({ forecast_id, dateandtime, estimatedenergy, windenergy, solarenergy }) {
        (this.forecast_id = forecast_id),
        (this.dateandtime = dateandtime),
        (this.estimatedenergy = estimatedenergy),
        (this.windenergy = windenergy),
        (this.solarenergy = solarenergy);
    }
    static async getAll(){
        const response = await db.query("SELECT * FROM forecasts;");
        if (response.rows.length == 0) {
            throw Error("No forecasts found!");
        } else {
            return response.rows.map((el) => new Forecast(el));
        }
    }
    static async create(){
        const locations = [
            { latitude: 51.51836002, longitude: -0.119866225 },
            { latitude: 51.17744549,   longitude: 0.392619521 },
            { latitude: 52.07813579,   longitude: 0.436964304 }
          ];
          
            // Create an array to store the fetched data for each location
            const results = [];
          
            for (let i = 0; i < locations.length; i++) {
              const { latitude, longitude } = locations[i];
              const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=cloud_cover,shortwave_radiation_instant`;
          
              try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Save the data along with its corresponding latitude and longitude
                results.push({ data });
                // console.log(`Data fetched for latitude: ${latitude}, longitude: ${longitude}`);
              } catch (error) {
                console.error(`Error fetching data for latitude: ${latitude}, longitude: ${longitude}`, error);
              }
            }
            let data = {}
            try {
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.2983&longitude=0.7882&hourly=wind_speed_120m');
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                data = await response.json();
            } catch (error) {
                console.error(`Error fetching data`, error);
              }
            
            // Now you have all the data saved in the results array.
            // console.log('All fetched data:', data.hourly.wind_speed_120m);
            let LondonExport = 66.294
            let SouthernExport = 294.347
            let EasternExport = 655.371
            let expectedSolarExport = []
            let expectedExport = []
            let windspeed = 0
            let windfactor = 0

            db.query('TRUNCATE TABLE forecasts');
            for(let i = 0; i < 168; i++){
                if (data.hourly.wind_speed_120m[i] < 3){
                    windspeed = 0
                }else if(data.hourly.wind_speed_120m[i] < 12){
                    windfactor = ((data.hourly.wind_speed_120m[i] - 3)/9)
                    windspeed = 9.646 * windfactor * windfactor * windfactor
                }else{
                    windspeed = 9.646
                }
                expectedSolarExport[i] = (LondonExport * (results[0].data.hourly.shortwave_radiation_instant[i]/1000)
                 * (1 - (0.75 * (results[0].data.hourly.cloud_cover[i] / 100)))
                + SouthernExport * (results[1].data.hourly.shortwave_radiation_instant[i]/1000)
                * (1 - (0.75 * (results[1].data.hourly.cloud_cover[i] / 100)))  + 
                EasternExport * (results[2].data.hourly.shortwave_radiation_instant[i]/1000)
                * (1 - (0.75 * (results[2].data.hourly.cloud_cover[i] / 100))))
                expectedExport[i] = windspeed + expectedSolarExport[i]
                let response = await db.query(
                    'INSERT INTO forecasts (dateAndTime, estimatedEnergy, windEnergy, solarEnergy) VALUES ($1, $2, $3, $4) RETURNING *;',
                    [results[0].data.hourly.time[i], expectedExport[i], windspeed, expectedSolarExport[i]]
                  );
                  
                
                // console.log(`At ${results[0].data.hourly.time[i]} the expected renweable generation is ${expectedExport[i]}`);  
            }
            return ("");
            
            // You can now perform your calculations with the `results` variable.
    }
    static async getWindows(){
      let powerdata
      let forcastdata
      let response = await db.query("SELECT * FROM forecasts;");
      if (response.rows.length == 0) {
          throw Error("No forecasts found!");
      } else {
          //console.log(response.rows);
          forcastdata =  response.rows
          // return response.rows.map((el) => new Forecast(el));
      }
      response = await db.query("SELECT * FROM activepowerdata;");
      if (response.rows.length == 0) {
        throw Error("No forecasts found!");
    } else {
        powerdata =  response.rows

        // return response.rows.map((el) => new Forecast(el));
    }
    Windows.generateWindows(powerdata, forcastdata)

    }

}


module.exports = Forecast