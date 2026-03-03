import { LearningDomain } from './types'

export const learningDomains: LearningDomain[] = [
  {
    id: 'numbers',
    name: 'Numbers & Mathematics',
    description: 'Master arithmetic, patterns, and mathematical thinking',
    color: '#3b82f6',
    position: { lat: 40.7128, lng: -74.0060 }, // New York
    shape: 'cube',
    icon: '◆',
    difficulty: 'easy'
  },
  {
    id: 'geometry',
    name: 'Geometry & Shapes',
    description: 'Explore spatial relationships and geometric principles',
    color: '#10b981',
    position: { lat: 51.5074, lng: -0.1278 }, // London
    shape: 'pyramid',
    icon: '◆',
    difficulty: 'medium'
  },
  {
    id: 'people',
    name: 'People & Society',
    description: 'Learn about cultures, relationships, and social dynamics',
    color: '#f59e0b',
    position: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    shape: 'sphere',
    icon: '◆',
    difficulty: 'easy'
  },
  {
    id: 'ai',
    name: 'AI & Technology',
    description: 'Discover artificial intelligence and digital innovation',
    color: '#8b5cf6',
    position: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    shape: 'torus',
    icon: '◆',
    difficulty: 'hard'
  },
  {
    id: 'history',
    name: 'History & Time',
    description: 'Journey through important events and historical periods',
    color: '#ef4444',
    position: { lat: 41.9028, lng: 12.4964 }, // Rome
    shape: 'cylinder',
    icon: '◆',
    difficulty: 'medium'
  }
]

export function getDomainById(id: string): LearningDomain | undefined {
  return learningDomains.find(domain => domain.id === id)
}