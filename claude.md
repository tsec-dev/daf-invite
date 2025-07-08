# Military eInvitations MVP - Claude Code Project

## **Project Overview**
Create a streamlined military event invitation system inspired by the AFIT eInvitations platform. Focus on beautiful invitation design with custom squadron logos and simple RSVP functionality.

## **MVP Scope** 🎯
- **Admin Access**: Magic link authentication for .mil emails only
- **Public RSVP**: No registration required - guests just click Accept/Decline
- **Beautiful Invitations**: Military-themed templates with custom squadron logos
- **Core Features**: Create event, send invitations, collect RSVPs

## **Tech Stack**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + Storage)
- **Deployment**: Vercel
- **Email**: Resend
- **Development**: Claude Code integration

---

## **Sprint 1: Foundation** ⏱️ *3 days*

### **Project Setup**
- [ ] Initialize React + TypeScript + Tailwind project
- [ ] Set up Supabase project with tables
- [ ] Configure Resend for email delivery
- [ ] Create basic folder structure
- [ ] Set up Vercel deployment

### **Database Schema (Enhanced)**
```sql
-- Events table
events (
  id uuid primary key,
  title text,
  description text,
  event_date timestamp,
  location text,
  created_by_email text,
  design_data jsonb, -- Stores canvas layout, positions, styling
  created_at timestamp
)

-- User assets table
user_assets (
  id uuid primary key,
  user_email text,
  asset_type text, -- 'logo', 'background', 'decoration'
  file_name text,
  file_url text,
  file_size integer,
  created_at timestamp
)

-- Invitations/RSVPs table
rsvps (
  id uuid primary key,
  event_id uuid references events(id),
  recipient_email text,
  recipient_name text,
  response text, -- 'pending', 'accepted', 'declined'
  response_date timestamp,
  unique_token text unique,
  created_at timestamp
)

-- Design templates table
design_templates (
  id uuid primary key,
  user_email text,
  template_name text,
  design_data jsonb,
  is_public boolean default false,
  created_at timestamp
)
```

---

## **Sprint 2: Admin Authentication** ⏱️ *2 days*

### **Magic Link Auth for .mil emails**
- [ ] Create admin login page with email input
- [ ] Validate .mil email domains only
- [ ] Send magic link via Resend
- [ ] Create session management (simple JWT or localStorage)
- [ ] Protected admin routes

### **Simple Admin Dashboard**
- [ ] Event list view
- [ ] Create new event button
- [ ] Basic navigation

---

## **Sprint 3: Asset Management** ⏱️ *2 days*

### **File Upload System**
- [ ] Supabase Storage bucket setup for user assets
- [ ] Image upload component (logos, backgrounds, decorative elements)
- [ ] File type validation (PNG, JPG, SVG)
- [ ] Image compression and optimization
- [ ] Asset library per admin user

### **Asset Organization**
- [ ] User-specific asset folders
- [ ] Asset preview thumbnails
- [ ] Delete/replace asset functionality
- [ ] Default military template assets (provided)

---

## **Sprint 4: Invitation Designer** ⏱️ *4 days*

### **Drag & Drop Canvas**
- [ ] React DnD or similar drag-and-drop library
- [ ] Canvas container with snap-to-grid
- [ ] Draggable text elements (title, description, date, etc.)
- [ ] Draggable image elements (logos, decorations)
- [ ] Layer management (bring to front/back)

### **Design Elements**
- [ ] Background image/color selection
- [ ] Text styling controls (font, size, color, alignment)
- [ ] Logo positioning and scaling
- [ ] Military rank insignia placement
- [ ] Decorative border elements

### **Template System**
- [ ] Pre-built military templates (Space Force, Air Force, etc.)
- [ ] Save custom templates
- [ ] Template library with thumbnails
- [ ] Clone/duplicate template functionality

### **Real-time Preview**
- [ ] Live canvas updates
- [ ] Mobile/desktop preview modes
- [ ] Email-safe rendering
- [ ] Print-friendly version

---

## **Sprint 5: Event Creation & Designer Integration** ⏱️ *3 days*

### **Event Creation Workflow**
- [ ] Event details form (title, description, date, time, location)
- [ ] Integration with invitation designer
- [ ] Save event with custom design data
- [ ] Preview final invitation before sending

### **Design Persistence**
- [ ] Save canvas layout to database (JSON format)
- [ ] Load saved designs for editing
- [ ] Version history (basic)
- [ ] Export design as image/PDF

## **Sprint 6: Invitation System** ⏱️ *3 days*

### **Send Invitations**
- [ ] Bulk email input (CSV upload or textarea)
- [ ] Generate unique RSVP tokens for each recipient
- [ ] Render custom design as HTML email
- [ ] Send emails via Resend with custom design
- [ ] Track invitation status

