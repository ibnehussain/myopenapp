# Contributing to ShopEasy

Thank you for your interest in contributing to ShopEasy! We welcome contributions from the community.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/myopenapp.git
   cd myopenapp
   ```
3. **Create a branch** for your change:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

```bash
cd backend
pip install -r requirements.txt
python seed.py
python app.py
```

Open `frontend/index.html` in your browser to test the UI.

## How to Contribute

### Reporting Bugs

- Search [existing issues](https://github.com/ibnehussain/myopenapp/issues) before opening a new one.
- Include steps to reproduce, expected behaviour, and actual behaviour.
- Attach screenshots or error logs where helpful.

### Suggesting Features

- Open a [GitHub Discussion](https://github.com/ibnehussain/myopenapp/discussions) or issue with the label `enhancement`.
- Describe the problem it solves and your proposed solution.

### Submitting a Pull Request

1. Make your changes on your feature branch.
2. Keep commits focused and write clear commit messages:
   ```
   fix: correct cart subtotal calculation
   feat: add product search bar
   docs: update Azure deployment steps
   ```
3. Ensure the app runs without errors locally.
4. Push your branch and open a Pull Request against `main`.
5. Fill in the PR template — describe what changed and why.
6. A maintainer will review your PR. Please respond to feedback within a reasonable time.

## Code Style

- **Python**: Follow [PEP 8](https://peps.python.org/pep-0008/). Keep functions small and focused.
- **JavaScript**: Use `const`/`let`, avoid global state where possible, and escape HTML output.
- **HTML/CSS**: Keep markup semantic; use existing CSS variables in `style.css`.
- No external JS frameworks — keep the frontend dependency-free.

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure, no behaviour change |
| `chore:` | Build process, dependencies |

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

© 2026 Azhar Tech
