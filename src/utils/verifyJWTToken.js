import { verify } from 'jsonwebtoken';
require('dotenv').config({ path: 'src/config/.env' });

const secret = process.env.JWT_ACCOUNT_ACTIVATION;

const verifyJWTToken = (token) => {
	const verifyToken = verify(token, secret);
	return verifyToken;
};

export default verifyJWTToken;
