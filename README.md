# Personal Portfolio

This is a responsive, modern personal portfolio website built with HTML, CSS, and JavaScript.

## How to Deploy to GitHub Pages

GitHub Pages allows you to host this portfolio directly from your GitHub repository for free. Follow these steps to get your site live:

### Step 1: Initialize Git
If you haven't already, open a terminal in this folder and initialize a Git repository:
```bash
git init
git add .
git commit -m "Initial commit of my portfolio"
```

### Step 2: Create a GitHub Repository
1. Go to [GitHub](https://github.com/) and create a new repository.
2. **Important**: If you want the portfolio to be your main site (e.g., `https://yourusername.github.io`), you must name the repository exactly **`yourusername.github.io`** (replace `yourusername` with your actual GitHub username). 
3. If you name it something else (e.g., `portfolio`), it will be hosted at `https://yourusername.github.io/portfolio`.

### Step 3: Push Your Code
Link your local code to the GitHub repository and push it:
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```
*(Make sure to replace the URL with the one provided by GitHub for your new repository)*

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click on the **Settings** tab.
3. In the left sidebar, click on **Pages**.
4. Under **Build and deployment**, ensure **Source** is set to **Deploy from a branch**.
5. Under **Branch**, select `main` (or `master`) and click **Save**.
6. Wait a few minutes, and GitHub will provide you with a link to your live website at the top of the Pages settings!
