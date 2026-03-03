export interface Slide {
  id: string;
  title: string;
  content: React.ReactNode;
  background?: string;
  layout?: 'center' | 'split' | 'full';
}

export interface PresentationProps {
  slides: Slide[];
}