const request = require('request')
const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=d0e92652fba2bc0edac3b4e83cc38251&query=${latitude},${longitude}&units=f`
    request({url, json: true}, (error, {body}) => {
        if(error){
            callback('Unable to connect to weather services')
        }else if (body.error){
            callback('Unable to find location.')
        }else{
            callback(undefined, `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature}. It feels like ${body.current.feelslike}`)
        }
    })
}
module.exports = forecast