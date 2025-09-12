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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          earned_at: string | null
          id: string
          points: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          points?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          points?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      boats: {
        Row: {
          class: Database["public"]["Enums"]["boat_class"]
          condition: Database["public"]["Enums"]["boat_condition"] | null
          created_at: string | null
          handling: number
          hull_number: string | null
          id: string
          insurance_expiry: string | null
          last_maintenance_date: string | null
          maintenance_cost: number | null
          name: string
          owner_id: string | null
          price: number
          rating: number
          seller_id: string | null
          speed: number
          updated_at: string | null
          year_built: number | null
        }
        Insert: {
          class: Database["public"]["Enums"]["boat_class"]
          condition?: Database["public"]["Enums"]["boat_condition"] | null
          created_at?: string | null
          handling: number
          hull_number?: string | null
          id?: string
          insurance_expiry?: string | null
          last_maintenance_date?: string | null
          maintenance_cost?: number | null
          name: string
          owner_id?: string | null
          price: number
          rating: number
          seller_id?: string | null
          speed: number
          updated_at?: string | null
          year_built?: number | null
        }
        Update: {
          class?: Database["public"]["Enums"]["boat_class"]
          condition?: Database["public"]["Enums"]["boat_condition"] | null
          created_at?: string | null
          handling?: number
          hull_number?: string | null
          id?: string
          insurance_expiry?: string | null
          last_maintenance_date?: string | null
          maintenance_cost?: number | null
          name?: string
          owner_id?: string | null
          price?: number
          rating?: number
          seller_id?: string | null
          speed?: number
          updated_at?: string | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "boats_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boats_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crew: {
        Row: {
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          experience: number | null
          id: string
          injury_recovery_days: number | null
          name: string
          owner_id: string | null
          performance_bonus: number | null
          rating: number
          role: Database["public"]["Enums"]["crew_role"]
          salary: number
          seller_id: string | null
          specialty: string | null
          status: Database["public"]["Enums"]["crew_status"] | null
          updated_at: string | null
        }
        Insert: {
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          experience?: number | null
          id?: string
          injury_recovery_days?: number | null
          name: string
          owner_id?: string | null
          performance_bonus?: number | null
          rating: number
          role: Database["public"]["Enums"]["crew_role"]
          salary: number
          seller_id?: string | null
          specialty?: string | null
          status?: Database["public"]["Enums"]["crew_status"] | null
          updated_at?: string | null
        }
        Update: {
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          experience?: number | null
          id?: string
          injury_recovery_days?: number | null
          name?: string
          owner_id?: string | null
          performance_bonus?: number | null
          rating?: number
          role?: Database["public"]["Enums"]["crew_role"]
          salary?: number
          seller_id?: string | null
          specialty?: string | null
          status?: Database["public"]["Enums"]["crew_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          category: Database["public"]["Enums"]["part_category"]
          compatible_classes: Database["public"]["Enums"]["boat_class"][] | null
          condition: Database["public"]["Enums"]["boat_condition"] | null
          created_at: string | null
          id: string
          manufacturer: string | null
          model: string | null
          name: string
          owner_id: string | null
          performance: number
          price: number
          rating: number
          seller_id: string | null
          serial_number: string | null
          updated_at: string | null
          warranty_months: number | null
          weight: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["part_category"]
          compatible_classes?:
            | Database["public"]["Enums"]["boat_class"][]
            | null
          condition?: Database["public"]["Enums"]["boat_condition"] | null
          created_at?: string | null
          id?: string
          manufacturer?: string | null
          model?: string | null
          name: string
          owner_id?: string | null
          performance: number
          price: number
          rating: number
          seller_id?: string | null
          serial_number?: string | null
          updated_at?: string | null
          warranty_months?: number | null
          weight?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["part_category"]
          compatible_classes?:
            | Database["public"]["Enums"]["boat_class"][]
            | null
          condition?: Database["public"]["Enums"]["boat_condition"] | null
          created_at?: string | null
          id?: string
          manufacturer?: string | null
          model?: string | null
          name?: string
          owner_id?: string | null
          performance?: number
          price?: number
          rating?: number
          seller_id?: string | null
          serial_number?: string | null
          updated_at?: string | null
          warranty_months?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          credits: number | null
          email: string
          email_verified: boolean | null
          id: string
          is_active: boolean | null
          karma: number | null
          nickname: string
          rank: Database["public"]["Enums"]["user_rank"] | null
          timezone: string | null
          total_races: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          credits?: number | null
          email: string
          email_verified?: boolean | null
          id: string
          is_active?: boolean | null
          karma?: number | null
          nickname: string
          rank?: Database["public"]["Enums"]["user_rank"] | null
          timezone?: string | null
          total_races?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          credits?: number | null
          email?: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          karma?: number | null
          nickname?: string
          rank?: Database["public"]["Enums"]["user_rank"] | null
          timezone?: string | null
          total_races?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      protests: {
        Row: {
          created_at: string | null
          decision_at: string | null
          id: string
          incident_description: string
          jury_decision: string | null
          penalty_imposed: string | null
          protested_id: string | null
          protester_id: string | null
          race_id: string | null
          rule_citation: string | null
          status: Database["public"]["Enums"]["protest_status"] | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          decision_at?: string | null
          id?: string
          incident_description: string
          jury_decision?: string | null
          penalty_imposed?: string | null
          protested_id?: string | null
          protester_id?: string | null
          race_id?: string | null
          rule_citation?: string | null
          status?: Database["public"]["Enums"]["protest_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          decision_at?: string | null
          id?: string
          incident_description?: string
          jury_decision?: string | null
          penalty_imposed?: string | null
          protested_id?: string | null
          protester_id?: string | null
          race_id?: string | null
          rule_citation?: string | null
          status?: Database["public"]["Enums"]["protest_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "protests_protested_id_fkey"
            columns: ["protested_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protests_protester_id_fkey"
            columns: ["protester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protests_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      race_results: {
        Row: {
          created_at: string | null
          dnf: boolean | null
          dsq: boolean | null
          finish_time: string | null
          id: string
          penalty_points: number | null
          points: number
          position: number
          race_id: string | null
          registration_id: string | null
        }
        Insert: {
          created_at?: string | null
          dnf?: boolean | null
          dsq?: boolean | null
          finish_time?: string | null
          id?: string
          penalty_points?: number | null
          points?: number
          position: number
          race_id?: string | null
          registration_id?: string | null
        }
        Update: {
          created_at?: string | null
          dnf?: boolean | null
          dsq?: boolean | null
          finish_time?: string | null
          id?: string
          penalty_points?: number | null
          points?: number
          position?: number
          race_id?: string | null
          registration_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "race_results_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_results_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "regatta_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      races: {
        Row: {
          course_length: number | null
          created_at: string | null
          id: string
          name: string | null
          race_number: number
          regatta_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["race_status"] | null
          updated_at: string | null
          weather_condition:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_direction: number | null
          wind_speed: number | null
        }
        Insert: {
          course_length?: number | null
          created_at?: string | null
          id?: string
          name?: string | null
          race_number: number
          regatta_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["race_status"] | null
          updated_at?: string | null
          weather_condition?:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Update: {
          course_length?: number | null
          created_at?: string | null
          id?: string
          name?: string | null
          race_number?: number
          regatta_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["race_status"] | null
          updated_at?: string | null
          weather_condition?:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "races_regatta_id_fkey"
            columns: ["regatta_id"]
            isOneToOne: false
            referencedRelation: "regattas"
            referencedColumns: ["id"]
          },
        ]
      }
      regatta_registrations: {
        Row: {
          boat_id: string | null
          created_at: string | null
          crew_ids: string[] | null
          final_position: number | null
          id: string
          paid: boolean | null
          prize_money: number | null
          regatta_id: string | null
          registration_date: string | null
          total_points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          boat_id?: string | null
          created_at?: string | null
          crew_ids?: string[] | null
          final_position?: number | null
          id?: string
          paid?: boolean | null
          prize_money?: number | null
          regatta_id?: string | null
          registration_date?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          boat_id?: string | null
          created_at?: string | null
          crew_ids?: string[] | null
          final_position?: number | null
          id?: string
          paid?: boolean | null
          prize_money?: number | null
          regatta_id?: string | null
          registration_date?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regatta_registrations_boat_id_fkey"
            columns: ["boat_id"]
            isOneToOne: false
            referencedRelation: "boats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regatta_registrations_regatta_id_fkey"
            columns: ["regatta_id"]
            isOneToOne: false
            referencedRelation: "regattas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regatta_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      regattas: {
        Row: {
          class: Database["public"]["Enums"]["boat_class"]
          code: string | null
          created_at: string | null
          current_players: number | null
          description: string | null
          end_date: string
          entry_fee: number
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          max_players: number
          name: string
          number_of_races: number | null
          organizer_id: string | null
          prize_pool: number
          race_distance: number | null
          registration_deadline: string
          start_date: string
          status: Database["public"]["Enums"]["regatta_status"] | null
          updated_at: string | null
          wave_height: number | null
          weather_condition:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_speed: number | null
        }
        Insert: {
          class: Database["public"]["Enums"]["boat_class"]
          code?: string | null
          created_at?: string | null
          current_players?: number | null
          description?: string | null
          end_date: string
          entry_fee: number
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          max_players: number
          name: string
          number_of_races?: number | null
          organizer_id?: string | null
          prize_pool: number
          race_distance?: number | null
          registration_deadline: string
          start_date: string
          status?: Database["public"]["Enums"]["regatta_status"] | null
          updated_at?: string | null
          wave_height?: number | null
          weather_condition?:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_speed?: number | null
        }
        Update: {
          class?: Database["public"]["Enums"]["boat_class"]
          code?: string | null
          created_at?: string | null
          current_players?: number | null
          description?: string | null
          end_date?: string
          entry_fee?: number
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_players?: number
          name?: string
          number_of_races?: number | null
          organizer_id?: string | null
          prize_pool?: number
          race_distance?: number | null
          registration_deadline?: string
          start_date?: string
          status?: Database["public"]["Enums"]["regatta_status"] | null
          updated_at?: string | null
          wave_height?: number | null
          weather_condition?:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "regattas_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_members: {
        Row: {
          active: boolean | null
          id: string
          joined_at: string | null
          role: string | null
          site_id: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          id?: string
          joined_at?: string | null
          role?: string | null
          site_id?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          id?: string
          joined_at?: string | null
          role?: string | null
          site_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_members_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          active: boolean | null
          created_at: string | null
          domain: string
          id: string
          name: string
          schema_name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          domain: string
          id?: string
          name: string
          schema_name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          domain?: string
          id?: string
          name?: string
          schema_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          buyer_id: string | null
          commission: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          price: number
          seller_id: string | null
          status: string | null
        }
        Insert: {
          buyer_id?: string | null
          commission?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          price: number
          seller_id?: string | null
          status?: string | null
        }
        Update: {
          buyer_id?: string | null
          commission?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          price?: number
          seller_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          audio_enabled: boolean | null
          auto_save: boolean | null
          created_at: string | null
          graphics_quality: string | null
          id: string
          language: string | null
          music_volume: number | null
          notifications_enabled: boolean | null
          sfx_volume: number | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audio_enabled?: boolean | null
          auto_save?: boolean | null
          created_at?: string | null
          graphics_quality?: string | null
          id?: string
          language?: string | null
          music_volume?: number | null
          notifications_enabled?: boolean | null
          sfx_volume?: number | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audio_enabled?: boolean | null
          auto_save?: boolean | null
          created_at?: string | null
          graphics_quality?: string | null
          id?: string
          language?: string | null
          music_volume?: number | null
          notifications_enabled?: boolean | null
          sfx_volume?: number | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_quick_match: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      ensure_membership_for_domain: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_in_site: {
        Args: { site_schema: string }
        Returns: boolean
      }
      user_role_in_site: {
        Args: { site_schema: string }
        Returns: string
      }
    }
    Enums: {
      boat_class: "j24" | "j70" | "laser" | "optimist" | "flying_dutchman"
      boat_condition: "excellent" | "good" | "fair" | "poor" | "damaged"
      crew_role: "skipper" | "tactician" | "trimmer" | "grinder" | "bowman"
      crew_status: "available" | "contracted" | "injured" | "retired"
      part_category:
        | "sail"
        | "mast"
        | "rudder"
        | "keel"
        | "rigging"
        | "electronics"
        | "safety"
      protest_status: "submitted" | "under_review" | "dismissed" | "upheld"
      race_status: "not_started" | "in_progress" | "finished" | "abandoned"
      regatta_status:
        | "upcoming"
        | "registration_open"
        | "registration_closed"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_rank:
        | "novice"
        | "intermediate"
        | "advanced"
        | "expert"
        | "professional"
      weather_condition:
        | "calm"
        | "light_breeze"
        | "moderate_breeze"
        | "strong_breeze"
        | "gale"
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
    Enums: {
      boat_class: ["j24", "j70", "laser", "optimist", "flying_dutchman"],
      boat_condition: ["excellent", "good", "fair", "poor", "damaged"],
      crew_role: ["skipper", "tactician", "trimmer", "grinder", "bowman"],
      crew_status: ["available", "contracted", "injured", "retired"],
      part_category: [
        "sail",
        "mast",
        "rudder",
        "keel",
        "rigging",
        "electronics",
        "safety",
      ],
      protest_status: ["submitted", "under_review", "dismissed", "upheld"],
      race_status: ["not_started", "in_progress", "finished", "abandoned"],
      regatta_status: [
        "upcoming",
        "registration_open",
        "registration_closed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_rank: [
        "novice",
        "intermediate",
        "advanced",
        "expert",
        "professional",
      ],
      weather_condition: [
        "calm",
        "light_breeze",
        "moderate_breeze",
        "strong_breeze",
        "gale",
      ],
    },
  },
} as const
