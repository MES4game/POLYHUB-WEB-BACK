# ET4-PROJET-WEB-BACK

Copyright (c) 2025 Maxime DAUPHIN, Maël HOUPLINE, Julien TAP. All rights reserved.
Licensed under the MIT License. See LICENSE file for details.

Back-end repository of project "PolyHUB" for ET4 web project.

---

## Structure
- `db-init.sql`: SQL script to initialize the database (create tables, etc.)
- `src`: source code (Express app, routes, controllers, models, etc.)
- `build`: built files for production (after running `npm run build`)

---

## Customization

Modify files in `src` folder to customize the application.
Do not forget to update the database schema manually if necessary, and `db-init.sql` for future initializations.

---

## Commands
- `npm run lint` : lint the code with ESLint (automatically run before `dev` and `build`)
- `npm run dev` : run the application in development mode
- `npm run build` : build the application for production (automatically run before `start`)
- `npm run start` : run the application in production mode
