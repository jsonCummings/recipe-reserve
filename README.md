# Recipe Reserve
![image](https://github.com/user-attachments/assets/f75fb3b8-cff9-4de1-abe7-3aeb7a15aded)

## Work in progress
A minimal, design-led web app for saving your favorite recipes and planning meals for the week. Built to explore custom design systems, UX patterns, and modern front-end architecture.

[View full project write-up →](https://www.jasoncummings.com/projects/recipes)

---

## Features

- Save and browse personal recipes
- Tagging, ratings, and metadata like cook time + servings
- Searchable and filterable list view
- Responsive UI
- #todo Google Sign-In authentication


---

## Tech Stack

- React (w/ React Router)
- Vite
- Express + Node.js
- Auth TBD

---

## 🚀 Getting Started

Clone and run locally:

```bash
git clone https://github.com/jsonCummings/recipe-reserve.git
cd recipe-reserve
npm install
npm run dev
```
You'll also need a .env file in the server folder and a mysql db to store the recipes
```
PORT=5050
DB_HOST=localhost
DB_USER={USERNAME}
DB_PASS={PASSWORD}
DB_NAME={NAME}
```
