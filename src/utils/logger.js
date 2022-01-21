import winston from 'winston';
import currentDate from './currentDate.js';

const todayDate = currentDate.getdate(new Date());
const LOGS_PATH = process.env.LOG_PATH;

const loggers = {
	infoLog: winston.createLogger({
		level: 'info',
		format: winston.format.json(),
		transports: [
			new winston.transports.File({
				filename: `${LOGS_PATH}/${todayDate}_info.log`,
			}),
		],
	}),

	errorLog: winston.createLogger({
		level: 'error',
		format: winston.format.json(),
		transports: [
			new winston.transports.File({
				filename: `${LOGS_PATH}/${todayDate}_error.log`,
			}),
		],
	}),
};

export default loggers;
