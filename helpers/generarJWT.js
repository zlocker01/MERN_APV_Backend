import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {  // no almacenar info sensible en jwt
        expiresIn: '30d',
    });
};

export default generarJWT;