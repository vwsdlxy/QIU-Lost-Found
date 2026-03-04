# TABLE OF CONTENTS
1. System Requirements
2. Installation Steps
3. Database Setup
4. Running the Application

# SYSTEM REQUIREMENTS
Software Needed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher) 
- XAMPP (recommended)
- DBeaver (recommended)
- Git (optional) 
- Web Browser (Chrome, Firefox, or Edge)

# INSTALLATION STEPS
# == Download the Project Files ==
Option A: Using Git (if installed)
run powershell:
>> git clone <your-repository-url>
>> cd "WEB TECH FA"

Option B: Manual Download
1. Create a folder: C:\Languages\HTML\WEB TECH FA
2. Copy all these files into that folder:
- server.js
- package.json

.env

All folders: routes/, controllers/, models/, config/, middleware/, public/

All JavaScript files in each folder

# DATABASE SETUP
# Step 1: Open MySQL
1. Open PowerShell and connect to MySQL:
2. run powershell: 
>> mysql -u root -p
3. Press Enter (if no password) or type your password

# Step 2: Create Database and Tables
1. Copy and paste this entire block and run each part
--------------------------------------------------
create database if not exists lost_found_db;
use lost_found_db;

create table if not exists report (
	id INT primary key auto_increment,
	title VARCHAR(255) not null,
	description TEXT not null,
	category ENUM('Lost', 'Found') not null,
	location VARCHAR(255) not null,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    status ENUM('Active', 'Claimed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table if not exists member (
	id INT primary key auto_increment,
	name VARCHAR(255) not null,
    qiu_email VARCHAR(100),
    contact VARCHAR(20),
    password VARCHAR(30)
);

INSERT INTO report (title, description, category, location, contact_email, contact_phone, status) VALUES
('iPhone 13', 'Black iPhone 13 with blue case, lost near food court', 'Lost', 'TTS, La Place Cafe', 'johnsmith@qiu.edu.my', '+601123451241', 'Active'),
('Brown Wallet', 'Found brown leather wallet near bus station', 'Found', 'ASB L3 Exam Hall', 'sarahjohnson@qiu.edu.my', '+601545125789', 'Active'),
('House Keys', 'Set of 3 keys with silver keychain', 'Lost', 'Unknown', 'mikewilson@qiu.edu.my', '+60124568745', 'Active'),
('Laptop Bag', 'Black Dell laptop bag with charger', 'Found', 'TTS L2 Bookstore', 'emmadavis@qiu.edu.my', '+60146583312', 'Claimed'),
('Apple Pencil (2nd Gen)', 'White Apple Pencil with "Alex" engraved near bottom', 'Lost', 'Library Level 3, Study Pod 7', 'alexchen@qiu.edu.my', '+60123456789', 'Active'),
('Student ID Card', 'Student ID for TAN SRI AHMAD (ID: 24012345)', 'Found', 'Level 2 Bookstore', 'fatimah.rahman@qiu.edu.my', '+60187654321', 'Active'),
('Water Bottle', 'Stainless steel Hydro Flask, navy blue with stickers', 'Lost', 'ASB L1 CS LAB 3', 'navinraj@qiu.edu.my', '+60199887766', 'Active'),
('Scientific Calculator', 'Casio fx-570EX, name "Wei Jie" on back', 'Found', 'ASB L2, LR6', 'weijie.ng@qiu.edu.my', '+60123234567', 'Claimed'),
('Power Bank', 'Xiaomi 20000mAh power bank with black cable', 'Lost', 'TTS L1', 'limpeishi@qiu.edu.my', '+60166554433', 'Active'),
('Prescription Glasses', 'Black frame glasses, -2.50 prescription', 'Found', 'Bus Stop, on bench', 'dr.kumar@qiu.edu.my', '+60123457890', 'Active');

INSERT INTO member (name, qiu_email, contact, password) VALUES
('Vince Voon', 'vincevoon@qiu.edu.my', '+601111313301', 'Vince@123');
----------------------------------------------------

# Step 3: Configure Environment Variables
1. Create a .env file in the project root folder:
run powershell:
>> notepad .env
2. Paste this content (adjust if your MySQL password is different):
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lost_found_db
3. Save the file (Ctrl+S) and close Notepad.

# RUNNING THE APPLICATION
# Step 1: Install Dependencies
Open PowerShell in your project folder:
run powershell
>> npm install
(This will install all required packages:
express
mysql2
dotenv
cors
nodemon (for development) )

# Step 2: Start MySQL Service
run powershell
>> net start MySQL80

or

start MySQL in XAMPP control panel

# Step 3: Start the Server
run powershell
>> node server.js
You should see:
Server running on port 5000
Access the app at http://localhost:5000
Test login at http://localhost:5000/api/test
MySQL connected successfully
Database: lost_found_db

# Step 4: Access the app
copy paste this link into your browser:
http://localhost:5000/login.html

Note: You should now see the UI of login page of the website