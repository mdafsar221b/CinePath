# CinePath: Your Personalized Media Tracking Dashboard

**CinePath** is a modern, full-stack web application designed to help enthusiasts track their movie and TV show viewing history, organize their watchlist, and analyze their consumption data. Built with Next.js, MongoDB, and focused on responsiveness, it provides a seamless and authenticated experience.

## 🚀 Live Demo & Repository

| Live Demo | Source Code |
| :---: | :---: |
| **[https://cine-path-hu2c.vercel.app/](https://cine-path-hu2c.vercel.app/)** | **https://github.com/mdafsar221b/CinePath** |

***

## 📸 Screenshots

The following images showcase the application's current design and functionality across desktop and mobile views. *Note: Images are referenced from the repository's `/public` folder.*

### Desktop View
| Section | Description | Screenshot |
| :---: | :---: | :---: |
| **Landing/Hero Page** | The hero section with personalized greeting and global search input. | ![Desktop Landing Page](public/Screenshot%202025-10-01%20004639.png) |
| **Movies Watched List** | List view of tracked movies with ratings and sort controls. | ![Desktop Movies Watched List](public/Screenshot%202025-10-01%20004655.png) |
| **TV Shows Watched List** | List view of tracked TV shows showing season/episode counts. | ![Desktop TV Shows Watched List](public/Screenshot%202025-10-01%20004817.png) |
| **Dashboard Stats** | The modal showing viewing statistics and consumption totals. | ![Desktop Dashboard Statistics](public/Screenshot%202025-10-01%20004837.png) |

### Mobile View
| Landing Page | Tv Show Watched | Sidebar | Movies Watched |
| :---: | :---: | :---: | :---: |
| **Landing & Search** | **Tv-Show List** | **Full Sidebar Drawer** | **Movies List** |
| ![Mobile Landing Page](public/Screenshot%202025-10-01%20004904.png) | ![Mobile Movies Watched List](public/Screenshot%202025-10-01%20005004.png) | ![Mobile TV Shows Watched List](public/Screenshot%202025-10-01%20005038.png) | ![Mobile Sidebar Menu](public/Screenshot%202025-10-01%20004952.png) |

***
================================
              🛠️ Installation Guide  ================================

PREREQUISITES
-------------
1. Node.js (>= 18.17.0)
2. MongoDB: A connection string for a MongoDB instance
3. OMDb API Key: Obtain a free key from http://www.omdbapi.com/

----------------------------------------------------
STEP 1: Clone the repository
----------------------------------------------------
git clone https://github.com/mdafsar221b/CinePath
cd cinepath

----------------------------------------------------
STEP 2: Install Dependencies
----------------------------------------------------
# Using npm
npm install

# Or using yarn
yarn install

----------------------------------------------------
STEP 3: Set Up Environment Variables
----------------------------------------------------
# Create a file named `.env.local` in the root directory.
# This file is ignored by Git.

Example `.env.local`:

MONGODB_URI="<YOUR_MONGO_CONNECTION_STRING>"
NEXTAUTH_SECRET="<A_VERY_LONG_RANDOM_SECRET_STRING>"
OMDB_API_KEY="<YOUR_OMDB_API_KEY>"
MONGODB_DB="cinepath"

----------------------------------------------------
STEP 4: Run the Development Server
----------------------------------------------------
# Using npm
npm run dev

# Or using yarn
yarn dev

----------------------------------------------------
ACCESS THE APP
----------------------------------------------------
http://localhost:3000

