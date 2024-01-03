-- Create Baseline Table
-- Expects an empty database

CREATE TABLE "koalas" (
	"id" serial primary key,
	"name" varchar(40),
	"gender" varchar(2),
	"age" integer,
	"ready_to_transfer" varchar(1),
	"notes" varchar(255)
	);
	
	INSERT INTO "koalas" ("name", "gender", "age", "ready_to_transfer", "notes")
	VALUES ('Scotty', 'M', 4, 'Y', 'Born in Guatemala'),
	('Jean', 'F', 5, 'Y', 'Allergic to lots of lava'),
	('Ororo', 'F', 7, 'N', 'Loves listening to Paula (Abdul)'),
	('K''Leaf', 'NB', 15, 'N', 'Never refuses a treat.'),
	('Charlie', 'M', 9, 'Y', 'Favorite band is Nirvana'),
	('Betsy', 'F', 4, 'Y', 'Has a pet iguana');