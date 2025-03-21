This is assignment 4 now, here are the requirements:

Description
In this assignment, you will create the database and connect it to your web or mobile application. You can use any type of database, either RDBMS or NoSQL.

Problem Statement
Same as Assignment 1. 

Additional Details
You can use RDBMS or NoSQL database.

Database must include the following tables/documents:

UserCredentials: (ID & password), password should be encrypted.
UserProfile: Stores user details like full name, address, city, state, zipcode, skills, preferences, and availability.
EventDetails: Stores details of the events such as event name, description, location, required skills, urgency, and event date.
VolunteerHistory: Tracks volunteer participation in events.
States: Stores state codes and names (if required).
Important Deliverables
Validations: Ensure validations are in place for required fields, field types, and field lengths.
Data Retrieval and Display: Backend should retrieve data from the database and display it to the front end.

Data Persistence: Form data should be populated from the backend. The backend should receive data from the front end, validate it, and persist it to the database.
Unit Tests: Any new code added should be covered by unit tests. Keep code coverage above 80%.
Pointers/Guidelines for Choosing a Database
RDBMS: If you choose a relational database, consider using MySQL, PostgreSQL, or SQLite. These databases are great for structured data with complex relationships.

Example: MySQL, PostgreSQL
Benefits: ACID compliance, complex queries, and relationships.
Drawbacks: Requires schema definition, less flexible with unstructured data.
NoSQL: If you choose a NoSQL database, consider using MongoDB or Firebase. These databases are great for unstructured data and flexible schemas.

Example: MongoDB, Firebase

Benefits: Flexible schema, easy scalability, and handling unstructured data.

Drawbacks: Less suitable for complex queries and transactions.

Submission Requirements

Submit a Word/PDF document with your answers.

Use GitHub for your group collaboration and code.

Answer these Questions:

GitHub Repository Link (5 points)

Provide the link to your GitHub repository for TAs to view the code. Code should include unit tests.

SQL Statements (RDBMS) or Document Structure (NoSQL) (3 points)

Provide SQL statements to create the database (if using RDBMS).

Provide Document Structure or Class Models if using NoSQL.

Code Coverage Report (2 points)

Rerun the code coverage report and provide it.

Team Contributions (3 points)

List who did what within the group. TAs should be able to validate in GitHub; otherwise, team members 
who didn't contribute will receive a ZERO.