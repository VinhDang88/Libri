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
            if (context.Reviews.Where(r => r.Isbn == isbn).Count() < 1)
            {
                return null;
            }
            List<Review> reviews = context.Reviews.Where(r => r.Isbn == isbn).ToList();
            reviews.Reverse();
            return reviews;
        }

        [HttpGet("GetTopReviewsByBook")]
        public List<Review> GetTopReviewsByBook(string isbn)
        {
            if (context.Reviews.Where(r => r.Isbn == isbn).Count() < 1)
            {
                return null;
            }
            List<Review> reviews = context.Reviews.Where(r => r.Isbn == isbn).ToList();
            List<Review> topReviews = reviews.OrderByDescending(r => r.Votes).ThenByDescending(r => r.DatePosted).ToList();
            return topReviews;
        }

        [HttpGet("GetReviewsByUser")]
        public List<Review> GetReviewsByUser(string userId)
        {
            if (context.Reviews.Where(r => r.UserId == userId).Count() < 1)
            {
                return null;
            }
            List<Review> reviews = context.Reviews.Where(r => r.UserId == userId).ToList();
            reviews.Reverse();
            return reviews;
        }

        [HttpGet("GetTopReviewsByUser")]
        public List<Review> GetTopReviewsByUser(string userId)
        {
            if (context.Reviews.Where(r => r.UserId == userId).Count() < 1)
            {
                return null;
            }
            List<Review> reviews = context.Reviews.Where(r => r.UserId == userId).ToList();
            List<Review> topReviews = reviews.OrderByDescending(r => r.Votes).ThenByDescending(r => r.DatePosted).ToList();
            return topReviews;
        }

        [HttpDelete("DeleteReview")]
        public Review RemoveReview(int id)
        {
            Review review = context.Reviews.FirstOrDefault(r => r.Id == id);
            context.Reviews.Remove(review);
            context.SaveChanges();
            return review;
        }

        [HttpPut("EditReview")]
        public Review EditReview(int id, string review1)
        {
            Review review = context.Reviews.FirstOrDefault(r => r.Id == id);
            review.Review1 = review1;
            context.SaveChanges();
            return review;
        }

        [HttpPut("UpVote")]
        public Review UpVote(string userId, int postId)
        {
            Review review = context.Reviews.FirstOrDefault(r =>r.Id == postId);
            Vote vote = context.Votes.FirstOrDefault(v => v.UserId == userId && v.PostId == postId);
            if (vote == null)
            {
                vote = new Vote()
                {
                    UserId = userId,
                    PostId = postId,
                    Upvoted = true,
                    Downvoted = false
                };
                review.Votes++;
                context.Votes.Add(vote);
                context.SaveChanges();
                return review;
            }
            else if (vote.Upvoted == false && vote.Downvoted == true)
            {
                vote.Downvoted = false;
                vote.Upvoted = true;
                review.Votes += 2;
                context.SaveChanges();
                return review;
            }
            else
            {
                return review;
            }
        }

        [HttpPut("DownVote")]
        public Review DownVote(string userId, int postId)
        {
            Review review = context.Reviews.FirstOrDefault(r => r.Id == postId);
            Vote vote = context.Votes.FirstOrDefault(v => v.UserId == userId && v.PostId == postId);
            if (vote == null)
            {
                vote = new Vote()
                {
                    UserId = userId,
                    PostId = postId,
                    Upvoted = false,
                    Downvoted = true
                };
                review.Votes--;
                context.Votes.Add(vote);
                context.SaveChanges();
                return review;
            }
            else if (vote.Downvoted == false && vote.Upvoted == true)
            {
                vote.Downvoted = true;
                vote.Upvoted = false;
                review.Votes -= 2;
                context.SaveChanges();
                return review;
            }
            else
            {
                return review;
            }
        }
    }
}
