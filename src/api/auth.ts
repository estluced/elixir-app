import request from './request'
import { Account } from '../types/account'

interface LoginPayload {
  identifier: string
  password: string
}

interface LoginResponse {
  jwt: string
  user: Account
  error?: string
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> =>
  request('/api/auth/local', 'POST', payload).then((res) => res.json())
