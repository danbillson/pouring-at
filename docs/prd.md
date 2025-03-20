# Product Requirement Document

This is the first pass of the PRD from ChatPRD

### **TL;DR**

A web app for craft beer enthusiasts to locate their favorite beers and breweries while exploring new cities. The community-driven platform enables users to create and update tap lists for bars. Verified bars gain higher visibility and access to insights and analytics.

---

## **Goals**

### **Business Goals**

- Expand into 5 major cities within the first year.
- Achieve 100,000 active users in the first six months.
- Establish partnerships with 50 breweries and 200 bars.
- Increase in-app promotions and ad revenue by 20% quarterly.

### **User Goals**

- Enable users to easily find and discover new beers and breweries.
- Provide seamless integration for users to update tap lists.
- Offer personalized suggestions based on user preferences.
- Facilitate community engagement with reviews and ratings.

### **Non-Goals**

- Avoid focusing on international expansion initially.
- Do not integrate e-commerce features for beer purchases.
- Exclude non-beer-related content or partnerships.

---

## **User Stories**

- **Brewery User:**

  - As a Brewery, I want to create a brewery account, so that I can manage my brewery's online presence on the platform.
  - As a Brewery, I want to add detailed information about my brewery, so that beer explorers can learn more about us.
  - As a Brewery, I want to easily add beers we produce, including importing from a CSV, so that I can quickly populate our beer catalog.
  - As a Brewery, I want to see statistics on my beers, such as ratings and popularity, so that I can understand how they are performing with consumers.

- **Bar Manager User:**

  - As a Bar Manager, I want to create a bar account and claim a unique slug for my bar, so that customers can easily find us online.
  - As a Bar Manager, I want to manage my bar's details and tap list, so that beer explorers have up-to-date information about our offerings.
  - As a Bar Manager, I want to easily set up my tap list by selecting from existing beers or adding new ones, so that the process is efficient and comprehensive.
  - As a Bar Manager, I want to track the performance and ROI of beers on tap, including how long they were tapped, so that I can optimize my beer selection and inventory.

- **Beer Explorer User:**
  - As a Beer Explorer, I want to search for bars that have specific beers on tap by location, beer style, or brewery, so that I can find places serving the beers I enjoy.
  - As a Beer Explorer, I want to create a personal account and profile, so that I can build a community and share my beer experiences.
  - As a Beer Explorer, I want to connect with friends on the platform, so that we can share beer recommendations and experiences.
  - As a Beer Explorer, I want to easily check in beers I'm drinking at a bar, so that I can contribute to the community and track my beer journey.
  - As a Beer Explorer, when checking in a beer at a bar, I want to be able to add it to the bar's tap list if it's not already listed, so that the tap list remains accurate and community-driven.
  - As a Beer Explorer, I want to be able to check in beers I drink from cans or bottles, independent of bar tap lists, so that I can log all my beer experiences.
  - As a Beer Explorer, I want to rate beers I've tried, so that I can share my opinion and help others discover great beers.

---

## **Functional Requirements**

- **User Accounts and Profiles** (Priority: High)

  - Registration/login for Brewery, Bar Manager, and Beer Explorer account types
  - Profile creation and management for each account type, including specific fields relevant to each persona
  - Social connection features for Beer Explorer accounts to connect with friends

- **Brewery Management** (Priority: Medium)

  - Brewery account creation and profile management
  - Beer catalog management: ability to add, edit, and remove beers associated with the brewery
  - Bulk beer import functionality (e.g., CSV upload)
  - Analytics dashboard for breweries to view beer ratings and popularity metrics

- **Bar Management** (Priority: High)

  - Bar account creation and claiming process with unique slug assignment
  - Bar profile management, including address, hours, contact information, etc.
  - Tap List Management:
    - Interface for bar managers to create and update tap lists
    - Beer search functionality to add existing beers to the tap list
    - Functionality to add new beers to the system if not found in the database
    - Display of current tap list on the bar's profile
  - Tap List Performance Analytics: tracking metrics like duration beer is tapped and potentially ROI

- **Beer Discovery and Search** (Priority: High)

  - Advanced search functionality for Beer Explorers to find bars and beers based on:
    - Location (using geolocation or user-defined location)
    - Beer style
    - Brewery
  - Display search results with bar locations, beer styles, and brewery information

- **Community Features & Beer Check-ins** (Priority: High)

  - Beer check-in functionality for Beer Explorers, associated with:
    - Bars (for on-tap beers)
    - General check-ins (for cans/bottles)
  - Beer rating system (star-based or similar)
  - Option for Beer Explorers to suggest adding a beer to a bar's tap list during check-in if it's missing

- **Data & Reporting** (Priority: Medium)
  - Aggregated beer ratings and reviews visible to all user types
  - Reporting and analytics dashboards for Bar Managers (tap list performance) and Breweries (beer performance)

## **User Experience**

- **Entry Point & First-Time User Experience**

  - Users can discover the platform through targeted ads, partnerships, app stores, or word of mouth
  - Onboarding includes a role selection (Brewery, Bar Manager, Beer Explorer) to tailor the initial experience
  - A brief tutorial specific to the selected role will guide users through the key features relevant to them

