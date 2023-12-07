import JWT, { JsonWebTokenError } from 'jsonwebtoken';

const secret = `${process.env.JWT_SECRET}` || 'secret';

interface ITokenP {
  data: any;
  status: {
    isValid: boolean;
    isExpired: boolean;
  };
}

export default class jwt {
  static sign(payload: any) {
    return JWT.sign(payload, secret as JWT.Secret, { expiresIn: '12h' } as JWT.SignOptions);
  }
  static verify(token: string): ITokenP {
    try {
      return {
        data: JWT.verify(token, secret as JWT.Secret),
        status: { isValid: true, isExpired: false },
      };
    } catch (err) {
      if (!(err instanceof JsonWebTokenError)) {
        return { data: null, status: { isValid: false, isExpired: false } };
      }
      if (err.name === 'TokenExpiredError') {
        return { data: null, status: { isValid: false, isExpired: true } };
      } else {
        return { data: null, status: { isValid: false, isExpired: false } };
      }
    }
  }
}
