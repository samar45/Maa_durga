export type UserRole = 'super_admin' | 'admin'

export interface Year {
  id: string
  year: number
  theme: string | null
  description: string | null
  cover_photo_id?: string | null
  created_at: string
  photos?: Photo[]
}

export interface Photo {
  id: string
  year_id: string
  cloudinary_url: string
  public_id: string
  caption: string | null
  uploaded_by: string | null
  created_at: string
}

export interface HistoryEntry {
  id: string
  year: number
  title: string
  story_text: string
  image_urls: string[]
  created_at: string
}

export interface UserRoleRecord {
  id: string
  user_id: string
  role: UserRole
  name: string | null
  created_at: string
}

export type ScheduleKind = 'puja' | 'aarti' | 'breakfast' | 'lunch' | 'dinner' | 'other'

export interface ScheduleItem {
  id: string
  day_date: string
  day_label: string | null
  kind: ScheduleKind
  title: string
  start_time: string | null
  end_time: string | null
  details: string | null
  created_at: string
}

export interface Feedback {
  id: string
  name: string | null
  message: string
  rating: number | null
  created_at: string
}
