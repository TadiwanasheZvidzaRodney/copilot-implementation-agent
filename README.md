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
  <img src="https://img.shields.io/badge/Google_Gemini-000000?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
</p>

---

## ✨ Features

- 🚀 **AI-Powered Planning** - Leverages Google's Gemini 1.5 Flash model for intelligent plan generation
- 📋 **Phased Implementation** - Generates structured, chronological phases for project execution
- 🎨 **Beautiful UI** - Modern, dark-themed interface with Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 📝 **Markdown Rendering** - Professional formatting with syntax highlighting
- 📋 **Copy to Clipboard** - Easily copy generated plans for documentation

## 🛠️ Tech Stack

- **Framework:** Nuxt 3
- **Styling:** Tailwind CSS with Typography plugin
- **AI:** Google Generative AI (Gemini 1.5 Flash)
- **Markdown:** Marked.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key (free tier available)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Edit `.env` and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   > 💡 Get your free Gemini API key at [Google AI Studio](https://aistudio.google.com/apikey)

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
├── app.vue                    # Main application component
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── server/
│   ├── api/
│   │   └── plan.post.ts       # API endpoint for plan generation
│   └── utils/
│       └── copilot-implementation-agent.md  # AI system prompt
├── .env                       # Environment variables
└── package.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

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

Don't forget to set the `GEMINI_API_KEY` environment variable in your deployment platform.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using [Nuxt 3](https://nuxt.com) and [Google Gemini](https://deepmind.google/technologies/gemini/)
