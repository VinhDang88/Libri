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

SELECT * FROM Users;