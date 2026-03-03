export interface LearningDomain {
  id: string
  name: string
  description: string
  color: string
  position: {
    lat: number
    lng: number
  }
  shape: 'cube' | 'sphere' | 'pyramid' | 'torus' | 'cone' | 'cylinder'
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface MiniGame {
  id: string
  domainId: string
  title: string
  description: string
  instructions: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number // in minutes
  component: React.ComponentType<any>
}

export interface GameState {
  currentGame: MiniGame | null
  score: number
  completedGames: string[]
  unlockedDomains: string[]
}