# AKR.dev

A personal knowledge base and portfolio website built with HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and professional design with smooth animations
- **Portfolio Section**: Showcase your projects and work
- **Knowledge Base**: Share articles, tutorials, and insights
- **Contact Information**: Easy ways for people to get in touch

## Project Structure

```
AKR.dev/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript for interactivity
├── README.md       # Documentation
└── LICENSE         # GPL-3.0 License
```

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/AKR-code/AKR.dev.git
   cd AKR.dev
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   
   # On Windows
   start index.html
   ```

   Or use a local development server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (npx)
   npx serve
   ```

3. Visit `http://localhost:8000` in your browser

### Deployment

This is a static website and can be deployed to various platforms:

#### GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Select the branch (main) and root directory
4. Click "Save"
5. Your site will be available at `https://akr-code.github.io/AKR.dev/`

#### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command to empty (static site)
3. Set publish directory to `/`
4. Deploy!

#### Vercel

1. Import your GitHub repository
2. No build configuration needed
3. Deploy!

## Customization

### Update Content

Edit `index.html` to customize:
- Personal information in the About section
- Projects in the Projects section
- Knowledge base articles
- Contact information

### Modify Styling

Edit `styles.css` to change:
- Colors (update CSS variables in `:root`)
- Fonts
- Layout and spacing
- Animations

### Add Functionality

Edit `script.js` to add:
- Additional interactive features
- Form handling
- Dynamic content loading

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Vanilla JS for interactivity
- **No frameworks**: Lightweight and fast

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork this repository and customize it for your own use!

## Contact

- GitHub: [@AKR-code](https://github.com/AKR-code)
- Website: [AKR.dev](https://akr-code.github.io/AKR.dev/)
