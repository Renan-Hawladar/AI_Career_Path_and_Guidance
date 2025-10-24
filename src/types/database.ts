export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          display_name: string;
          bio: string;
          display_picture_url: string | null;
          resume_url: string | null;
          education: any[];
          skills: string[];
          goals: string;
          social_links: Record<string, string>;
          extracted_resume_data: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          bio?: string;
          display_picture_url?: string | null;
          resume_url?: string | null;
          education?: any[];
          skills?: string[];
          goals?: string;
          social_links?: Record<string, string>;
          extracted_resume_data?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          bio?: string;
          display_picture_url?: string | null;
          resume_url?: string | null;
          education?: any[];
          skills?: string[];
          goals?: string;
          social_links?: Record<string, string>;
          extracted_resume_data?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      career_recommendations: {
        Row: {
          id: string;
          user_id: string;
          career_title: string;
          summary: string;
          market_demand: string;
          confidence_score: number;
          required_skills: string[];
          salary_range: string;
          growth_outlook: string;
          rank: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          career_title: string;
          summary?: string;
          market_demand?: string;
          confidence_score?: number;
          required_skills?: string[];
          salary_range?: string;
          growth_outlook?: string;
          rank?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          career_title?: string;
          summary?: string;
          market_demand?: string;
          confidence_score?: number;
          required_skills?: string[];
          salary_range?: string;
          growth_outlook?: string;
          rank?: number;
          created_at?: string;
        };
      };
      career_roadmaps: {
        Row: {
          id: string;
          user_id: string;
          career_id: string | null;
          title: string;
          description: string;
          difficulty_level: string;
          estimated_duration: string;
          order_index: number;
          resource_links: any[];
          certification_paths: string[];
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          career_id?: string | null;
          title: string;
          description?: string;
          difficulty_level?: string;
          estimated_duration?: string;
          order_index?: number;
          resource_links?: any[];
          certification_paths?: string[];
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          career_id?: string | null;
          title?: string;
          description?: string;
          difficulty_level?: string;
          estimated_duration?: string;
          order_index?: number;
          resource_links?: any[];
          certification_paths?: string[];
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      skill_gaps: {
        Row: {
          id: string;
          user_id: string;
          career_id: string | null;
          missing_skill: string;
          importance: string;
          course_suggestions: any[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          career_id?: string | null;
          missing_skill: string;
          importance?: string;
          course_suggestions?: any[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          career_id?: string | null;
          missing_skill?: string;
          importance?: string;
          course_suggestions?: any[];
          created_at?: string;
        };
      };
      portfolio_items: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          description: string;
          file_url: string | null;
          skills_used: string[];
          ai_feedback: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          description?: string;
          file_url?: string | null;
          skills_used?: string[];
          ai_feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          description?: string;
          file_url?: string | null;
          skills_used?: string[];
          ai_feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          role?: string;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          title: string;
          description: string;
          icon: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_type: string;
          title: string;
          description?: string;
          icon?: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_type?: string;
          title?: string;
          description?: string;
          icon?: string;
          unlocked_at?: string;
        };
      };
      career_analytics: {
        Row: {
          id: string;
          career_title: string;
          market_trend_data: Record<string, any>;
          skill_trends: Record<string, any>;
          growth_prediction: Record<string, any>;
          last_updated: string;
        };
        Insert: {
          id?: string;
          career_title: string;
          market_trend_data?: Record<string, any>;
          skill_trends?: Record<string, any>;
          growth_prediction?: Record<string, any>;
          last_updated?: string;
        };
        Update: {
          id?: string;
          career_title?: string;
          market_trend_data?: Record<string, any>;
          skill_trends?: Record<string, any>;
          growth_prediction?: Record<string, any>;
          last_updated?: string;
        };
      };
    };
  };
}
