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

## Publishing your own copy to GitHub

If you started from a local folder and want to push it to a brand-new GitHub repository so that you (or collaborators) can clone it later, follow these exact steps:

1. **Create a repository on GitHub**
   * Visit <https://github.com/new> and make a repository (no need to initialize it with a README—this project already has one).
   * Copy the HTTPS URL GitHub shows you, e.g. `https://github.com/<your-username>/codevibing.git`.

2. **Wire up your local project to that remote** (run these in your project folder):
   ```bash
   git init               # only if the folder is not already a git repo
   git remote add origin https://github.com/<your-username>/codevibing.git
   git branch -M main     # optional, makes sure your default branch is "main"
   git push -u origin main
   ```
   The `git push` command uploads everything to GitHub. If you already had commits locally, this publishes them; if not, run `git add .` and `git commit -m "Initial commit"` before pushing.

3. **Verify the connection**
   ```bash
   git remote -v
   ```
   You should see your GitHub URL listed twice (for `fetch` and `push`).

4. **Clone it elsewhere**
   ```bash
   git clone https://github.com/<your-username>/codevibing.git
   ```
   Replace `<your-username>` with your GitHub handle. You can now run the Getting Started steps on any machine.

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

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
