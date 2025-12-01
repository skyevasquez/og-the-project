
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[]; // Array of paragraphs
  category: 'News' | 'Lifestyle' | 'Events' | 'Spotlight' | 'Hot Topic' | 'Culture';
  author: string;
  date: string;
  image?: string;
  isFeatured?: boolean;
}

export type ViewState = 'HOME' | 'ARTICLE' | 'CATEGORY' | 'ABOUT' | 'PRIVACY' | 'ADVERTISE' | 'CONTACT';

export interface NavItem {
  label: string;
  value: string; // matches category or 'home'
}
