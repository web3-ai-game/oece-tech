# Digital Nomad Compass - Project Blueprint

This document outlines the core concepts, features, and monetization strategy for the "Digital Nomad Compass" (Urban Prowler) project.

## 1. Core Concept & Positioning

- **Target Audience**: Digital nomads, remote workers, and individuals interested in geographic arbitrage and tech-driven travel.
- **Core Slogan**: "Negotiating with Time through Physical Distance" (用物理距離和時間談判).
- **Primary Goal**: To become a premium, paid knowledge community that empowers users to save money, enhance security, and improve their remote work/travel lifestyle.
- **Visual Style**: A fusion of high-res pixel art, cyberpunk aesthetics, and retro-futuristic UI/UX, optimized for a mobile-first experience.

## 2. Feature-Set & Content Strategy

### 2.1 Public-Facing Content (Homepage)

- **Featured Articles**: A limited selection of 6 articles. The "More >>" button will redirect to the login page, prompting users to register.
- **Featured AI Tools**: A limited selection of 6 AI tools. The "More >>" button will also redirect to the login page.
- **Hero Banner**: A large, cyberpunk-themed banner with the core slogan.
- **PRO Membership Card**: An informational card explaining the benefits of a PRO membership.
- **BBS Preview Card**: A teaser card hinting at an exclusive, members-only BBS forum, which also leads to the login/registration page.

### 2.2 Members-Only Content (Post-Login)

- **Full Article Access**: Registered "Free Tier" members can view all articles in the "Data Fort."
- **BBS Forum**: A private, retro-style BBS forum accessible from the user's dashboard. This is a core feature for community building.
- **User Dashboard**: The central hub for registered users, providing access to the BBS, profile settings, and invitation code management.

### 2.3 PRO Membership ($5/month)

PRO members get access to all "Free Tier" features, plus:

- **Exclusive AI Tools**: Access to premium, powerful AI tools within the "AI Arsenal."
- **In-Depth Content**: Access to exclusive "PRO-only" articles and guides.
- **PRO Telegram Channel**: Access to a private, curated Telegram channel for high-quality discussions with fellow PRO members.
- **AI-Powered Telegram Bot**:
  - A bot within the PRO channel, powered by Gemini 2.5 Flash.
  - The bot can be queried (`@bot`) to search the entire article database and provide answers.
  - It supports translation and long-context questions.
- **Invitation Codes**: PRO members receive an extra invitation code to bring a friend into the community.

## 3. Registration & User Tiers

### 3.1 Invitation Code System

- **Primary Registration Method**: New users **must** have an invitation code to register.
- **Code Distribution**:
  - Every new member receives **two** invitation codes upon successful registration.
  - Alternatively, a user can bypass the need for a code by directly purchasing a PRO membership ($5).
  - PRO members get an additional code.

### 3.2 User Tiers

1.  **Guest**: Can only view the homepage with its limited content.
2.  **Member (Free Tier)**: Registered via invitation code. Can access ~80% of the content, including all articles and the BBS forum.
3.  **PRO Member ($5/month)**: Full access to all content, exclusive AI tools, and the private Telegram community with its AI bot.

## 4. Technical Architecture

- **Frontend**: Next.js, React, Tailwind CSS, ShadCN UI components.
- **Backend (BaaS)**:
  - **Firebase Authentication**: For user sign-up (Email/Password, Google) and management.
  - **Cloud Firestore**:
    - To store user data (profiles, roles, invitation codes).
    - To power the BBS forum (posts, replies).
    - To act as a data source for the Telegram AI bot.
- **Generative AI**:
  - **Genkit**: For defining and managing AI flows.
  - **Google Gemini 2.5 Flash**: To power all AI tools and the Telegram bot, chosen for its balance of cost, performance, and context length.
- **Deployment**: Firebase Hosting. The free "Spark Plan" is sufficient for the initial phase.

This README serves as the project's constitution, guiding all future development efforts.
