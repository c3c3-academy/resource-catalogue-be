CREATE TABLE users(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL, 
  is_faculty BOOLEAN NOT NULL
  )



CREATE TABLE resources(
  id SERIAL PRIMARY KEY NOT NULL,
  resourceName VARCHAR(200) NOT NULL,
  authorName VARCHAR(200) NOT NULL, 
  url VARCHAR(300) NOT NULL,
  description VARCHAR NOT NULL,
  contentType VARCHAR(200) NOT NULL,
  contentStage VARCHAR(200) NOT NULL,
  creationDate TIMESTAMP DEFAULT NOW(),
  userID INT NOT NULL,
  isRecommended VARCHAR(7) NOT NULL,
  reason VARCHAR NOT NULL,
  FOREIGN KEY (userID) REFERENCES Users(id)
  )
  
  
  
  CREATE TABLE TagRelations (
  id SERIAL Primary Key NOT NULL,
  resourceID INT NOT NULL,
  tagID INT NOT NULL,
  FOREIGN KEY (resourceID) REFERENCES resources(id),
  FOREIGN KEY (tagID) REFERENCES Tags(id)
)
  
  CREATE TABLE Tags (
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR NOT NULL)
   
   
  CREATE TABLE ToStudy (
  id SERIAL PRIMARY KEY NOT NULL,
  userID INT NOT NULL,
  resourceID INT NOT NULL,
  FOREIGN KEY (resourceID) REFERENCES resources(id),
  FOREIGN KEY (UserID) REFERENCES Users(id)
 )


CREATE TABLE Interactions (
  id SERIAL PRIMARY KEY NOT NULL,
  userID INT NOT NULL,
  resourceID INT NOT NULL,
  likes Boolean NOT NULL,
  comment VARCHAR DEFAULT NULL,
  FOREIGN KEY (resourceID) REFERENCES resources(id),
  FOREIGN KEY (userID) REFERENCES Users(id)
 )

Insert into users(name,is_faculty) VALUES ('Emma', false),('Toye', false),('Raj',false),('Alisa', false),('Beri', false), ('Chris',false),('Veta', false),('David', false),('Ed', false),('Faith', false),('Grace', false),('Hanna', false),('Jamie', false),('Jenna', false),
('Jo', false),('Kasia', false),('Linus', false),('Martha', false),('Matt P', false), ('Nico', false), ('Renée', false),('Truman', false),
('Richard', True),('Katie', True),('Natalya', True),('Neill', True),('Matt M', True),('Michelle', True),('Muhammad', True),('Esme', True),('Mateusz', True) 
                                                                          








