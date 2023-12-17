import request from './request'
import { Account } from '../types/account'

interface LoginPayload {
  identifier: string
  password: string
}

interface LoginResponse {
  jwt: string
  user: Account
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> =>
  request('/auth/local', 'POST', payload).then((res) => res.json())
