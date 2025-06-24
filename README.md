# Blog GPT 🚀

A full-stack application for marketers, bloggers, and startups to plan, generate, and manage high-quality content using OpenAI. Create blog post ideas, outlines, and full drafts with AI assistance, then edit and organize everything in one dashboard.

## ✨ Features

### 🤖 AI Content Generation
- **Blog Post Ideas**: Generate 10 engaging, SEO-friendly title ideas
- **Content Outlines**: Create detailed, structured blog post outlines
- **Full Drafts**: Generate complete 800-1500 word blog posts
- **Niche-Specific**: Tailored content for your target audience

### ✏️ Content Editor
- **Rich Text Editing**: Edit and refine AI-generated content
- **Live Preview**: Switch between edit and preview modes
- **Metadata Management**: Add titles, tags, and content details
- **Word Count Tracking**: Monitor content length in real-time

### 💾 Content Management
- **Database Storage**: Save all content with user authentication
- **Content Organization**: Tag and categorize your content
- **Content History**: Track creation and modification dates
- **Search & Filter**: Find content by type, tags, or creation date

### 📤 Export Options
- **Markdown Export**: Download content as `.md` files
- **Text Export**: Save as plain `.txt` files
- **Metadata Included**: All exports include tags, niche, and creation info

### 🔐 Authentication
- **User Authentication**: Secure login/signup with Supabase Auth
- **Protected Routes**: User-specific content isolation
- **Session Management**: Persistent login state

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-3.5-turbo

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Set up Supabase database**
   Run this SQL in your Supabase SQL Editor:
   ```sql
   CREATE TABLE IF NOT EXISTS content (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     content_type VARCHAR(50) NOT NULL DEFAULT 'draft',
     tags TEXT[],
     niche VARCHAR(255),
     audience VARCHAR(255),
     word_count INTEGER DEFAULT 0,
     is_published BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   ALTER TABLE content ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view own content" ON content
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own content" ON content
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own content" ON content
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own content" ON content
     FOR DELETE USING (auth.uid() = user_id);
   ```

5. **Install shadcn/ui components**
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button card input label textarea tabs badge
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to http://localhost:3000



