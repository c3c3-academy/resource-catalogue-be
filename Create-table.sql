DROP TABLE IF EXISTS tagrelations;
DROP TABLE IF EXISTS interactions;
DROP TABLE IF EXISTS tostudy;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL, 
  isfaculty BOOLEAN NOT NULL
);

INSERT INTO users(name, isfaculty)
VALUES ('Emma', false),
('Toye', false),
('Raj',false),
('Alisa', false),
('Beri', false), 
('Chris',false),
('Veta', false),
('David', false),
('Ed', false),
('Faith', false),
('Grace', false),
('Hanna', false),
('Jamie', false),
('Jenna', false),
('Jo', false),
('Kasia', false),
('Linus', false),
('Martha', false),
('Matt P', false), 
('Nico', false), 
('Renee', false),
('Truman', false),
('Richard', True),
('Katie', True),
('Natalya', True),
('Neill', True),
('Matt M', True),
('Michelle', True),
('Muhammad', True),
('Esme', True),
('Mateusz', True); 
 

CREATE TABLE resources(
  id SERIAL PRIMARY KEY NOT NULL,
  resourcename VARCHAR(200) NOT NULL UNIQUE,
  authorname VARCHAR(200) NOT NULL, 
  url VARCHAR(300) NOT NULL UNIQUE,
  description VARCHAR NOT NULL,
  contenttype VARCHAR(200) NOT NULL,
  contentstage VARCHAR(200) NOT NULL,
  creationdate TIMESTAMP DEFAULT NOW(),
  postedbyuserid INT NOT NULL,
  isrecommended VARCHAR(7) NOT NULL,
  reason VARCHAR NOT NULL,
  FOREIGN KEY (postedbyuserid) REFERENCES users(id)
);
  
CREATE TABLE tags (
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR NOT NULL
);
  
CREATE TABLE tagrelations (
  resourceid INT NOT NULL,
  tagid INT NOT NULL,
  FOREIGN KEY (resourceid) REFERENCES resources(id),
  FOREIGN KEY (tagid) REFERENCES tags(id)
  PRIMARY KEY (resourceid, tagid)
); 
   
CREATE TABLE tostudy (
  id SERIAL PRIMARY KEY NOT NULL,
  userid INT NOT NULL,
  resourceid INT NOT NULL,
  FOREIGN KEY (resourceid) REFERENCES resources(id),
  FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE interactions (
  id SERIAL PRIMARY KEY NOT NULL,
  userid INT NOT NULL,
  resourceid INT NOT NULL,
  rating INT NOT NULL,
  comment VARCHAR DEFAULT NULL,
  FOREIGN KEY (resourceid) REFERENCES resources(id),
  FOREIGN KEY (userid) REFERENCES users(id)
);








