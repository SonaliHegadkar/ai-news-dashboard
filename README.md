NewsAI — AI News Classification App

A React application that displays news articles and automatically classifies each one using AI-style keyword logic. 

1) Setup Steps

  i)  Make sure Node.js is installed
       Download from [https://nodejs.org](https://nodejs.org) if you don't have it.

  ii) Open the project folder in terminal
     cd Amazonapp

  iii)  Install all dependencies
          npm create vite@latest
          npm install


2. install Tailwind css

  npm install tailwindcss @tailwindcss/vite
  import in vite.config.ts
    import tailwindcss from '@tailwindcss/vite'

  index.css
   @import "tailwindcss";


   4. Install Axios

      Run this command in your project folder:
       npm install axios


    5.Install GSAP

       Run this in your project folder:
       npm install gsap
  

4. Start the development server
    npm run dev
5. Open in browser
http://localhost:5173

That's it — the app runs fully offline. No API key needed.


1. Fetch news → fetchNews()
2. Store articles → useState
3. Show skeleton → loading: true
4. Classify articles → classifyArticle()
5. Update UI one-by-one
6. Apply filters → search + dropdowns
7. Render cards → NewsCard
8. Click → Detail Page

Approach Explanation

1. What does the app do?

The app shows 25 news articles as cards. When the page loads, each article is sent to an AI classifier that reads the title and description, then returns a JSON object with 4 labels — Category, Type, FocusArea, and Region. While waiting for the AI response, the card shows a skeleton loader. Once classified, the card animates in with the colored badges."

2. How does the AI classification work?

Since there's no real AI API, I simulated one using `setTimeout` to mimic network delay. Inside the classifier, I check the article text against keyword lists — for example, if the title contains 'Tesla' or 'EV', it's classified as Automotive. The function always returns the same JSON shape the assignment asked for:

3. How is state managed?

I used React's useState for all filters — search text, category, region, and focus area. All four filters run together on every render using a simple .filter() on the articles array. There's no Redux or external library — just clean, readable React hooks."


4. What is the custom hook doing?

The useNewsClassification hook is responsible for one thing — loading articles and classifying them. It starts all 25 articles with loading: true, then fires off async classification calls for each one independently. As each one finishes, it updates just that article in state. This gives a staggered loading effect where cards appear one by one as they get classified.

5.  animations done?

I used GSAP for all animations. The header text uses a stagger animation — each element fades in and slides up one after another. The rotating word in the title does a 3D flip using `rotateX`. Each news card animates in with a scale + fade when its classification is ready. Cards also have a magnetic tilt effect on hover — the card tilts slightly based on where your mouse is.


6. What about dark and light mode?

There's a single `darkMode` boolean in state at the top of `App.jsx`. It gets passed down as a prop to every component. Each component uses it to switch between two sets of Tailwind classes — one for dark, one for light. No CSS variables or context needed — it's simple and easy to trace.

 This project is a React-based AI News Dashboard where I fetch live news articles using Axios. I built a custom hook to handle asynchronous fetching and classification using a keyword-based AI simulation. Each article is classified into category, type, focus area, and region. While classification is in progress, skeleton loaders are shown. I implemented advanced UI features like GSAP animations, 3D card tilt effects, shimmer effects, and dynamic filtering. Users can search and filter articles, and navigate to detailed views using React Router. The architecture is modular, scalable, and handles loading and error states efficiently