- **Core Experience - Brewery**

  - **Step 1: Brewery Account Creation & Profile Setup**

    - Select "Brewery" during onboarding
    - Registration/login via email or social media
    - Guided brewery profile creation:
      - Brewery name, location, description, website, social media links
      - Option to upload brewery logo
    - Clear UI for inputting brewery details

  - **Step 2: Beer Management - Initial Beer Upload (CSV)**

    - Navigate to "Beers" section in the brewery dashboard
    - Prominent "Import Beers via CSV" button
    - Downloadable CSV template with required fields
    - Drag-and-drop or file upload for CSV
    - Preview of data import with error handling
    - Confirmation and successful beer import notification

  - **Step 3: Beer Management - Individual Beer Addition/Editing**

    - Option to "Add New Beer" individually
    - Form with fields for beer details
    - Image upload for beer label (optional)
    - Beer listing page displaying all brewery beers with edit/delete actions

  - **Step 4: Stats and Analytics Dashboard**
    - Access to a dedicated "Stats" or "Analytics" dashboard
    - Key metrics displayed: Beer ratings, check-ins, price data
    - Visualizations for easy data interpretation
    - Option to filter stats by beer and time period

- **Core Experience - Bar Manager**

  - **Step 1: Bar Account Creation & Profile Setup**

    - Select "Bar Manager" during onboarding
    - Registration/login via email or social media
    - Guided bar profile creation with unique slug
    - Upload bar logo and images

  - **Step 2: Tap List Management - Setup**

    - Navigate to "Tap List" section in dashboard
    - Search functionality to find existing beers
    - Option to add new beers if not found
    - Drag-and-drop interface for tap list order

  - **Step 3: Tap List Management - Ongoing Updates**

    - Easy access to "Edit Tap List"
    - Quick actions for beer management
    - Real-time tap list updates
    - Mark beers as "Tapped Out" or "Coming Soon"

  - **Step 4: Performance and ROI Tracking**
    - Access to analytics dashboard
    - Track beer popularity and tap duration
    - Data visualization for insights

- **Core Experience - Beer Explorer**

  - **Step 1: Beer Explorer Account Creation & Profile Setup**

    - Select "Beer Explorer" during onboarding
    - Basic profile creation
    - Option to connect with friends

  - **Step 2: Discovering Bars and Beers**

    - Prominent search functionality
    - Location-based discovery
    - Multiple view options (map/list)

  - **Step 3: Beer Check-in and Rating**

    - Location-aware bar selection
    - View tap lists
    - Check-in and rate beers
    - Share activity with friends
    - Separate flow for can/bottle check-ins

  - **Step 4: Social Features and Profile**

    - Connect with other Beer Explorers
    - Activity feed
    - Personal profile with history
    - Create wishlists and to-try lists

  - **Step 5: Suggesting Tap List Updates**
    - Option to suggest missing beers
    - Bar manager notification system
    - Review and approval process

- **Advanced Features & Edge Cases**

  - User-friendly error states
  - Alert system for new beers
  - Robust search with typo handling
  - Community moderation features

- **UI/UX Highlights**
  - Clean, modern design
  - Responsive for all devices
  - Intuitive navigation
  - Accessibility-focused
  - Efficient core actions
  - Future gamification potential

---

## **Narrative**

Pouring.at addresses the quintessential challenge faced by craft beer enthusiasts: finding beloved brews in unfamiliar locales. As travelers navigate new cities, pouring.at becomes their personal guide, seamlessly connecting them to local breweries and bars that reflect their tastes. Using a community-driven approach, users collaboratively curate tap lists, rate experiences, and share discoveries, forming a vibrant network of beer lovers. Participating bars and breweries benefit by verifying their presence on pouring.at, gaining heightened visibility and access to valuable insights and analytics. This synergy not only enriches the user's journey but also amplifies business opportunities for bars eager to welcome craft beer connoisseurs.

---

## **Success Metrics**

### **User-Centric Metrics**

- User growth rate: 20% month-over-month.
- Average session duration to exceed 10 minutes.
- User retention rate above 70%.

### **Business Metrics**

- Bar sign-ups: 500 in the first three months.
- In-app promotion revenue increases by 15% quarterly.

### **Technical Metrics**

- Server uptime exceeding 99.5%.
- Page load time below 2 seconds on average.

### **Tracking Plan**

- Monitor user registration rates.
- Track search query types and frequency.
- Measure bar claim and verification success rate.

---

## **Technical Considerations**

### **Technical Needs**

- API integration for a global beer database.
- Front-end and back-end components with a robust framework.
- Scalable cloud infrastructure for hosting.

### **Integration Points**

- Third-party location services for mapping.
- Partnership APIs with major breweries.

### **Data Storage & Privacy**

- Compliant data storage solutions with encryption.
- User consent management for data collection.

### **Scalability & Performance**

- Expect peak loads during weekends and regional beer festivals.
- Optimize for 10,000 concurrent users.

### **Potential Challenges**

- Ensuring data accuracy given the community-driven model.
- Managing privacy concerns with user-generated content.

---

## **Milestones & Sequencing**

### **Project Estimate**

- Extra-small: Initial workshop and prototyping (1 week).
- Small: MVP development (2 weeks).
- Medium: User testing and feedback iteration (3 weeks).
- Large: Full feature development and marketing launch (4–8 weeks).

### **Team Size & Composition**

- Me

### **Suggested Phases**

**Phase 1: MVP Development (2 Weeks)**

- Key Deliverables: Basic user accounts, search functionality.
- Dependencies: Design prototypes.

**Phase 2: User Testing and Iterations (3 Weeks)**

- Key Deliverables: User feedback, initial adjustments.
- Dependencies: MVP release.

**Phase 3: Marketing and Launch (4 Weeks)**

- Key Deliverables: Public launch, marketing campaigns.
- Dependencies: Completed user testing.
