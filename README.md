### Overview
1. **Project Title:** Digital Archival System for Publication and Knowledge Management Division of Bicol University
2. **Original Authors:** Madrona, L., Manalo, S. K., Medallon, L. J., & Daep, P.K. (2023)
3. **Module Scope:** This module stores, organizes, and manages Major Final Output (MFO) documents for different colleges under Bicol University as well as generate reports for the colleges that can be filtered by year, quarter, and document category.
​
### Stack
1. **Frontend Framework:** `React`
2. **Style:** `Tailwind CSS`
3. **Backend Framework** `Node.js/Express.js`
4. **Database:** `MySQL 8.0`

### Getting Started
**1. Clone the repository:**
`git clone https://github.com/kriscvs/websys-final`

**2. Create an `.env` file inside the server folder:**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=archival_db
JWT_SECRET=your_secret_key
PORT=5000
``` 
**3.Prerequisites:**
1. `Node.js`
2. `XAMPP`

**4.Set up database:**
1. Run XAMPP and start **Apache** and **MySQL**
2. Import `setup.sql` at http://localhost/phpmyadmin

**5. To run locally (client):**
1. `cd client`
2. `npm install`
3. `npm start`

**6. To run locally (server):**
1. `cd server`
2. `npm install`
2. `npm start`

### Submitted by:
Alcazar, Elisha, Faith R
Bucay, Chloe
Castro, John Paul R.
Fortin, Kris Angel G.