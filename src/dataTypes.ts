export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          id: number;
          title: string;
          icon: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          icon: string;
          color: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          icon?: string;
          color?: string;
          updated_at?: string;
        };
      };
      semesters: {
        Row: {
          id: number;
          semester_name: string;
          subject_id: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          semester_name: string;
          subject_id: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          semester_name?: string;
          subject_id?: number;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: number;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          updated_at?: string;
        };
      };
      files: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          file_type: string | null;
          size_bytes: number | null;
          content: string | null;
          subject_id: number;
          semester_id: number;
          content_type: 'file' | 'text';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          file_type?: string | null;
          size_bytes?: number | null;
          content?: string | null;
          subject_id: number;
          semester_id: number;
          content_type: 'file' | 'text';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          file_type?: string | null;
          size_bytes?: number | null;
          content?: string | null;
          subject_id?: number;
          semester_id?: number;
          content_type?: 'file' | 'text';
          updated_at?: string;
        };
      };
      file_tags: {
        Row: {
          file_id: number;
          tag_id: number;
          created_at: string;
        };
        Insert: {
          file_id: number;
          tag_id: number;
          created_at?: string;
        };
        Update: {
          file_id?: number;
          tag_id?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [key: string]: {
        Row: {
          [key: string]: any;
        };
        Insert: {
          [key: string]: any;
        };
        Update: {
          [key: string]: any;
        };
      };
    };
    Functions: {
      [key: string]: {
        Args: {
          [key: string]: any;
        };
        Returns: any;
      };
    };
    Enums: {
      [key: string]: {
        [key: string]: any;
      };
    };
  };
}
