import { API_ENDPOINT, API_KEY } from "../../core/constants";
import request from 'request';

export async function READ_WEATHER(cityName) {

    return new Promise((resolve, reject) => {
        let url = `${API_ENDPOINT}?access_key=${API_KEY}&query=${cityName}`;
        console.log('URL=', url)
        request(url, function (err, response, body) {
            if (err) {
                reject(false);
            }
            let weather = JSON.parse(body);
            console.log('Resoooo Body=', weather)
            if (weather.current == undefined) {
                reject(false);
            }
            //let weatherText = `It's ${weather.current.temperature} degrees ${weather.current.is_day === "yes" ? 'Day time' : 'Night time'} in ${weather.location.name}, ${weather.location.country}!`;
            resolve(weather);
        });
    })


}