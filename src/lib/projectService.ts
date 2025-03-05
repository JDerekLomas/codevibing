import { Project, ProjectSummary } from '@/lib/types';

// Storage keys
const PROJECTS_KEY = 'codevibing_projects';

/**
 * Project Service
 * Handles saving and retrieving projects
 * Currently uses localStorage, but could be replaced with a backend API
 */
export const projectService = {
  /**
   * Save a new project
   */
  saveProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    // Get existing projects
    const projects = await getProjects();
    
    // Create a new project with ID and timestamps
    const now = new Date();
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      likes: 0,
      views: 0
    };
    
    // Add to projects and save
    projects.push(newProject);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    
    return newProject;
  },
  
  /**
   * Get a project by ID
   */
  getProject: async (id: string): Promise<Project | null> => {
    const projects = await getProjects();
    const project = projects.find(p => p.id === id);
    
    if (!project) return null;
    
    // Convert date strings back to Date objects
    return {
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt)
    };
  },
  
  /**
   * Get all projects
   */
  getProjects: async (): Promise<ProjectSummary[]> => {
    const projects = await getProjects();
    
    // Convert to summaries and sort by createdAt descending
    return projects
      .map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        screenshot: project.screenshot,
        tags: project.tags,
        authorName: project.authorName,
        createdAt: new Date(project.createdAt)
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  /**
   * Update an existing project
   */
  updateProject: async (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> => {
    const projects = await getProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    // Update the project
    const updatedProject: Project = {
      ...projects[index],
      ...updates,
      updatedAt: new Date()
    };
    
    projects[index] = updatedProject;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    
    return updatedProject;
  },
  
  /**
   * Delete a project
   */
  deleteProject: async (id: string): Promise<boolean> => {
    const projects = await getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) {
      return false; // No project was deleted
    }
    
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filteredProjects));
    return true;
  },
  
  /**
   * Record a view for a project
   */
  recordView: async (id: string): Promise<void> => {
    const projects = await getProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index !== -1) {
      projects[index].views = (projects[index].views || 0) + 1;
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
  },
  
  /**
   * Like a project
   */
  likeProject: async (id: string): Promise<void> => {
    const projects = await getProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index !== -1) {
      projects[index].likes = (projects[index].likes || 0) + 1;
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
  }
};

/**
 * Helper function to get all projects from localStorage
 */
async function getProjects(): Promise<Project[]> {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const projectsJson = localStorage.getItem(PROJECTS_KEY);
  if (!projectsJson) {
    return [];
  }
  
  try {
    return JSON.parse(projectsJson);
  } catch (error) {
    console.error('Failed to parse projects:', error);
    return [];
  }
}