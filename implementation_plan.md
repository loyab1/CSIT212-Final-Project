# AI Prompts Website Implementation Plan

The goal is to create and host a website entirely through AI prompting. The initial version of the website will contain two pages: a binary conversion calculator and a page logging all prompts and tasks. It will also be version-controlled with Git and deployed to GitHub Pages.

## User Review Required

> [!IMPORTANT]  
> Please review the proposed folder location and structure below. I am proposing to create this project inside the `/Users/workpc/Documents/Coding/GeminiTest/CSIT212Final` directory. Let me know if you would prefer a different location.
> 
> Also, to host it on GitHub Pages, you will need a GitHub account and an empty repository. I will initialize the Git repository locally and write the code, but you will need to provide the GitHub repository URL to push the code, or push it yourself once the files are ready.

## Open Questions

> [!NOTE]  
> 1. Do you already have a GitHub repository created for this project? If so, what is the clone URL (e.g., `https://github.com/yourusername/reponame.git`)?
> 2. What design aesthetic do you prefer? (e.g., dark mode, glassmorphism, minimalistic, vibrant colors)
> 3. Should the "AI Prompt" page format the logs as a simple list, a table, or something more interactive like a timeline?

## Proposed Changes

We will use standard HTML, CSS, and JavaScript, which perfectly suits GitHub Pages.

### Project Setup
- **Directory**: Initialize the project inside `/Users/workpc/Documents/Coding/GeminiTest/CSIT212Final` (or a dedicated folder).
- **Git**: Run `git init` to start version control.

### Core Website Files

#### [NEW] `index.html`
- The homepage containing the Binary Conversion Calculator (Base 2 to Decimal & Decimal to Base 2).
- Navigation links to the AI Prompt log page.

#### [NEW] `ai-prompts.html`
- A dedicated page to log every prompt given to the AI and the task performed.
- Will contain an initial log entry detailing this current prompt.

#### [NEW] `style.css`
- A premium, modern design aesthetic matching modern web standards (smooth animations, nice typography, interactive elements).

#### [NEW] `script.js`
- JavaScript logic to handle the binary-to-decimal and decimal-to-binary calculations.

## Verification Plan

### Automated Tests
- N/A for this static site.

### Manual Verification
- Start a local development server to test the calculator functionality and navigation.
- Commit the initial files to Git.
- (Pending your GitHub URL) Add the remote repository, push to `main`, and provide instructions on how to enable GitHub Pages in your repository settings.
