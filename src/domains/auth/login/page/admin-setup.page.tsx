import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAcceptPlatformInvitationMutation, useValidatePlatformInvitationQuery } from '../apis/login.api'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'

const AdminSetupPage = () => {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const { data, isLoading, isError } = useValidatePlatformInvitationQuery(token, { skip: !token })
  const [accept, { isLoading: accepting }] = useAcceptPlatformInvitationMutation()

  const submit = async () => {
    if (password.length < 8) return toast.error('Use at least 8 characters')
    try {
      await accept({ token, password }).unwrap()
      toast.success('Account ready. You can sign in now.')
      navigate('/login')
    } catch { toast.error('This invitation could not be accepted') }
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4"><div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ee9807]">PeoplePulse / platform</p><h1 className="mt-4 text-3xl font-semibold text-slate-900">Finish your admin setup</h1>{isLoading ? <p className="mt-6 text-sm text-slate-500">Checking invitation…</p> : isError || !data?.data ? <p className="mt-6 text-sm text-red-600">This invitation is invalid or expired.</p> : <><p className="mt-3 text-sm leading-6 text-slate-500">Welcome, {data.data.first_name}. Set a password for <span className="font-medium text-slate-700">{data.data.email}</span>.</p><Input className="mt-6" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><Button className="mt-4 w-full bg-[#4469e5] text-white" disabled={accepting} onClick={submit}>Activate account</Button></>}<Link className="mt-6 block text-center text-sm text-slate-500 hover:text-slate-900" to="/login">Return to sign in</Link></div></main>
}

export default AdminSetupPage
