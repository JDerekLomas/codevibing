# CodeVibing

A visual gallery of AI-generated React components and experiments. Share and explore creative coding with AI assistance.

## Features

- 🎨 Visual gallery of AI-generated projects
- 💻 Live React playground
- 🌟 Easy project sharing
- 📱 Responsive design
- 🎥 Auto-generated previews

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/JDerekLomas/codevibing.git
   cd codevibing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy .env.example to .env.local and add your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

## Project Structure

```
codevibing/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # Shared components
│   ├── lib/         # Utilities and shared code
│   └── data/        # Initial seed data
└── public/          # Static assets
```

## Deployment

Ready to deploy to production? See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

Quick deploy:
```bash
npm install -g vercel
vercel
```

Make sure to set your environment variables in Vercel:
- `ANTHROPIC_API_KEY` - Required for Claude integration
- `CLAUDE_MODEL` - Model name (optional)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.