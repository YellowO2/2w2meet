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
   In the root directory, create a `.env` file and populate it with the environment variables I shared.

4. **Install dependencies**

    ```bash
    npm install
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Access the application**  
   Open your browser and navigate to `http://localhost:5173` to view the application.

## Running the Emulated Firebase Trigger

1. ```bash
   cd ./functions
   ```

2. Repeat step 3 and 4 above, with the root being `./functions`

3. **Log in to Firebase** Make sure you were added as collaborator to the firebase project. Then run

    ```bash
    firebase login
    ```

4. **Start the Emulation**
    ```bash
    firebase emulation:start --only functions
    ```
