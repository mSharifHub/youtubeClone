
## YouTube Clone Development Branch

---
## **Application Stack**

This application is built using a variety of technologies to simulate a modern web application. Please refer to `package.json` for the specific versions used in the front-end, and `requirements.txt` for back-end dependencies. Note that these dependencies may evolve as the project develops.

### Front-End Stack

- **React Vite**: A fast and modern client-side JavaScript framework and build tool.
- **TypeScript**: Ensures strong typing to improve code quality and reduce errors.
- **TailwindCSS**: Utility-first CSS framework for designing user interfaces.
- **Apollo**: GraphQL client for managing state and connecting to GraphQL APIs.
- **ESLint**: Code linting tool to enforce consistent code standards.
- **Prettier**: Automatic code formatter for maintaining consistent style.
- **FontAwesome**: Library for adding scalable icons and logo assets to the UI.
- **GraphQL Codegen**: Automatically generates type-safe GraphQL queries and mutations.

### Back-End Stack

The back end is built using Python and Django. Refer to the `requirements.txt` file for all installed libraries. The final list of dependencies may vary as the project progresses.

- **Django**: High-level Python framework for building robust web applications.
- **Django GraphQL**: Integration of GraphQL APIs into Django.
- **MySQL**: Relational database for robust and scalable storage of application data.
- **Google OAuth2**: For secure and reliable user authentication.


**Setting Up and Running the Application**

### Prerequisites

Before starting, ensure the following software is installed on your system:

1. **Python** (3.9 or higher recommended)
2. **Node.js** (16 or higher) and `npm` (already included with Node.js)
3. **MySQL** (for the database)
4. A **Google Cloud Console account** for OAuth2 configuration and API keys.
5. Required environment variables in `.env` files for both the **back end** and the **front end**.

---
### 1. **Back-End Setup**

Follow these steps to set up and run the back end:

#### Step 1: Clone the Repository
```bash
git clone <repository_url>
cd <repository_folder>
```

#### Step 2: Create a Virtual Environment & Install Dependencies
Run the following commands to create and activate a virtual environment:
```bash
python -m venv env
source env/bin/activate  # If you're on Windows, use `env\Scripts\activate`
```
Next, install the required Python packages from the `requirements.txt` file:
```bash
pip install -r requirements.txt
```

#### Step 3: Set Up the `.env` File
Create a `.env` file in the back-end directory with the following variables:

```plaintext
SECRET_KEY=<generate_a_secret_key>
DEBUG=True
DATABASE_NAME=<your_mysql_database_name>
DATABASE_USER=<your_mysql_username>
DATABASE_PASSWORD=<your_mysql_password>
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
GOOGLE_CLIENT_ID=<your_google_oauth2_client_id>
GOOGLE_CLIENT_SECRET=<your_google_oauth2_client_secret>
```

> **Note:** You will need to set up a project in Google Cloud Console to obtain the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

#### Step 4: Apply Migrations
Run the following commands to set up your database:
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Step 5: Start the Development Server
Start the Django development server:
```bash
python manage.py runserver
```

The back end should now be running at `http://127.0.0.1:8000/`.

---

### 2. **Front-End Setup**

Follow these steps to set up and run the front end:

#### Step 1: Navigate to the Front-End Directory
Assuming the front-end code resides under a `frontend/` folder within the same repository:
```bash
cd ../frontend
```

#### Step 2: Install Dependencies
Use `npm` to install the required packages:
```bash
npm install
```

#### Step 3: Set Up the `.env` File
Create a `.env` file in the front-end directory with the following variables:

```plaintext
VITE_API_URL=http://127.0.0.1:8000/graphql/
VITE_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
```

#### Step 4: Start the Development Server
Run the following command to start the front-end development server:
```bash
npm run dev
```

The front end should now be running at the local server URL (e.g., `http://localhost:5173/`).

---

## **Connecting Back End and Front End**

1. Ensure the back end is running (`http://127.0.0.1:8000/`).
2. Ensure the front end is running (`http://localhost:5173/`).
3. The front end will send API requests to the back end at the specified `VITE_API_URL` endpoint.

---

## **Additional Notes**

- Ensure you have a **Google Cloud Console account** set up with OAuth2 credentials for the authentication features to work properly. Configure the **Redirect URIs** in the Google Cloud Console to include `http://localhost:5173`.
- The `SECRET_KEY` in your back-end `.env` file should be generated securely. You can use [Django documentation instructions](https://docs.djangoproject.com/en/4.2/ref/settings/#std-setting-SECRET_KEY) for generating one.
- MySQL must be running locally or on a configured remote server with the credentials matching your `.env` file.


---

### Link to Video Previews

Application has not yet been deployed,therefore, I am providing lastest development videos on linkedin till is ready to be deployed

[Video Preview on LinkedIn](https://www.linkedin.com/posts/activity-7298179409209958401-RbIu?utm_source=share&utm_medium=member_desktop&rcm=ACoAADU3pVcBAL_VLlfn48JrgdfLvqY1sMOXEVA)

---

## **Disclaimer**

This project is developed **only for educational purposes** and is intended to serve as a learning resource for developers. Below is an elaboration of the purpose and restrictions related to this project:

### **Purpose**

1. This codebase imitates the design and functionality of YouTube to provide a robust platform for learning modern web and software development techniques.
2. It is a sandbox environment for developers to implement best practices in full-stack web application development, including React, GraphQL, and back-end development with Django.

### **Usage Restrictions**

1. This project is **not intended** for production use or deployment in a commercial environment.
2. It must not be used for profit-making purposes, direct or indirect, such as advertising platforms or paid services.
3. Redistribution of this codebase must only occur in compliance with open-source licensing (if applicable) and with proper attribution to contributors.

### **Intellectual Property**

1. **Affiliation**: This project is not affiliated with YouTube, Google, or any related trademarks or services.
2. **Trademark and Copyright**: All trademarks, logos, and branding associated with YouTube belong exclusively to their respective owners.
3. **Fair Use**: This project is meant to adhere to the principles of fair use. It uses copyrighted design, functionalities, and branding solely for educational comparison and learning.

### **Disclaimer of Liability**

1. The developers and contributors of this project are **not liable** for any misuse, redistribution, or unauthorized deployment of this codebase by others.
2. This project is provided "as is," without any warranty, and should only be used for lawful, academic, or personal learning purposes.

---

For additional clarifications or inquiries, please contact the developers or contributors listed in the repository.
