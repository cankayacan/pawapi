import { SignOptions, sign, verify } from 'jsonwebtoken';

export type JwtPayload = {
  destination: string;
  code: string;
  [key: string]: any;
};

export const decodeToken = (secret: string, token?: string) => {
  if (typeof token !== 'string') throw new Error('No token provided');

  return verify(token, secret);
};

export const generateToken = (
  secret: string,
  payload: JwtPayload,
  options: SignOptions = { expiresIn: '60min' },
) => sign(payload, secret, options);
