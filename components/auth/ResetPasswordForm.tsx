'use client'

import { useActionState } from "react"
import { resetPassword } from "@/actions/reset-password-action"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()

  const resetPasswordWithToken = resetPassword.bind(null, token)
  const [state, dispatch] = useActionState(resetPasswordWithToken, {
    errors: [],
    success: ""
  })

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach(error => toast.error(error))
    }
    if (state.success) {
      toast.success(state.success, {
        onClose: () => router.push('/auth/login'),
        onClick: () => router.push('/auth/login')
      })
    }
  }, [state, router])

  return (
    <div className="w-full max-w-md bg-white p-8">
      <div className="text-center mb-6">
        <p className="text-gray-500 mt-2">Ingresa tu nueva contraseña</p>
      </div>

      <form className="space-y-6" noValidate action={dispatch}>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-medium text-sm text-gray-700">
            Nueva contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password_confirmation" className="font-medium text-sm text-gray-700">
            Repetir contraseña
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            placeholder="********"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-800 hover:bg-indigo-900 text-white font-semibold py-3 rounded-full transition-colors"
        >
          Guardar contraseña
        </button>
      </form>
    </div>
  )
}
