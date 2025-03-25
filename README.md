# Code Quality Analyzer

A lightweight, AI-powered code analysis tool that evaluates code quality for web development files (JavaScript/JSX/TypeScript and Python).


## Features

- **Instant Code Analysis**: Upload your code files and get immediate feedback
- **Comprehensive Scoring**: Get a total score out of 100 based on multiple quality criteria
- **Detailed Breakdown**: See individual scores across six key categories:
  - Naming Conventions (10 points)
  - Function Length & Modularity (20 points)
  - Comments & Documentation (20 points)
  - Code Formatting (15 points)
  - Reusability (15 points)
  - Best Practices (20 points)
- **Actionable Recommendations**: Receive specific suggestions to improve your code
- **Supports Multiple Languages**: Works with JavaScript, TypeScript, JSX, and Python files

## Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn UI
- **Backend**: Express.js (Node.js)
- **AI Integration**: Groq LLM API via LangChain
- **Python Service**: Custom code analysis service for detailed evaluations

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Python 3.10+ 
- Groq API key

### Environment Setup

1. Clone the repository
2. Create a `.env` file in the root directory with your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

### Installation

Install both JavaScript and Python dependencies:

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (for the analysis service)
pip install langchain-core langchain-groq
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5000.

## Usage

1. Open the application in your browser
2. Click on the upload area or drag and drop a code file
3. Wait for the analysis to complete (typically under 5 seconds)
4. View your code's quality score, category breakdown, and recommendations
5. Make the suggested improvements to your code
6. Upload again to see your improved score

For detailed usage instructions and how to interpret results, see the [Usage Guide](docs/usage-guide.md).

## CI Integration with GitHub Actions

You can add automatic code quality checks to your GitHub repositories using the provided GitHub Action. This will analyze your code on every pull request and commit to main.

1. Create a `.github/workflows` directory in your repository
2. Add the `code-quality.yml` file from this repository
3. Configure your Groq API key as a GitHub secret named `GROQ_API_KEY`

See the [GitHub Action Setup Guide](docs/github-action-setup.md) for detailed instructions.

The action will:
- Run on push to main and on pull requests
- Analyze all JavaScript, TypeScript, JSX, and Python files changed in the commit/PR
- Comment the results directly on the PR (for pull requests)
- Fail the check if the average score is below a configurable threshold

## How It Works

1. **File Upload**: Your code file is securely uploaded to the server
2. **Language Detection**: The system identifies the programming language
3. **AI Analysis**: The code is processed by a Groq large language model via LangChain
4. **Scoring Calculation**: Detailed scores are calculated across six categories
5. **Recommendation Generation**: Actionable advice is provided to improve the code

## Scoring Criteria

### Naming Conventions (10 points)
- Descriptive variable/function names
- Consistent naming style (camelCase, snake_case, etc.)
- Avoidance of cryptic abbreviations

### Modularity (20 points)
- Function/method size (shorter is better)
- Single responsibility principle
- Separation of concerns

### Documentation (20 points)
- Function/class docstrings
- Inline comments for complex logic
- Clarity and completeness

### Formatting (15 points)
- Consistent indentation
- Line length
- Spacing and line breaks

### Reusability (15 points)
- DRY (Don't Repeat Yourself) principle
- Modular components
- Clear interfaces

### Best Practices (20 points)
- Language-specific conventions
- Error handling
- Security considerations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## results

![Code Quality Analyzer](generated-icon.png)
![Code Quality Analyzer](generated-icon.png)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Groq](https://groq.com/) for their powerful and fast LLM API
- [LangChain](https://langchain.com/) for AI integration tools
- [Shadcn UI](https://ui.shadcn.com/) for React components
