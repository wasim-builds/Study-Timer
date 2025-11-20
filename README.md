# Study Timer 🍅

A feature-rich, responsive Pomodoro-style study timer built with Python (Flask) and vanilla JavaScript. This application helps you manage your time effectively with customizable work/break intervals, task tracking, and a built-in calendar.

It is designed as a **Progressive Web App (PWA)**, meaning you can install it on your mobile or desktop device and use it just like a native app.

## ✨ Features

*   **Productivity Timer**: Standard Pomodoro timer (25m Work / 5m Break) with **customizable durations**.
*   **Task Management**:
    *   Add "To Do" tasks.
    *   Mark tasks as **Completed** (moves them to a separate history list).
    *   Tasks persist even if you close the browser (saved in LocalStorage).
*   **Dashboard**:
    *   **Digital Clock**: Real-time clock display.
    *   **Monthly Calendar**: Visual calendar to keep track of dates.
*   **Notifications**:
    *   **Audio**: Beep sound when the timer ends.
    *   **Desktop/Mobile Notifications**: System notifications to alert you even when the app is in the background.
*   **Theming**:
    *   **Dark Mode**: Toggle between Light and Dark themes (preference saved).
    *   **Animations**: Smooth UI transitions.
*   **Mobile Ready (PWA)**:
    *   Fully responsive design.
    *   Installable on Android/iOS/Desktop.
    *   Works offline (caches assets).

## 🛠️ Tech Stack

*   **Backend**: Python 3, Flask
*   **Frontend**: HTML5, CSS3, JavaScript (ES6)
*   **Server**: Gunicorn (for production)

## 🚀 How to Run Locally

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd study-timer
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the Application**:
    ```bash
    python app.py
    ```

4.  **Open in Browser**:
    Visit `http://localhost:5000`

## 🌍 Deployment (Host Online)

This app is ready to be deployed on platforms like **Render** or **Heroku**.

### Deploy on Render (Free)
1.  Push your code to GitHub.
2.  Create a new **Web Service** on [Render](https://render.com).
3.  Connect your repository.
4.  Use the following settings:
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn app:app`
5.  Click **Create Web Service**.

## 📱 How to Install (PWA)

Once deployed (or running locally):

*   **Android (Chrome)**: Tap the menu (⋮) > **"Install App"** or **"Add to Home screen"**.
*   **iOS (Safari)**: Tap the Share button > **"Add to Home Screen"**.
*   **Desktop (Chrome/Edge)**: Click the Install icon in the address bar.

## 📄 License

This project is open-source and available under the MIT License.
