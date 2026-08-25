export type PhotoLayout = 'stacked' | 'single' | 'grid' | 'featured-left';

export interface PhotoItem {
  id: string;
  dataUrl: string;
  fileName: string;
  rotation?: number; // 0, 90, 180, 270
  aspectRatio?: number;
  capturedDate?: string; // YYYY-MM-DD extracted from EXIF/metadata
}

export interface EvidencePage {
  id: string;
  date: string; // YYYY-MM-DD
  location: string;
  title: string;
  notes?: string;
  photos: PhotoItem[];
  layout?: PhotoLayout;
}

export interface ReportConfig {
  reportTitle: string;
  monthYear: string;
  institution?: string;
  pageSize: 'letter' | 'a4';
  defaultLocation: string;
}
