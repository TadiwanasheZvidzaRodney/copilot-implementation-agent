# Copilot Implementation Agent

<p align="center">
  <img src="public/logo-white.svg" alt="CIA Logo" width="200" />
</p>

<p align="center">
  A powerful AI-driven tool that transforms project descriptions, business requirements, or feature ideas into highly structured, actionable, and phased Technical Implementation Plans.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-3-000000?style=for-the-badge&logo=nuxt.js&logoColor=white" alt="Nuxt 3" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-000000?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Hugging_Face-000000?style=for-the-badge&logo=huggingface&logoColor=white" alt="Hugging Face" />
</p>

---

## ✨ Features

- 🚀 **AI-Powered Planning** - Leverages Meta Llama 3 8B Instruct via Hugging Face Inference API (free tier!)
- 📋 **Phased Implementation** - Generates structured, chronological phases for project execution
- 🎨 **Beautiful UI** - Modern, minimalistic black & white interface with Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 📝 **Markdown Rendering** - Professional formatting with syntax highlighting
- 📋 **Copy to Clipboard** - Easily copy generated plans for documentation
- 🆓 **Zero Cost** - Uses Hugging Face Serverless Inference (completely free)
- 🔐 **Optional Cloud Sync** - Sign in with Google/GitHub to sync plans across devices (Supabase)
- 💾 **Offline Support** - Works without signing in, plans saved locally

## 🛠️ Tech Stack

- **Framework:** Nuxt 3
- **Styling:** Tailwind CSS with Typography plugin
- **AI:** Hugging Face Inference API (Meta Llama 3 8B Instruct)
- **Auth & Database:** Supabase (optional, for cloud sync)
- **Markdown:** Marked.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Hugging Face API token (free)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Edit `.env` and add your API token:
   ```env
   NUXT_HF_TOKEN=your_huggingface_access_token
   ```

   > 💡 Get your free Hugging Face token at [Hugging Face Settings](https://huggingface.co/settings/tokens)

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. Enter your project description in the text area
2. Be as detailed as possible - include:
   - Project goals and objectives
   - Preferred tech stack (optional)
   - Key features and requirements
   - Any constraints or considerations
3. Click "Generate Plan"
4. Review your structured implementation plan
5. Copy the plan to use in your documentation

### Example Input

```
Build a real-time collaborative task management application with:
- User authentication (OAuth with Google/GitHub)
- Team workspaces and permissions
- Drag-and-drop Kanban boards
- Real-time updates using WebSockets
- Mobile-responsive design
Tech preferences: Vue.js, Supabase, Tailwind CSS
```

## 📁 Project Structure

```
copilot-implementation-agent/
├── app/
│   ├── app.vue                # Main application component
│   ├── components/            # Vue components (ToastContainer, AuthButton, etc.)
│   └── composables/           # Composables (useToast, useAuth, useHistory, useSupabase)
├── server/
│   ├── api/
│   │   └── plan.post.ts       # API endpoint for plan generation
│   └── utils/
│       └── copilot-implementation-agent.md  # AI system prompt
├── supabase/
│   └── schema.sql             # Database schema for Supabase
├── public/                    # Static assets (logos, icons)
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── .env                       # Environment variables
└── package.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NUXT_HF_TOKEN` | Your Hugging Face API token | Yes |
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No (for cloud sync) |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | No (for cloud sync) |

### Setting up Supabase (Optional)

To enable cloud sync and authentication:

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Go to **Authentication > Providers** and enable Google/GitHub OAuth
4. Copy your project URL and anon key from **Settings > API**
5. Add them to your `.env` file

### Customizing the AI Prompt

You can customize the AI's behavior by editing the system prompt file at:
```
server/utils/copilot-implementation-agent.md
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Don't forget to set the `NUXT_HF_TOKEN` environment variable in your deployment platform.

For cloud sync, also add:
- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_ANON_KEY`

And configure OAuth redirect URLs in Supabase to include your production domain.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using [Nuxt 3](https://nuxt.com) and [Hugging Face](https://huggingface.co/)
