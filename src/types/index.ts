export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  dresscode?: string;
  notes?: string;
  created_by_email: string;
  design_data: DesignData;
  created_at: string;
}

export interface UserAsset {
  id: string;
  user_email: string;
  asset_type: 'logo' | 'background' | 'decoration';
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
}

export interface RSVP {
  id: string;
  event_id: string;
  recipient_email: string;
  recipient_name: string;
  response: 'pending' | 'accepted' | 'declined';
  response_date: string | null;
  unique_token: string;
  created_at: string;
}

export interface DesignTemplate {
  id: string;
  user_email: string;
  template_name: string;
  design_data: DesignData;
  is_public: boolean;
  created_at: string;
}

export interface DesignData {
  elements: DesignElement[];
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string;
    gradientDirection?: number;
    gradientColors?: string[];
  };
  border: {
    enabled: boolean;
    width: number;
    color: string;
    secondaryColor?: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
  theme: string;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'logo';
  content?: string;
  src?: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  style: {
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: number;
    backgroundColor?: string;
    padding?: number;
  };
  zIndex: number;
}