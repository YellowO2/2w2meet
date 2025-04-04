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
## Starting the Frontend  
2. **Navigate to the frontend directory**

    ```bash
    cd ./frontend
    ```

3. **Create a `.env` file**  
   In `./frontend`, create a `.env` file with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   SERVICE_EMAIL_PASS=your_email_service_password
   ```

4. **Install frontend dependencies**

    ```bash
    npm install
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Access the application**  
   Open your browser and navigate to `http://localhost:5173`

## Starting the Backend Services

7. **Navigate to `./backend`**
  ```bash
  cd ../backend
  ```

8. **Install Dependencies**
  ```bash
  npm install
  ```

9. **Create and Populate `.env` File**  
In `./backend`, create a file named ".env". Populate it with fields as follows
  ```
    FIREBASE_API_KEY=...
    GOOGLE_MAPS_API_KEY=...
    SERVICE_EMAIL_PASS=...
  ```

10. Run the Program
  ```bash
  npm run dev
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
