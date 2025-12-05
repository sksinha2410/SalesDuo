# Contributing to SalesDuo

Thank you for your interest in contributing to SalesDuo! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/SalesDuo.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m "Add your descriptive commit message"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

Follow the setup instructions in the README.md file. We recommend using the setup script:

```bash
./setup.sh
```

## Code Style

### Backend (Node.js)
- Use ES6+ features
- Use async/await for asynchronous operations
- Follow the existing code structure
- Add comments for complex logic
- Handle errors gracefully

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Keep components focused and reusable
- Use meaningful variable and function names
- Add PropTypes or TypeScript types if possible

### General
- Use consistent indentation (2 spaces)
- Add meaningful commit messages
- Keep pull requests focused on a single feature or fix

## Testing

Before submitting a pull request:

1. Test the backend endpoints
2. Build the frontend without errors: `npm run build`
3. Verify the UI works as expected
4. Test error handling scenarios

## Pull Request Guidelines

1. Ensure your code follows the project's code style
2. Update documentation if you're adding new features
3. Add tests if applicable
4. Ensure all existing tests pass
5. Provide a clear description of the changes
6. Reference any related issues

## Feature Requests

If you have ideas for new features:

1. Check if the feature has already been requested in Issues
2. Create a new issue with the "enhancement" label
3. Describe the feature and its benefits
4. Discuss the implementation approach

## Bug Reports

When reporting bugs:

1. Check if the bug has already been reported
2. Create a new issue with the "bug" label
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

## Areas for Contribution

Here are some areas where contributions are welcome:

### Backend
- Improved scraping reliability
- Additional AI model support (Google Gemini, Claude, etc.)
- Rate limiting and caching
- API authentication
- Batch processing
- Export functionality

### Frontend
- Improved UI/UX
- A/B testing suggestions
- Advanced filtering and search
- Mobile app version
- Accessibility improvements

### Infrastructure
- Docker improvements
- CI/CD pipeline
- Automated testing
- Performance monitoring
- Error tracking

### Documentation
- Tutorial videos
- Use case examples
- API documentation
- Translation to other languages

## License

By contributing to SalesDuo, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing, feel free to open an issue with the "question" label.

Thank you for contributing to SalesDuo!
