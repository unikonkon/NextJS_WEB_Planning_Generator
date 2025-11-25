import type { SavedProject, ProjectDetails } from '@/types';

const STORAGE_KEY = 'discovery-generator-projects';
const DRAFT_KEY = 'discovery-generator-draft';

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Get all saved projects
export function getSavedProjects(): SavedProject[] {
  if (!isBrowser) return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading saved projects:', error);
    return [];
  }
}

// Save a project
export function saveProject(project: SavedProject): void {
  if (!isBrowser) return;
  
  try {
    const projects = getSavedProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = {
        ...project,
        updatedAt: new Date().toISOString(),
      };
    } else {
      projects.unshift(project);
    }
    
    // Keep only the last 50 projects
    const trimmedProjects = projects.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedProjects));
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
}

// Get a single project by ID
export function getProject(id: string): SavedProject | null {
  if (!isBrowser) return null;
  
  const projects = getSavedProjects();
  return projects.find(p => p.id === id) || null;
}

// Delete a project
export function deleteProject(id: string): void {
  if (!isBrowser) return;
  
  try {
    const projects = getSavedProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Save draft (auto-save while editing)
export function saveDraft(details: ProjectDetails): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      details,
      savedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
}

// Load draft
export function loadDraft(): { details: ProjectDetails; savedAt: string } | null {
  if (!isBrowser) return null;
  
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
}

// Clear draft
export function clearDraft(): void {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Error clearing draft:', error);
  }
}

// Export project to JSON file
export function exportProjectToJSON(project: SavedProject): void {
  if (!isBrowser) return;
  
  try {
    const dataStr = JSON.stringify(project, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportName = `${project.name.replace(/[^a-z0-9]/gi, '_')}_backup.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting project:', error);
    throw error;
  }
}

// Import project from JSON file
export function importProjectFromJSON(jsonString: string): SavedProject {
  try {
    const project = JSON.parse(jsonString) as SavedProject;
    
    // Validate required fields
    if (!project.id || !project.name || !project.inputData) {
      throw new Error('Invalid project format');
    }
    
    // Generate new ID to avoid conflicts
    project.id = `imported-${Date.now()}`;
    project.updatedAt = new Date().toISOString();
    
    // Save the imported project
    saveProject(project);
    
    return project;
  } catch (error) {
    console.error('Error importing project:', error);
    throw error;
  }
}

