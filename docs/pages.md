# Pages and Routes

This document outlines the route structure and key components for each page in the Pouring.at application, categorized by user role and access level.

## Public Pages

These pages are accessible to all users, including those not logged in.

### Homepage (`/`)

**Route:** `/`

**Key Components:**

- `HeroSection`: Introduction to Pouring.at, tagline with rotating location and beer style animation, and call to actions (search, signup)
- `SearchBar`: Component for searching bars and beers (location, style, brewery)
- `FeaturedBarsSection`: Display a curated list of featured bars
- `FeaturedBeersSection`: Display a curated list of featured beers
- `Footer`: Links to about, contact, terms, etc.

**Data Requirements:**

- Featured bars data (name, location, image, slug)
- Featured beers data (name, brewery, style, image, slug)

**Authentication Needs:**

- None

### Bar Detail Page (`/bars/[barSlug]`)

**Route:** `/bars/:barSlug`

**Key Components:**

- `BarProfileHeader`: Bar name, cover image, address, contact info, website link
- `TapList`: Display the current tap list for the bar
- `BarInfoSection`: Bar description, hours of operation, amenities
- `ReviewsSection`: Display user reviews and ratings for the bar
- `CheckInButton` (if logged in as Beer Explorer): Button to check in a beer at this bar

**Data Requirements:**

- Bar details based on `barSlug` (name, description, address, contact info, website, images, tap list, reviews)
- Beer details for each beer in the tap list (name, brewery, style, ABV, description, ratings)

**Authentication Needs:**

- None for viewing
- Beer Explorer authentication required for `CheckInButton` functionality

### Brewery Detail Page (`/breweries/[brewerySlug]`)

**Route:** `/breweries/:brewerySlug`

**Key Components:**

- `BreweryProfileHeader`: Brewery name, logo, location, website link
- `BeerList`: Display a list of beers produced by the brewery
- `BreweryInfoSection`: Brewery description, story, contact info

**Data Requirements:**

- Brewery details based on `brewerySlug` (name, description, location, website, logo, beers)
- Beer details for each beer in the beer list (name, style, ABV, description, ratings)

**Authentication Needs:**

- None

### Beer Detail Page (`/breweries/[brewerySlug]/beers/[beerSlug]`)

**Route:** `/breweries/:brewerySlug/beers/:beerSlug`

**Key Components:**

- `BeerHeader`: Beer name, brewery name, style, ABV, image
- `BeerDescription`: Detailed description of the beer
- `RatingsAndReviews`: Aggregate ratings and user reviews for the beer
- `BarListSection`: List of bars currently serving this beer (optional)

**Data Requirements:**

- Beer details based on `beerSlug` (name, brewery, style, ABV, description, images, ratings, reviews, bars serving this beer)
- Brewery details for the brewery associated with the beer
- Bar details for bars serving the beer (name, location, slug)

**Authentication Needs:**

- None

### Search Results Page (`/search`)

**Route:** `/search?location=[location]&style=[beer_style]&brewery=[brewery]` (using query parameters)

**Key Components:**

- `SearchResultsFilters`: Filters for refining search results by location, beer style, and brewery
- `BarSearchResultsList`: List of bars matching the location, beer style, or brewery criteria
- `BeerSearchResultsList`: List of beers matching the style or brewery criteria
- `MapComponent` (optional): Display search results on a map with location-based filtering

**Data Requirements:**

- Search results based on location, beer style, and brewery parameters
- Bar data for bars in search results (name, location, image, slug, tap list preview)
- Beer data for beers in search results (name, brewery, style, image, slug, rating)

**Authentication Needs:**

- None

### Authentication Pages (`/login`, `/signup`)

**Routes:**

- `/login`
- `/signup`

**Key Components:**

- `LoginForm`: Form for user login (email/password)
- `SignupForm`: Form for user signup (role selection: Beer Explorer, Bar Manager, Brewery, and role-specific fields)
- `SocialLoginButtons` (optional): Buttons for social login (Google, Facebook, etc.)

**Data Requirements:**

- None (for initial page load)
- User credentials during login/signup submission

**Authentication Needs:**

- None (for accessing the login/signup pages)
- Upon successful authentication, redirect to appropriate dashboard or previous page

## Brewery Pages (Authenticated - Brewery Role)

These pages are accessible to users logged in with a "Brewery" account.

### Brewery Dashboard (`/brewery/dashboard`)

**Route:** `/brewery/dashboard`

**Key Components:**

- `BreweryOverview`: Key metrics for the brewery (total beers, ratings, etc.)
- `BeerPerformanceChart`: Visual representation of beer ratings and popularity
- `RecentReviews`: Display recent reviews for brewery's beers
- `QuickActions`: Links to manage beers, edit profile, etc.

**Data Requirements:**

- Brewery profile data
- Aggregated data on brewery's beers (ratings, check-ins, etc.)
- Recent reviews for brewery's beers

**Authentication Needs:**

- Brewery role authentication required

### Beer Management Page (`/brewery/beers`)

**Route:** `/brewery/beers`

**Key Components:**

- `BeerListTable`: Table displaying brewery's beers with actions (edit, delete)
- `AddBeerButton`: Button to open "Add Beer" modal/page
- `ImportBeersButton`: Button to initiate CSV beer import
- `BeerSearchFilter`: Filter beers in the list (by name, style, etc.)
- `BeerSortOptions`: Options to sort beer list
- `BeerFormModal` or `AddBeerPage`: Form to add a new beer or edit an existing one

**Data Requirements:**

- List of beers associated with the brewery

**Authentication Needs:**

- Brewery role authentication required

### Brewery Profile Edit Page (`/brewery/profile/edit`)

