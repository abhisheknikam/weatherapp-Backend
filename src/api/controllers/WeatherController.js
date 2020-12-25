
import request from 'request';
import InternalServerError from '../../core/errors/InternalServerError';
import logger from '../../core/logger';
import { READ_WEATHER } from '../service/Weather';



class WeatherController {

    static async getWeather(req, res, next) {
        let status = 200;
        let success = true;
        let weatherData;
        let message = 'Weather Data Found.';
        try {
            console.log('Req Body=', req.body)
            let city = req.body.city;
            if (city) {

                weatherData = await READ_WEATHER(city);
                if (!weatherData) {
                    status = 201;
                    success = false;
                    message = 'Weather Data Not Found.';
                }
            } else {
                status = 202;
                success = false;
                message = 'City Required';
            }

            return res.json({
                status: status,
                success: success,
                message: message,
                weatherInfo: weatherData
            });


        } catch (error) {
            console.log('Error in fetching weather data=', error)
            logger.error('weatherData:: An error occured');
            logger.error(error.message);
            logger.error(error.stack);
            return next(new InternalServerError('An internal server error occured!'));
        }
    }


}

export default WeatherController;