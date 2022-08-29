﻿using Libri.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Libri.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        BookDBContext context = new BookDBContext();

        //Allows user to favorite a single book
        [HttpPost("AddFavorite")]
        public FavoriteList AddFavorite(string favoriteListId, string isbn, string title, string author, string subject, float averageRating, int ratingsCount)
        {
            FavoriteList favorite = new FavoriteList()
            {
                FavoriteListId = favoriteListId,
                Isbn = isbn,
                Title = title,
                Author = author,
                Subject = subject,
                AverageRating = averageRating,
                RatingsCount = ratingsCount
            };
            context.FavoriteLists.Add(favorite);
            context.SaveChanges();
            return favorite;
        }

        // Gets all user favorites
        [HttpGet("GetUserFavorites")]
        public List<FavoriteList> GetUserFavorites(string userId)
        {
            List<FavoriteList> userFavorites = context.FavoriteLists.Where(f => f.FavoriteListId == userId).ToList();
            return userFavorites;
        }

        // Allows user to add a single book to their wish list
        [HttpPost("AddToWishList")]
        public WishList AddToWishList(string isbn, string wishListId)
        {
            WishList wishList = new WishList()
            {
                Isbn = isbn,
                WishListId = wishListId
            };
            context.WishLists.Add(wishList);
            context.SaveChanges();
            return wishList;
        }

        // Gets users customer wish list
        [HttpGet("GetWishList")]
        public List<WishList> GetWishList()
        {
            return context.WishLists.ToList();
        }

        // Allows user to delete a book out of their wish list
        [HttpDelete("DeleteWishListObject")]
        public WishList DeleteWishListObject(string isbn, string wishListId)
        {
            WishList wishList = context.WishLists.FirstOrDefault(o => o.Isbn == isbn && o.WishListId == wishListId);
            context.WishLists.Remove(wishList);
            context.SaveChanges();
            return wishList;
        }

        // Allows user to add to a denied list for books they do not like
        [HttpPost("AddToDeniedList")]
        public DeniedList AddToDeniedList(string isbn, string deniedListId)
        {
            DeniedList deniedList = new DeniedList()
            {
                Isbn = isbn,
                DeniedListId = deniedListId
            };
            context.DeniedLists.Add(deniedList);
            context.SaveChanges();
            return deniedList;
        }

        // Gets the user denied list
        [HttpGet("GetDeniedList")]
        public List<DeniedList> GetDeniedLists()
        {
            return context.DeniedLists.ToList();
        }

        // Allows user to delete books from their denied list if they decide they like it again
        [HttpDelete("DeleteDeniedListObject")]
        public DeniedList DeleteDeniedListObject(string isbn, string deniedListId)
        {
            DeniedList deniedList = context.DeniedLists.FirstOrDefault(o => o.Isbn == isbn && o.DeniedListId == deniedListId);
            context.DeniedLists.Remove(deniedList);
            context.SaveChanges();
            return deniedList;
        }

        // Allows user to add a single book to a read list
        [HttpPost("AddToReadList")]
        public ReadList AddToReadList(string isbn, string readListId)
        {
            ReadList readList = new ReadList()
            {
                Isbn = isbn,
                ReadListId = readListId
            };
            context.ReadLists.Add(readList);
            context.SaveChanges();
            return readList;
        }

        // Gets the users custom read list
        [HttpGet("GetReadList")]
        public List<ReadList> GetReadLists()
        {
            return context.ReadLists.ToList();
        }

        // Allows user to delete a book out of their read list
        [HttpDelete("DeleteReadListObject")]
        public ReadList DeleteReadListObject(string isbn, string readListId)
        {
            ReadList readList = context.ReadLists.FirstOrDefault(o => o.Isbn == isbn && o.ReadListId == readListId);
            context.ReadLists.Remove(readList);
            context.SaveChanges();
            return readList;
        }
    }
}