### **Email Template Generation**
- [ ] Convert canvas design to HTML/CSS email template
- [ ] Inline CSS for email client compatibility
- [ ] Fallback designs for limited email clients
- [ ] Mobile-responsive email layouts

---

## **Sprint 7: RSVP Landing Pages** ⏱️ *2 days*

### **Public RSVP Experience**
- [ ] Render custom invitation design on RSVP page
- [ ] Simple Accept/Decline buttons
- [ ] Optional guest name input
- [ ] Confirmation message matching design theme
- [ ] No authentication required

### **RSVP Management**
- [ ] Real-time RSVP tracking for admins
- [ ] Guest list with responses
- [ ] Export functionality (CSV)
- [ ] Basic analytics (acceptance rate)

---

## **Sprint 8: Polish & Deploy** ⏱️ *2 days*

### **Final Touches**
- [ ] Error handling and loading states
- [ ] Mobile responsiveness
- [ ] Form validation
- [ ] Environment variable setup
- [ ] Production deployment testing

---

## **Key Features to Match Your Examples**

### **Invitation Design Elements**
- **Envelope Animation**: Animated opening envelope effect
- **Military Branding**: Space Force, Air Force logos and insignia
- **Formal Typography**: Elegant script fonts for ceremony details
- **Star Field Background**: Animated space/star background
- **Professional Layout**: Clean, centered design with proper hierarchy

### **Invitation Designer Features**
- **Drag & Drop Canvas**: Move text, images, and decorative elements anywhere
- **Custom Assets**: Upload logos, backgrounds, rank insignia, decorative borders
- **Text Styling**: Font selection, colors, sizes, military-appropriate typography
- **Layer Management**: Bring elements forward/back, grouping
- **Snap to Grid**: Professional alignment and spacing
- **Template System**: Save and reuse custom designs
- **Live Preview**: See exactly how invitation will look in email/web
- **Export Options**: PDF, PNG, or responsive HTML email

### **Asset Library**
- **Personal Assets**: Each admin has their own asset library
- **Military Templates**: Pre-loaded with official insignia and backgrounds
- **Background Options**: Star fields, flag patterns, solid colors, gradients
- **Logo Support**: Squadron logos, unit patches, rank insignia
- **Decorative Elements**: Borders, frames, military-themed graphics

### **Design Canvas Elements**
- **Text Blocks**: Draggable title, description, date/time, location, RSVP info
- **Image Containers**: Logos, photos, rank insignia with resize handles
- **Background Layers**: Full background images or patterns
- **Shape Elements**: Borders, dividers, decorative frames
- **Button Styling**: Custom RSVP button appearance

---

## **MVP Success Criteria** ✅
- [ ] .mil email admin can create events in under 2 minutes
- [ ] Beautiful invitations with custom logos
- [ ] Email delivery success rate >95%
- [ ] Mobile-friendly RSVP experience
- [ ] Real-time RSVP tracking
- [ ] Export guest list functionality

---

## **Post-MVP Enhancements** 🚀
- [ ] Multiple invitation templates
- [ ] Reminder email automation
- [ ] Calendar integration
- [ ] QR codes for events
- [ ] Guest plus-one handling
- [ ] Event photos/gallery

---

## **Development Timeline**
- **Total Duration**: 18 days (updated for designer features)
- **MVP Ready**: Day 18
- **Core functionality**: Day 12
- **Designer ready**: Day 9
- **Team**: 1 developer using Claude Code

## **Technical Implementation Notes**

### **Drag & Drop Library Options**
- **@dnd-kit/core** - Modern, accessible, performant
- **react-beautiful-dnd** - Smooth animations, good UX
- **react-draggable** - Simple positioning for elements

### **Canvas-to-Email Conversion**
- Store design as JSON with element positions and styles
- Generate inline CSS for email compatibility
- Create fallback layouts for Outlook and other limited clients
- Use absolute positioning with fallbacks

### **File Storage Strategy**
- Supabase Storage buckets per user (user-email-assets)
- Image optimization pipeline (sharp or similar)
- CDN integration for fast asset loading
- Asset versioning for template updates

### **Design Data Structure Example**
```json
{
  "canvas": {
    "width": 600,
    "height": 800,
    "background": {"type": "image", "url": "star-field.jpg"}
  },
  "elements": [
    {
      "id": "title",
      "type": "text",
      "content": "Retirement Ceremony",
      "position": {"x": 50, "y": 100},
      "style": {"fontSize": 24, "color": "#ffffff", "fontFamily": "serif"}
    },
    {
      "id": "logo",
      "type": "image", 
      "src": "squadron-logo.png",
      "position": {"x": 250, "y": 50},
      "size": {"width": 100, "height": 100}
    }
  ]
}
```