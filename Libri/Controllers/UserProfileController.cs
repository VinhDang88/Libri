using Libri.Models;
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
        public FavoriteList AddFavorite(string? favoriteListId, string? isbn, string? title, string? author, string? subject, float? averageRating, int? ratingsCount)
        {
            if (context.FavoriteLists.Where(b => b.Isbn == isbn && b.FavoriteListId == favoriteListId).Count() > 0)
            {
                return null;
            }
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

        [HttpGet("GetTopFavoriteAuthors")]
        public List<string> GetTopFavoriteAuthors(string userId)
        {
            Dictionary<string, int> topAuthors = new Dictionary<string, int>();

            List<FavoriteList> userFavorites = context.FavoriteLists.Where(f => f.FavoriteListId == userId).ToList();
            List<string> authors = new List<string>();
            List<FavoriteList> distinctAuthors = userFavorites.DistinctBy(f => f.Author).ToList();
            distinctAuthors.ForEach(f => authors.Add(f.Author));
            authors.ForEach(a => topAuthors.Add(a, 0));
            foreach (FavoriteList f in userFavorites)
            {
                foreach(KeyValuePair<string, int> kvp in topAuthors)
                {
                    if (kvp.Key == f.Author)
                    {
                        topAuthors[kvp.Key]++;
                    }
                }
            }
            authors.Clear();
            foreach (KeyValuePair<string, int> kvp in topAuthors)
            {
                if (topAuthors[kvp.Key] == topAuthors.Values.Max())
                {
                    authors.Add(kvp.Key);
                    topAuthors.Remove(kvp.Key);

                    break;
                }
            }
            foreach (KeyValuePair<string, int> kvp in topAuthors)
            {
                if (topAuthors[kvp.Key] == topAuthors.Values.Max())
                {
                    authors.Add(kvp.Key);
                    topAuthors.Remove(kvp.Key);

                    break;
                }
            }
            foreach (KeyValuePair<string, int> kvp in topAuthors)
            {
                if (topAuthors[kvp.Key] == topAuthors.Values.Max())
                {
                    authors.Add(kvp.Key);
                    topAuthors.Remove(kvp.Key);

                    break;
                }
            }
            return authors;
        }

        [HttpDelete("DeleteFavoriteListObject")]
        public FavoriteList DeleteFavoriteListObject(string isbn, string favoriteListId)
        {
            FavoriteList favoriteList = context.FavoriteLists.First(f => f.Isbn == isbn && f.FavoriteListId == favoriteListId);
            if (favoriteList == null)
            {
                return null;
            }
            else
            {
            context.FavoriteLists.Remove(favoriteList);
            context.SaveChanges();
            return favoriteList;
            }
        }

        // Allows user to add a single book to their wish list
        [HttpPost("AddToWishList")]
        public WishList AddToWishList(string isbn, string wishListId)
        {
            if (context.WishLists.Where(b => b.Isbn == isbn && b.WishListId == wishListId).Count() > 0)
            {
                return null;
            }
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
        public List<WishList> GetWishList(string userId)
        {
            return context.WishLists.Where(u => u.WishListId == userId).ToList();
        }

        // Allows user to delete a book out of their wish list
        [HttpDelete("DeleteWishListObject")]
        public WishList DeleteWishListObject(string isbn, string wishListId)
        {
            WishList wishList = context.WishLists.FirstOrDefault(o => o.Isbn == isbn && o.WishListId == wishListId);
            if (wishList == null)
            {
                return null;
            }
            else
            {
            context.WishLists.Remove(wishList);
            context.SaveChanges();
            return wishList;
            }
        }

        // Allows user to add to a denied list for books they do not like
        [HttpPost("AddToDeniedList")]
        public DeniedList AddToDeniedList(string isbn, string deniedListId)
        {
            if (context.DeniedLists.Where(b => b.Isbn == isbn && b.DeniedListId == deniedListId).Count() > 0)
            {
                return null;
            }
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
        public List<DeniedList> GetDeniedLists(string userId)
        {
            return context.DeniedLists.Where(u => u.DeniedListId == userId).ToList();
        }

        // Allows user to delete books from their denied list if they decide they like it again
        [HttpDelete("DeleteDeniedListObject")]
        public DeniedList DeleteDeniedListObject(string isbn, string deniedListId)
        {
            DeniedList deniedList = context.DeniedLists.FirstOrDefault(o => o.Isbn == isbn && o.DeniedListId == deniedListId);
            if (deniedList == null)
            {
                return null;
            }
            else
            {
            context.DeniedLists.Remove(deniedList);
            context.SaveChanges();
            return deniedList;
            }
        }

        // Allows user to add a single book to a read list
        [HttpPost("AddToReadList")]
        public ReadList AddToReadList(string isbn, string readListId)
        {
            if (context.ReadLists.Where(b => b.Isbn == isbn && b.ReadListId == readListId).Count() > 0)
            {
                return null;
            }
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
        public List<ReadList> GetReadLists(string userId)
        {
            return context.ReadLists.Where(u => u.ReadListId == userId).ToList();
        }

        // Allows user to delete a book out of their read list
        [HttpDelete("DeleteReadListObject")]
        public ReadList DeleteReadListObject(string isbn, string readListId)
        {
            ReadList readList = context.ReadLists.FirstOrDefault(o => o.Isbn == isbn && o.ReadListId == readListId);
            if (readList == null)
            {
                return null;
            }
            else
            {
            context.ReadLists.Remove(readList);
            context.SaveChanges();
            return readList;
            }
        }
    }
}
