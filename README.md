# 2W2Meet - Group Event Planning Made Simple

An implementation of a meeting scheduler like when2meet, enhanced with location information & selection. Find both when and where to meet — hence "2w" in the name.

![Create Event Page](./public/create%20event.png)

## Key Features

- **Dynamic Schedule Coordination**
  - Select multiple dates and time slots
  - Real-time availability visualization
  - Automatic time slot conflict detection
  ![Time Selection Interface](./public/select%20time.png)

- **Smart Location Finding**
  - Google Maps integration for venue selection
  - Automated nearby venue suggestions
  - Distance and rating-based venue recommendations
  ![Venue Selection](./public/select%20venue.png)

- **Participant Management**
  - Simple unique link sharing for invites
  - No account required for participation
  - Email notifications for event updates

## Technology Stack

- **Frontend**
  - Vue.js 3 with TypeScript
  - PrimeVue UI Components
  - TailwindCSS for styling
  - Vue Router for navigation

- **Backend & Services**
  - Firebase Firestore for data storage
  - Firebase Cloud Functions
  - Google Maps Places API
  - Nodemailer for email notifications

- **Development Tools**
  - Vite for build tooling
  - TypeScript for type safety
  - Firebase Emulator Suite for local testing

## Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/YellowO2/2w2meet.git
    ```

2. **Navigate to the project directory**

    ```bash
    cd 2w2meet
    ```

3. **Create a `.env` file**  
   In the root directory, create a `.env` file with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   SERVICE_EMAIL_PASS=your_email_service_password
   ```

4. **Install dependencies**

    ```bash
    npm install
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Access the application**  
   Open your browser and navigate to `http://localhost:5173`

## Running the Firebase Emulator

1. Navigate to the functions directory:
    ```bash
    cd ./functions
    ```

2. Install dependencies and set up environment:
    ```bash
    npm install
    ```

3. Log in to Firebase:
    ```bash
    firebase login
    ```

4. Start the emulator:
    ```bash
    firebase emulators:start --only functions
    ```

## Skills Demonstrated

- Full-stack web development
- Real-time database management
- Third-party API integration
- Responsive UI/UX design
- TypeScript/JavaScript proficiency
- Vue.js component architecture
- Cloud function development
- Email service integration

## Future Enhancements

- Authentication system
- Calendar integration
- Mobile application
- Advanced venue filtering
- Meeting history tracking
