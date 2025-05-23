import { useAuth } from "@/context/AuthContext"
import { useFetchUser } from "@/hooks/useFetchUser"

export function useCurrentUser() {

  const { currentUser } = useAuth()
  const { user, loading, error } = useFetchUser(currentUser?.uid)

  return {
    user,
    loading,
    error,
  }
}