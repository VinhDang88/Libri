--CREATE TABLE Users (
--Id NVARCHAR(25) PRIMARY KEY NOT NULL ,
--FirstName NVARCHAR(255),
--LastName NVARCHAR(255),
--Name NVARCHAR(255),
--PhotoUrl NVARCHAR(255)

--);

--CREATE TABLE WishLists (
--WishListId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--Isbn NVARCHAR(255)
--);

--CREATE TABLE ReadLists (
--ReadListId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--Isbn NVARCHAR(255)
--);

--CREATE TABLE DeniedLists (
--DeniedListId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--Isbn NVARCHAR(255)
--);

--CREATE TABLE FavoriteLists (
--FavoriteListId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--Isbn NVARCHAR(255),
--Title NVARCHAR(255),
--Author NVARCHAR(255),
--Subject NVARCHAR(255),
--averageRating REAL,
--ratingsCount INT

--);

--ALTER TABLE WishLists
--ADD Id INT NOT NULL PRIMARY KEY IDENTITY(1,1);

--ALTER TABLE ReadLists
--ADD Id INT NOT NULL PRIMARY KEY IDENTITY(1,1);

--ALTER TABLE DeniedLists
--ADD Id INT NOT NULL PRIMARY KEY IDENTITY(1,1);

--SELECT * FROM Users;

--SELECT * FROM FavoriteLists

--SELECT * FROM WishLists

--SELECT * FROM ReadLists;

--SELECT * FROM DeniedLists;

--SELECT * FROM WishLists
--JOIN Users ON WishLists.WishListId=Users.Id;

--DELETE FROM WishLists

--DELETE FROM FavoriteLists

--DELETE FROM ReadLists;

--DELETE FROM DeniedLists;

--SELECT * FROM FavoriteLists
--JOIN Users ON FavoriteLists.FavoriteListId=Users.Id;