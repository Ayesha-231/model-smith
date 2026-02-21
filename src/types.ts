export interface Syllabus {
  id?: number;
  title: string;
  level: string;
  content: string;
  created_at?: string;
}

export interface SyllabusRequest {
  title: string;
  level: string;
  targetAudience: string;
  duration: string;
}
