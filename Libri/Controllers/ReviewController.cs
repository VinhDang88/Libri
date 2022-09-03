using Libri.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Libri.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        BookDBContext context = new BookDBContext();

        [HttpPost("PostReview")]
        public Review PostReview(string userID, string isbn, string bookTitle, string author, string username, string review1)
        {
            Review review = new Review()
            {
                UserId = userID,
                Isbn = isbn,
                BookTitle = bookTitle,
                Author = author,
                UserName = username,
                Review1 = review1,
                DatePosted = DateTime.Now,
                Votes = 0
            };
            context.Reviews.Add(review);
            context.SaveChanges();
            return review;
        }

        [HttpGet("GetReviewsByBook")]
        public List<Review> GetReviewsByBook(string isbn)
        {
            return context.Reviews.Where(r => r.Isbn == isbn).ToList();
        }

        [HttpGet("GetReviewsByUser")]
        public List<Review> GetReviewsByUser(string userId)
        {
            return context.Reviews.Where(r => r.UserId == userId).ToList();
        }

        [HttpDelete("DeleteReview")]
        public Review RemoveReview(string userId, string isbn, DateTime datePosted)
        {
            Review review = context.Reviews.FirstOrDefault(r => r.UserId == userId && r.Isbn == isbn && r.DatePosted == datePosted);
            context.Reviews.Remove(review);
            context.SaveChanges();
            return review;
        }

        [HttpPut("EditReview")]
        public Review EditReview(string userId, string isbn, DateTime datePosted, string review1)
        {
            Review review = context.Reviews.FirstOrDefault(r => r.UserId == userId && r.Isbn == isbn && r.DatePosted == datePosted);
            review.Review1 = review1;
            context.SaveChanges();
            return review;
        }

        [HttpPut("UpVote")]
        public Review UpVote(string userId, string isbn, DateTime datePosted)
        {
            Review review = context.Reviews.FirstOrDefault(r => r.UserId == userId && r.Isbn == isbn && r.DatePosted == datePosted);
            review.Votes++;
            context.SaveChanges();
            return review;
        }

        [HttpPut("DownVote")]
        public Review DownVote(string userId, string isbn, DateTime datePosted)
        {
            Review review = context.Reviews.FirstOrDefault(r => r.UserId == userId && r.Isbn == isbn && r.DatePosted == datePosted);
            review.Votes--;
            context.SaveChanges();
            return review;
        }
    }
}
