# Certificate Generator

A Next.js application for creating customizable certificates with drag-and-drop functionality, text customization, and image exports.

## Features

- 🔐 User authentication (demo credentials)
- 🖼️ Certificate template selection
- ✏️ Draggable text elements
- 🎨 Text customization (font, color, size)
- 📥 Export to PNG format
- 🌗 Dark/Light mode support
- 🎯 Drag-and-drop positioning
- 💾 Real-time preview

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [html2canvas](https://html2canvas.hertzen.com/)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
certificate-generator/
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn components
│   │   ├── auth/              # Authentication components
│   │   ├── certificate/       # Certificate generation components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── styles/               # Global styles
```

## Usage

1. Login with demo credentials
2. Select or upload a certificate template
3. Add customizable text elements
4. Drag elements to position
5. Customize text properties (font, color, size)
6. Download the final certificate as PNG

## Development

```bash
# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
