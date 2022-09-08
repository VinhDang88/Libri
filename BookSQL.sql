--CREATE DATABASE BookDB;
--USE BookDB;

--CREATE TABLE Users (
--Id NVARCHAR(25) PRIMARY KEY NOT NULL ,
--FirstName NVARCHAR(255),
--LastName NVARCHAR(255),
--Name NVARCHAR(255),
--PhotoUrl NVARCHAR(255)
--);

--CREATE TABLE WishLists (
--Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--WishListId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--Isbn NVARCHAR(255)
--);

--CREATE TABLE ReadLists (
--Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--ReadListId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--Isbn NVARCHAR(255)
--);

--CREATE TABLE DeniedLists (
--Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--DeniedListId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--Isbn NVARCHAR(255)
--);

--CREATE TABLE FavoriteLists (
--Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--FavoriteListId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--Isbn NVARCHAR(255),
--Title NVARCHAR(255),
--Author NVARCHAR(255),
--Subject NVARCHAR(255),
--averageRating REAL,
--ratingsCount INT
--);

--CREATE TABLE Reviews(
--	Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--	UserId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--	Isbn NVARCHAR(255),
--	BookTitle NVARCHAR(255),
--	Author NVARCHAR(255),
--	UserName NVARCHAR(255),
--	Review NVARCHAR(1500),
--	DatePosted DATETIME,
--	Votes INT
--);

--CREATE TABLE Votes(
--	Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--	UserId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--	PostId INT NOT NULL,
--	Upvoted BIT,
--	Downvoted BIT
--);

--CREATE TABLE Followers(
--	Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--	UserFollowedId NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--	UserFollowingId NVARCHAR(25)
--);

--CREATE TABLE UserReccomendations(
--	Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--	ReccomendedTo NVARCHAR(25) FOREIGN KEY REFERENCES Users(Id),
--	RecomendedBy NVARCHAR(25),
--	Isbn NVARCHAR(255),
--	Title NVARCHAR(255),
--	Author NVARCHAR(255),
--	Subject NVARCHAR(255),
--	averageRating REAL,
--	ratingsCount INT,
--	BookThumbnailUrl NVARCHAR(255),
--);

--DROP TABLE Votes;

--DROP TABLE Reviews;

--ALTER TABLE Users
--ADD SqlId INT NOT NULL IDENTITY(1,1);

--ALTER TABLE ReadLists
--ADD Id INT NOT NULL PRIMARY KEY IDENTITY(1,1);

--ALTER TABLE DeniedLists
--ADD Id INT NOT NULL PRIMARY KEY IDENTITY(1,1);

--SELECT * FROM Users;

--SELECT * FROM FavoriteLists;

--SELECT * FROM WishLists;

--SELECT * FROM ReadLists;

--SELECT * FROM DeniedLists;

--SELECT * FROM Reviews;

--SELECT * FROM Votes;

--SELECT * FROM Followers;

--SELECT * FROM UserReccomendations;

--SELECT * FROM WishLists
--JOIN Users ON WishLists.WishListId=Users.Id;

--DELETE FROM WishLists;

--DELETE FROM FavoriteLists;

--DELETE FROM ReadLists;

--DELETE FROM DeniedLists;

--DELETE FROM Reviews
--Where id = 15;
	

--DELTE FROM Votes;

--SELECT * FROM FavoriteLists
--JOIN Users ON FavoriteLists.FavoriteListId=Users.Id;

--ALTER TABLE UserReccomendations
--ADD Description NVARCHAR(4000);

--ALTER TABLE FavoriteLists
--ADD Thumbnail NVARCHAR(255);