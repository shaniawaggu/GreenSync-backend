const db = require('../db/connect');

class Charging {
    constructor({ ev_location_id, licence_area, primary_name, latitude, longitude }) {
        (this.ev_location_id = ev_location_id),
        (this.licence_area = licence_area),
        (this.primary_name = primary_name),
        (this.latitude = latitude),
        (this.longitude = longitude);
    }
    static async getAll(){
        const response = await db.query("SELECT * FROM evcharginglocations;");
        if (response.rows.length == 0) {
            throw Error("No forecasts found!");
        } else {
            return response.rows.map((el) => new Charging(el));
        }
    }
    // static async create(){
        
    // }
}


module.exports = Charging