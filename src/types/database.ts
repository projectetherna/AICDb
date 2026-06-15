/**
 * Supabase schema types for AICDb.
 * Regenerate after schema changes: npm run types:gen
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ContentStatus = 'draft' | 'pending' | 'published' | 'rejected';
export type ContentType = 'film' | 'series';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      content: {
        Row: {
          id: string;
          type: ContentType;
          status: ContentStatus;
          slug: string;
          title: string;
          synopsis: string | null;
          poster_url: string | null;
          release_year: number | null;
          duration_minutes: number | null;
          language: string | null;
          country: string | null;
          external_url: string | null;
          embed_code: string | null;
          ai_tools: string[] | null;
          credits: Json | null;
          submitted_by: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['content']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['content']['Insert']>;
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          episode_id: string | null;
          visuals: number;
          sound_design: number;
          script: number;
          main_score: number | null;
          review: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id' | 'main_score' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>;
        Relationships: [];
      };
      watchlist: {
        Row: { user_id: string; content_id: string; created_at: string };
        Insert: { user_id: string; content_id: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['watchlist']['Insert']>;
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          episode_id: string | null;
          parent_id: string | null;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
        Relationships: [];
      };
      content_stats: {
        Row: {
          content_id: string;
          rating_count: number;
          rating_avg: number | null;
          comment_count: number;
          watchlist_count: number;
          engagement_score: number;
          last_activity_at: string | null;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['content_stats']['Row']> & { content_id: string };
        Update: Partial<Database['public']['Tables']['content_stats']['Row']>;
        Relationships: [];
      };
      seasons: {
        Row: {
          id: string;
          content_id: string;
          season_number: number;
          title: string | null;
          synopsis: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['seasons']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['seasons']['Insert']>;
        Relationships: [];
      };
      episodes: {
        Row: {
          id: string;
          season_id: string;
          episode_number: number;
          title: string;
          synopsis: string | null;
          duration_minutes: number | null;
          external_url: string | null;
          embed_code: string | null;
          air_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['episodes']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['episodes']['Insert']>;
        Relationships: [];
      };
      tags: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: { name: string; slug: string; id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['tags']['Insert']>;
        Relationships: [];
      };
      content_tags: {
        Row: { content_id: string; tag_id: string };
        Insert: { content_id: string; tag_id: string };
        Update: Partial<Database['public']['Tables']['content_tags']['Insert']>;
        Relationships: [];
      };
    };
    Views: {
      homepage_trending: {
        Row: Database['public']['Tables']['content']['Row'] & {
          rating_count: number | null;
          rating_avg: number | null;
          comment_count: number | null;
          watchlist_count: number | null;
          engagement_score: number | null;
          last_activity_at: string | null;
        };
        Relationships: [];
      };
      homepage_newest: {
        Row: Database['public']['Views']['homepage_trending']['Row'];
        Relationships: [];
      };
    };
    Functions: {
      is_half_step_rating: { Args: { value: number }; Returns: boolean };
      refresh_content_stats: { Args: { p_content_id: string }; Returns: undefined };
    };
    Enums: {
      content_status: ContentStatus;
      content_type: ContentType;
    };
    CompositeTypes: Record<string, never>;
  };
};
