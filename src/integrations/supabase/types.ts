export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          description: string | null
          earned_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          description?: string | null
          earned_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          description?: string | null
          earned_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      boats: {
        Row: {
          class: string | null
          condition: string | null
          created_at: string
          handling: number | null
          id: string
          name: string
          owner_id: string | null
          price: number | null
          rating: number | null
          speed: number | null
          updated_at: string
        }
        Insert: {
          class?: string | null
          condition?: string | null
          created_at?: string
          handling?: number | null
          id?: string
          name: string
          owner_id?: string | null
          price?: number | null
          rating?: number | null
          speed?: number | null
          updated_at?: string
        }
        Update: {
          class?: string | null
          condition?: string | null
          created_at?: string
          handling?: number | null
          id?: string
          name?: string
          owner_id?: string | null
          price?: number | null
          rating?: number | null
          speed?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      crew: {
        Row: {
          created_at: string
          experience: number | null
          id: string
          name: string
          owner_id: string | null
          rating: number | null
          role: string | null
          salary: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience?: number | null
          id?: string
          name: string
          owner_id?: string | null
          rating?: number | null
          role?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          experience?: number | null
          id?: string
          name?: string
          owner_id?: string | null
          rating?: number | null
          role?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      parts: {
        Row: {
          category: string | null
          condition: string | null
          created_at: string
          id: string
          name: string
          owner_id: string | null
          performance: number | null
          price: number | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          condition?: string | null
          created_at?: string
          id?: string
          name: string
          owner_id?: string | null
          performance?: number | null
          price?: number | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          condition?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string | null
          performance?: number | null
          price?: number | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          credits: number
          email: string | null
          id: string
          nickname: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          credits?: number
          email?: string | null
          id: string
          nickname?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          credits?: number
          email?: string | null
          id?: string
          nickname?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      protests: {
        Row: {
          created_at: string
          id: string
          incident_description: string
          protester_id: string
          rule_citation: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          incident_description: string
          protester_id: string
          rule_citation?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          incident_description?: string
          protester_id?: string
          rule_citation?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      regatta_registrations: {
        Row: {
          created_at: string
          final_position: number | null
          id: string
          prize_money: number | null
          regatta_id: string
          registration_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          final_position?: number | null
          id?: string
          prize_money?: number | null
          regatta_id: string
          registration_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          final_position?: number | null
          id?: string
          prize_money?: number | null
          regatta_id?: string
          registration_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "regatta_registrations_regatta_id_fkey"
            columns: ["regatta_id"]
            isOneToOne: false
            referencedRelation: "regattas"
            referencedColumns: ["id"]
          },
        ]
      }
      regattas: {
        Row: {
          class: string
          code: string | null
          created_at: string
          current_players: number
          description: string | null
          end_date: string | null
          entry_fee: number
          id: string
          location: string | null
          max_players: number
          name: string
          organizer_id: string
          prize_pool: number
          registration_deadline: string | null
          start_date: string | null
          status: string
          updated_at: string
          wave_height: number | null
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          class: string
          code?: string | null
          created_at?: string
          current_players?: number
          description?: string | null
          end_date?: string | null
          entry_fee?: number
          id?: string
          location?: string | null
          max_players: number
          name: string
          organizer_id: string
          prize_pool?: number
          registration_deadline?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          wave_height?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          class?: string
          code?: string | null
          created_at?: string
          current_players?: number
          description?: string | null
          end_date?: string | null
          entry_fee?: number
          id?: string
          location?: string | null
          max_players?: number
          name?: string
          organizer_id?: string
          prize_pool?: number
          registration_deadline?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          wave_height?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Relationships: []
      }
      site_regatta_profiles: {
        Row: {
          created_at: string
          credits: number
          karma: number
          rank: string
          total_races: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          karma?: number
          rank?: string
          total_races?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          karma?: number
          rank?: string
          total_races?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_regatta_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          audio_enabled: boolean
          auto_save: boolean
          created_at: string
          graphics_quality: string
          music_volume: number
          notifications_enabled: boolean
          sfx_volume: number
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_enabled?: boolean
          auto_save?: boolean
          created_at?: string
          graphics_quality?: string
          music_volume?: number
          notifications_enabled?: boolean
          sfx_volume?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_enabled?: boolean
          auto_save?: boolean
          created_at?: string
          graphics_quality?: string
          music_volume?: number
          notifications_enabled?: boolean
          sfx_volume?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_regatta_profile: {
        Args: { site_schema?: string }
        Returns: {
          created_at: string
          credits: number
          id: string
          karma: number
          rank: string
          total_races: number
          updated_at: string
        }[]
      }
      update_user_credits: {
        Args: { credit_change: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
