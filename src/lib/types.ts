/**
 * Project data model for a CodeVibing component
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  code: string;
  screenshot: string;
  tags: string[];
  authorName?: string;
  aiTool?: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: number;
  views?: number;
}

/**
 * Simplified project data for listings
 */
export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  screenshot: string;
  tags: string[];
  authorName?: string;
  createdAt: Date;
}