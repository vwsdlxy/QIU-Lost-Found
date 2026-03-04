# QIU LOST & FOUND SYSTEM
## TABLE OF CONTENTS
1. Features
2. Technologies Used
3. Local Installation
4. Usage
5. Live Demo
6. License

## FEATURES
- User authentication with QIU email validation
- Report lost or found items
- Browse all items with category and status filters
- Personal dashboard for user's own reports
- Mark items as claimed
- Delete reports
- Responsive design for mobile devices

## TECHNOLOGIES USED
- HTML5
- CSS3 (Flexbox & Grid)
- JavaScript (ES6+)
- Font Awesome 6
- Google Fonts

## LOCAL INSTALLATION 
1. Start MySQL
2. Create database (lost_found_db) and run each section
3. Download dependencies
```bash
npm install 
```
4. Create .env file (follow example given in folder)
5. Start server
```bash
node server.js
```
6. Open index.html in your browser

## USAGE
- Login with your QIU email
  (assumptions: login credentials were set in database. You can use the credentials below to login:
  email: vincevoon@qiu.edu.my; password: Vince@123
  or
  email: johnsmith@qiu.edu.my; password: John@123)
- Report items using the multi-step form
- Browse all reports in the view page
- Manage your reports in 'My Reports'

## LIVE DEMO
Netlify URL : https://qiu-lost-found.netlify.app/

## LICENSE
MIT
