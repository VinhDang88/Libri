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
    }
}
