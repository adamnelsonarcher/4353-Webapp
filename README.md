# Group 1, Web App
This is a how-to for my group, I hope you guys read this lol

## Assignment 2 Completion Status

### Completed Features
- Login system (demo with localStorage)
- User Registration (email + password)
- User Profile Management with:
  - Personal info (name, address, etc.)
  - Skills selection
  - Availability system (with time slots!)
  - Form validation
- Responsive design
- Event management form
- volunteer matching form
- notification system
- volunteer history

### Still Needed
1. Completed report 

## Quick Start

1. Clone the repo

2. Install dependencies:
```bash
npm install
```

3. Run local devevlopment server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

Here's how our code is organized (please follow this structure when adding new features):
Pretty much everything is in the `src/app` folder, and the `page.tsx` is the homepage.
The rest of the folders are pretty self-explanatory.
```
src/
├── app/                    
│   ├── volunteer/         # All volunteer stuff
│   │   ├── dashboard/     
│   │   ├── login/        
│   │   ├── profile/      # Profile management
│   │   └── register/     
│   ├── organization/     # Admin/Org stuff (needs work)
│   │   ├── dashboard/    
│   │   ├── login/       
│   │   └── register/    
│   └── page.tsx          # Homepage
```

## Tech Stack

We're using:
- Next.js 14 (latest version)
- TypeScript (for type safety)
- Tailwind CSS (for styling)
- Geist Font (looks nice)

## Development Guidelines

### How to Add New Features
1. Create a new branch for your feature (if the feature is major)
2. Follow the existing code structure
3. Use TypeScript
4. Use Tailwind classes for styling
5. Test your changes locally before pushing
6. Merge into production, only do this after checking with another person

### Styling
- Check `src/styles/components.css` for reusable classes
- Follow the design system in `globals.css`
- Use the existing UI components when possible

### State Management
- Using React's useState for now
- localStorage for demo data
- No backend needed for this assignment
