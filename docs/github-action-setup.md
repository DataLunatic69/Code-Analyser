# Setting Up Code Quality Checks with GitHub Actions

This document explains how to integrate the Code Quality Analyzer with your GitHub repositories using GitHub Actions.

## Overview

The GitHub Action provided in this repository automatically runs code quality analysis on your JavaScript, TypeScript, JSX, and Python files whenever:

- A pull request is created or updated
- Code is pushed to the main branch

The action:
- Analyzes all changed files in the commit/PR
- Generates detailed reports for each file
- Posts a summary comment on PRs
- Fails the check if the average quality score is below a threshold (default: 60/100)
- Uploads full analysis results as artifacts

## Requirements

- A GitHub repository with JavaScript, TypeScript, JSX, and/or Python code
- A Groq API key (get one at [https://console.groq.com](https://console.groq.com))

## Setup Steps

### 1. Add the Workflow File to Your Repository

Copy the `.github/workflows/code-quality.yml` file from this repository to your own repository, keeping the same path.

### 2. Set Up the GROQ_API_KEY Secret

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Enter `GROQ_API_KEY` as the name
5. Paste your Groq API key as the value
6. Click "Add secret"

### 3. Customize Configuration (Optional)

You can customize the workflow by editing the `.github/workflows/code-quality.yml` file:

- **Minimum score threshold**: Change the `MIN_SCORE` value (default: 60)
- **File types**: Modify the file patterns in the `changed-files` step
- **Branch triggers**: Update the `on:` section to trigger on different branches

## How It Works

### Step 1: Detecting Changed Files

The workflow uses the [tj-actions/changed-files](https://github.com/tj-actions/changed-files) action to identify which files have changed in the current commit or PR.

### Step 2: Analysis

Each changed file that matches the specified patterns (*.js, *.jsx, *.ts, *.tsx, *.py) is analyzed using the Code Quality Analyzer tool. The analysis runs in the GitHub Actions environment, using the same Python service that powers the web application.

### Step 3: Reporting

The analysis generates several outputs:

- **Summary Markdown file**: An overview table with scores for all files
- **Individual Markdown files**: Detailed analysis for each file
- **JSON files**: Raw analysis data for each file

### Step 4: PR Comment

For pull requests, the action automatically adds a comment with the analysis summary, making it easy to review code quality without leaving GitHub.

### Step 5: Quality Gate

The action calculates the average score across all analyzed files and compares it to the minimum threshold (default: 60). If the average is below the threshold, the check fails.

### Step 6: Artifact Upload

All analysis results are uploaded as workflow artifacts, which can be downloaded from the GitHub Actions page for the workflow run.

## Example PR Comment

The action will add a comment like this to pull requests:

```markdown
# Code Quality Analysis Results

| File | Score | Naming | Modularity | Documentation | Formatting | Reusability | Best Practices |
| ---- | ----- | ------ | ---------- | ------------- | ---------- | ----------- | -------------- |
| src/components/Button.jsx | 85 | 8 | 18 | 17 | 13 | 12 | 17 |
| src/utils/formatting.js | 72 | 7 | 15 | 12 | 14 | 11 | 13 |
| server/api.py | 79 | 8 | 16 | 15 | 12 | 12 | 16 |

## Summary

- Files analyzed: 3
- Average score: 78 / 100
```

## Troubleshooting

### Missing GROQ_API_KEY Secret

If you see an error about missing the GROQ_API_KEY, make sure you've added it to your repository secrets.

### Python Dependency Issues

If you see errors about missing Python dependencies, check the workflow file to ensure all required packages are installed. You may need to add additional packages to the `pip install` command.

### Low Scores

If your workflow consistently fails due to low scores, consider:

1. Reviewing the detailed analysis reports to identify common issues
2. Adjusting the minimum score threshold in the workflow file
3. Implementing recommended improvements from the analysis reports

## Advanced Configuration

### Custom Scoring Thresholds

To change the minimum score threshold:

```yaml
- name: Check minimum score threshold
  if: steps.changed-files.outputs.any_changed == 'true'
  run: |
    AVG_SCORE=${{ steps.analyze.outputs.average_score }}
    MIN_SCORE=75  # Set your desired threshold here
    
    if [ $AVG_SCORE -lt $MIN_SCORE ]; then
      echo "Average code quality score ($AVG_SCORE) is below the minimum threshold ($MIN_SCORE)"
      exit 1
    else
      echo "Code quality check passed with average score: $AVG_SCORE"
    fi
```

### Ignoring Certain Files

To exclude certain files from analysis, add them to the `.gitignore` file or modify the file patterns in the workflow file.