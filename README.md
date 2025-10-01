# CinePath: Your Personalized Media Tracking Dashboard

**CinePath** is a modern, full-stack web application designed to help enthusiasts track their movie and TV show viewing history, organize their watchlist, and analyze their consumption data. Built with Next.js, MongoDB, and focused on responsiveness, it provides a seamless and authenticated experience.

## 🚀 Live Demo & Repository

| Live Demo | Source Code |
| :---: | :---: |
| **[https://cine-path-hu2c.vercel.app/](https://cine-path-hu2c.vercel.app/)** | **https://github.com/mdafsar221b/CinePath** |

***

## ✨ Detailed Features

CinePath has been enhanced for reliability, performance, and user experience throughout development.

### 🎬 Core Tracking & Data Integrity
* **Robust TV Show Merging:** Implements sophisticated upsert logic using IMDb IDs to correctly merge new seasons and episodes into an existing TV show record, preventing duplicates and ensuring accurate season tracking.
* **Optimized Global Search:** Integrates the OMDb API for fast searching. Results return minimal data initially for speed, with full details fetched only when needed.
* **Watchlist Management:** Easily add content to your watchlist and seamlessly transition an item to your "Watched" lists.
* **Personalization:** Users can add personal ratings (1-10), write private notes, and mark content as a favorite.

### 📊 User Interface & Navigation
* **Personal Dashboard:** A dedicated modal displays comprehensive viewing statistics, including totals for all tracked media and yearly movie consumption breakdowns.
* **Responsive Sidebar:** A full-height, sliding sidebar provides centralized, intuitive navigation on mobile devices.
* **Filtering, Sorting & Pagination:** Efficiently manage large collections with genre filtering, multi-criteria sorting (rating, date added, title), and client-side pagination.

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

### Mobile View (Four Column Gallery)
| Landing Page | Tv Show Watched | Sidebar | Movies Watched |
| :---: | :---: | :---: | :---: |
| **Landing & Search** | **Tv-Show List** | **Full Sidebar Drawer** | **Movies List** |
| ![Mobile Landing Page](public/Screenshot%202025-10-01%20004904.png) | ![Mobile Movies Watched List](public/Screenshot%202025-10-01%20005004.png) | ![Mobile TV Shows Watched List](public/Screenshot%202025-10-01%20005038.png) | ![Mobile Sidebar Menu](public/Screenshot%202025-10-01%20004952.png) |

***

## 🛠️ Installation Guide

### Prerequisites
1.  **Node.js (>= 18.17.0)**
2.  **MongoDB:** A connection string for a MongoDB instance.
3.  **OMDb API Key:** Obtain a free key from [OMDb API](http://www.omdbapi.com/) for content searching.

### Step 1: Clone the repository

```bash
git clone [INSERT REPO URL HERE]
cd cinepath