**Route:** `/brewery/profile/edit`

**Key Components:**

- `BreweryProfileForm`: Form to edit brewery profile details (name, description, location, website, social media, logo)
- `SaveProfileButton`: Button to save profile changes
- `CancelEditButton`: Button to cancel edits and go back

**Data Requirements:**

- Brewery profile data to pre-populate the form

**Authentication Needs:**

- Brewery role authentication required

## Bar Pages (Authenticated - Bar Manager Role)

These pages are accessible to users logged in with a "Bar Manager" account.

### Bar Dashboard (`/bar/dashboard`)

**Route:** `/bar/dashboard`

**Key Components:**

- `BarOverview`: Key metrics for the bar (tap list performance, etc.)
- `TapListPerformanceChart`: Visual representation of tap list performance (popularity, duration on tap)
- `RecentCheckIns`: Display recent beer check-ins at the bar
- `QuickActions`: Links to manage tap list, edit profile, etc.

**Data Requirements:**

- Bar profile data
- Tap list performance data
- Recent check-ins at the bar

**Authentication Needs:**

- Bar Manager role authentication required

### Tap List Management Page (`/bar/tap-list`)

**Route:** `/bar/tap-list`

**Key Components:**

- `CurrentTapList`: Display current tap list with actions (edit, remove)
- `AddBeerToTapListButton`: Button to open "Add Beer to Tap List" modal/page
- `SearchBeerToAdd`: Search component to find existing beers to add to the tap list
- `AddNewBeerButton`: Button to add a completely new beer to the system if not found
- `TapListOrder`: Drag and drop interface for reordering the tap list
- `TapListBeerFormModal` or `AddBeerToTapListPage`: Form to add a beer to the tap list

**Data Requirements:**

- Current tap list data for the bar
- Beer data for beers in the tap list

**Authentication Needs:**

- Bar Manager role authentication required

### Bar Profile Edit Page (`/bar/profile/edit`)

**Route:** `/bar/profile/edit`

**Key Components:**

- `BarProfileForm`: Form to edit bar profile details (name, description, address, contact info, website, images, logo, unique slug)
- `ClaimSlugInput`: Input field for managing the bar's unique slug
- `SaveProfileButton`: Button to save profile changes
- `CancelEditButton`: Button to cancel edits and go back

**Data Requirements:**

- Bar profile data to pre-populate the form

**Authentication Needs:**

- Bar Manager role authentication required

## Beer Explorer Pages (Authenticated - Beer Explorer Role)

These pages are accessible to users logged in with a "Beer Explorer" account.

### Beer Explorer Dashboard/Feed (`/explorer/dashboard`)

**Route:** `/explorer/dashboard`

**Key Components:**

- `PersonalizedBeerRecommendations`: List of beer recommendations based on user preferences and history
- `FriendsActivityFeed`: Activity feed showing what friends are checking in and rating
- `NearbyBarsSection`: List of nearby bars with interesting tap lists
- `ToTryListPreview`: Preview of beers on the user's "To Try" list

**Data Requirements:**

- Personalized beer recommendations
- Friends' recent activity (check-ins, ratings)
- Nearby bars data
- Preview of user's "To Try" list

**Authentication Needs:**

- Beer Explorer role authentication required

### Beer Check-in Page (`/explorer/check-in`)

**Route:** `/explorer/check-in`

**Key Components:**

- `BarSearch`: Search for a bar to check in at (location-aware)
- `TapListSelector`: Display tap list for selected bar to choose beer from
- `BeerSearch`: Search for a beer if not at a bar or for can/bottle check-in
- `RatingInput`: Star rating input for the beer
- `ReviewTextInput`: Text area for writing a beer review
- `CheckInSubmitButton`: Button to submit the beer check-in

**Data Requirements:**

- Tap list data for selected bar (if bar is selected)
- Beer data for selected beer (if beer is selected)

**Authentication Needs:**

- Beer Explorer role authentication required

### User Profile Page (`/explorer/profile/[userId]`)

**Route:** `/explorer/profile/:userId` (or `/explorer/profile/me` for own profile)

**Key Components:**

- `UserProfileHeader`: User's profile picture, username, bio, stats (beers checked in, friends)
- `BeerCheckInHistory`: List of user's recent beer check-ins
- `FriendsListPreview` (on own profile): Preview of friends list
- `FriendsButton` (on other user profiles): Button to add/remove friend

**Data Requirements:**

- User profile data based on `userId`
- User's beer check-in history
- User's friends list (preview)

**Authentication Needs:**

- None for viewing public profiles
- Beer Explorer role authentication required to view own full profile and edit (on `/explorer/profile/me`)

### Friends Page (`/explorer/friends`)

**Route:** `/explorer/friends`

**Key Components:**

- `FriendsList`: List of current friends
- `FindFriendsSearch`: Search input to find other users to add as friends
- `FriendRequestsList`: List of pending friend requests

**Data Requirements:**

- User's friends list
- List of pending friend requests
- Search results for finding new friends

**Authentication Needs:**

- Beer Explorer role authentication required

### Settings Page (`/explorer/settings`)

**Route:** `/explorer/settings`

**Key Components:**

- `AccountSettingsForm`: Form to manage account settings (email, password, profile details)
- `NotificationSettings`: Settings for email and in-app notifications
- `PrivacySettings`: Settings for profile privacy
- `DeleteAccountButton`: Button to initiate account deletion

**Data Requirements:**

- User's current account settings

**Authentication Needs:**

- Beer Explorer role authentication required

---

**Note:** This is a preliminary page outline and may be subject to change as development progresses and features evolve. Component names are indicative and will need to be defined during front-end development. Data requirements are high-level and will need to be further specified with API endpoint design.
