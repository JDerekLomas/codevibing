import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';

// Example projects with placeholder image
const exampleProjects = [
  {
    id: '1',
    title: 'Animated Navigation Menu',
    description: 'A smooth animated navigation menu created with AI assistance. Features hover effects and mobile responsiveness.',
    screenshot: '/examples/placeholder.svg',
    demoUrl: '/playground#Y29uc3QgW2lzT3Blbiwgc2V0SXNPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTsKCnJldHVybiAoCiAgPG5hdiBjbGFzc05hbWU9InAtNCI+CiAgICA8ZGl2IGNsYXNzTmFtZT0iZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIj4KICAgICAgPGgxIGNsYXNzTmFtZT0idGV4dC14bCI+TG9nbzwvaDE+CiAgICAgIDxidXR0b24KICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc09wZW4oIWlzT3Blbil9CiAgICAgICAgY2xhc3NOYW1lPSJtZDpoaWRkZW4gcC0yIgogICAgICA+CiAgICAgICAgPHN2ZyB2aWV3Qm94PSIwIDAgMjAgMjAiIGNsYXNzTmFtZT0idy02IGgtNiI+CiAgICAgICAgICA8bGluZQogICAgICAgICAgICB4MT0iMyIgeTE9IjEwIiB4Mj0iMTciIHkyPSIxMCIKICAgICAgICAgICAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgICAgICAgICAgIHN0cm9rZVdpZHRoPSIyIgogICAgICAgICAgLz4KICAgICAgICA8L3N2Zz4KICAgICAgPC9idXR0b24+CiAgICA8L2Rpdj4KICAgIDx1bAogICAgICBjbGFzc05hbWU9e2BiZy13aGl0ZSBtZDpmbGV4IG1kOnNwYWNlLXgtNCBtZDpzdGF0aWMgYWJzb2x1dGUgbGVmdC0wIHJpZ2h0LTAgcC00IG10LTIgbWQ6bXQtMCB0cmFuc2l0aW9uLWFsbCAke2lzT3BlbiA/ICd2aXNpYmxlJyA6ICdoaWRkZW4gbWQ6dmlzaWJsZSd9YH0KICAgID4KICAgICAgPGxpPjxhIGhyZWY9IiMiPkhvbWU8L2E+PC9saT4KICAgICAgPGxpPjxhIGhyZWY9IiMiPkFib3V0PC9hPjwvbGk+CiAgICAgIDxsaT48YSBocmVmPSIjIj5TZXJ2aWNlczwvYT48L2xpPgogICAgICA8bGk+PGEgaHJlZj0iIyI+Q29udGFjdDwvYT48L2xpPgogICAgPC91bD4KICA8L25hdj4KKTs=',
    tags: ['React', 'Animation', 'Navigation', 'Claude'],
    authorName: 'Derek Lomas',
    createdAt: new Date('2025-02-07'),
  },
  {
    id: '2',
    title: 'Dynamic Form Builder',
    description: 'AI-generated form builder with validation, dynamic fields, and real-time preview.',
    screenshot: '/examples/placeholder.svg',
    demoUrl: '/playground#Y29uc3QgW2ZpZWxkcywgc2V0RmllbGRzXSA9IHVzZVN0YXRlKFtdKTsKY29uc3QgW2Zvcm1EYXRhLCBzZXRGb3JtRGF0YV0gPSB1c2VTdGF0ZSh7fSk7Cgpjb25zdCBhZGRGaWVsZCA9ICh0eXBlKSA9PiB7CiAgc2V0RmllbGRzKFsuLi5maWVsZHMsIHsKICAgIGlkOiBEYXRlLm5vdygpLnRvU3RyaW5nKCksCiAgICB0eXBlLAogICAgbGFiZWw6IGBOZXcgJHt0eXBlfWAsCiAgfV0pOwp9OwoKcmV0dXJuICgKICA8ZGl2IGNsYXNzTmFtZT0icC00Ij4KICAgIDxkaXYgY2xhc3NOYW1lPSJtYi00Ij4KICAgICAgPGJ1dHRvbgogICAgICAgIG9uQ2xpY2s9eygpID0+IGFkZEZpZWxkKCd0ZXh0Jyl9CiAgICAgICAgY2xhc3NOYW1lPSJiZy1ibHVlLTUwMCB0ZXh0LXdoaXRlIHB4LTQgcHktMiByb3VuZGVkIG1yLTIiCiAgICAgID4KICAgICAgICBBZGQgVGV4dCBGaWVsZAogICAgICA8L2J1dHRvbj4KICAgICAgPGJ1dHRvbgogICAgICAgIG9uQ2xpY2s9eygpID0+IGFkZEZpZWxkKCdzZWxlY3QnKX0KICAgICAgICBjbGFzc05hbWU9ImJnLWdyZWVuLTUwMCB0ZXh0LXdoaXRlIHB4LTQgcHktMiByb3VuZGVkIgogICAgICA+CiAgICAgICAgQWRkIFNlbGVjdCBGaWVsZAogICAgICA8L2J1dHRvbj4KICAgIDwvZGl2PgoKICAgIDxmb3JtIGNsYXNzTmFtZT0ic3BhY2UteS00Ij4KICAgICAge2ZpZWxkcy5tYXAoKGZpZWxkKSA9PiAoCiAgICAgICAgPGRpdiBrZXk9e2ZpZWxkLmlkfSBjbGFzc05hbWU9ImZsZXggZmxleC1jb2wiPgogICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT0ibWItMSI+e2ZpZWxkLmxhYmVsfTwvbGFiZWw+CiAgICAgICAgICB7ZmllbGQudHlwZSA9PT0gJ3RleHQnID8gKAogICAgICAgICAgICA8aW5wdXQKICAgICAgICAgICAgICB0eXBlPSJ0ZXh0IgogICAgICAgICAgICAgIGNsYXNzTmFtZT0iYm9yZGVyIHAtMiByb3VuZGVkIgogICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4KICAgICAgICAgICAgICAgIHNldEZvcm1EYXRhKHsuLi5mb3JtRGF0YSwgW2ZpZWxkLmlkXTogZS50YXJnZXQudmFsdWV9KQogICAgICAgICAgICAgIH0KICAgICAgICAgICAgLz4KICAgICAgICAgICkgOiAoCiAgICAgICAgICAgIDxzZWxlY3QKICAgICAgICAgICAgICBjbGFzc05hbWU9ImJvcmRlciBwLTIgcm91bmRlZCIKICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+CiAgICAgICAgICAgICAgICBzZXRGb3JtRGF0YSh7Li4uZm9ybURhdGEsIFtmaWVsZC5pZF06IGUudGFyZ2V0LnZhbHVlfSkKICAgICAgICAgICAgICB9CiAgICAgICAgICAgID4KICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiAxPC9vcHRpb24+CiAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gMjwvb3B0aW9uPgogICAgICAgICAgICA8L3NlbGVjdD4KICAgICAgICAgICl9CiAgICAgICAgPC9kaXY+CiAgICAgICkpfQogICAgPC9mb3JtPgogIDwvZGl2Pgop',
    tags: ['React', 'Forms', 'Dynamic UI', 'GitHub Copilot'],
    authorName: 'Derek Lomas',
    createdAt: new Date('2025-02-07'),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl tracking-tight">
              Code Vibing
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Share and explore AI-generated React components. Join the creative coding revolution.
            </p>
            <div className="mt-10">
              <Link
                href="/playground"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
              >
                Create New Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Projects</h2>
          <select className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
            <option value="latest">Latest</option>
            <option value="popular">Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Project Grid */}
        <div className="masonry-grid">
          {exampleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              screenshot={project.screenshot}
              demoUrl={project.demoUrl}
              tags={project.tags}
              authorName={project.authorName}
              createdAt={project.createdAt}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CodeVibing. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}