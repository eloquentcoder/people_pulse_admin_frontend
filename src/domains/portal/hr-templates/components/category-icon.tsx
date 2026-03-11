import {
  UserPlus,
  UserMinus,
  FileText,
  TrendingUp,
  MessageSquare,
  GraduationCap,
  Mail,
  Folder,
  File,
  Users,
  Briefcase,
  Calendar,
  Clock,
  Award,
  Heart,
  Shield,
  Settings,
  Bell,
  Star,
  LucideIcon,
} from 'lucide-react';

// Map of icon names to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  'user-plus': UserPlus,
  'user-minus': UserMinus,
  'file-text': FileText,
  'trending-up': TrendingUp,
  'message-square': MessageSquare,
  'graduation-cap': GraduationCap,
  'mail': Mail,
  'folder': Folder,
  'file': File,
  'users': Users,
  'briefcase': Briefcase,
  'calendar': Calendar,
  'clock': Clock,
  'award': Award,
  'heart': Heart,
  'shield': Shield,
  'settings': Settings,
  'bell': Bell,
  'star': Star,
};

interface CategoryIconProps {
  icon: string;
  color?: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ icon, color, size = 20, className = '' }: CategoryIconProps) {
  const IconComponent = iconMap[icon] || FileText;

  return (
    <IconComponent
      size={size}
      style={{ color: color || '#4469e5' }}
      className={className}
    />
  );
}

export function getCategoryIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || FileText;
}
