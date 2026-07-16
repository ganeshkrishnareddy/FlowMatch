# Contributing to FlowMatch

Thank you for your interest in contributing to FlowMatch. Your contributions help make workflow discovery better for everyone. This guide will help you get started.

## How to Contribute

1. **Fork** the repository on GitHub.
2. **Branch** from `main` with a descriptive name (e.g., `feature/add-search-filter` or `fix/template-scoring`).
3. **Commit** your changes following the commit message format below.
4. **Push** your branch and open a **Pull Request** against `main`.

## Development Setup

```bash
# Clone your fork
git clone https://github.com/<your-username>/flowmatch-ai.git
cd flowmatch-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Code Style Guidelines

- **TypeScript** is required for all source files. Avoid using `any` where possible.
- **React functional components** with hooks are the standard. Do not use class components.
- **TailwindCSS** is used for styling. Avoid inline styles and custom CSS unless absolutely necessary.
- Use named exports for components and utilities.
- Keep components small and focused on a single responsibility.
- Write descriptive variable and function names.

## Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat` -- A new feature
- `fix` -- A bug fix
- `docs` -- Documentation changes
- `style` -- Formatting changes (no code logic changes)
- `refactor` -- Code restructuring without feature or bug changes
- `test` -- Adding or updating tests
- `chore` -- Maintenance tasks (dependencies, build config)

**Examples:**

```
feat(search): add category filter to template search
fix(scanner): resolve false positives in secret detection
docs(readme): update installation instructions
```

## Pull Request Process

1. Ensure your branch is up to date with `main` before opening a PR.
2. Provide a clear title and description of the changes.
3. Reference any related issues (e.g., `Closes #42`).
4. Verify that all existing tests pass and add tests for new functionality.
5. Keep pull requests focused. Submit separate PRs for unrelated changes.
6. A maintainer will review your PR and may request changes before merging.

## Reporting Bugs

If you find a bug, please open a GitHub issue and include:

- A clear and descriptive title.
- Steps to reproduce the issue.
- Expected behavior vs. actual behavior.
- Browser and operating system details.
- Screenshots or console output, if applicable.

## Suggesting Features

Feature suggestions are welcome. Please open a GitHub issue with:

- A clear description of the proposed feature.
- The problem it solves or the use case it addresses.
- Any implementation ideas you have in mind.

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

---

Thank you for helping improve FlowMatch.
