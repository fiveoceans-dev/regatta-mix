import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

interface RegattaProfile {
  id: string
  rank: string
  total_races: number
  karma: number
  credits: number
  created_at: string
  updated_at: string
}

export function useRegattaProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<RegattaProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the database function to get the regatta profile
      const { data, error } = await supabase.rpc('get_user_regatta_profile', {
        site_schema: 'site_regatta'
      })

      if (error) throw error

      if (data && data.length > 0) {
        setProfile(data[0])
      } else {
        // Profile doesn't exist, set default values
        setProfile({
          id: '',
          rank: 'novice',
          total_races: 0,
          karma: 0,
          credits: 1000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const updateCredits = async (creditChange: number) => {
    try {
      const { error } = await supabase.rpc('update_user_credits', {
        credit_change: creditChange
      })
      
      if (error) throw error
      
      // Refresh profile after update
      await fetchProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update credits')
      throw err
    }
  }

  return {
    profile,
    loading,
    error,
    updateCredits,
    refetch: fetchProfile
  }
}