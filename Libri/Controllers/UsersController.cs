using Libri.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Libri.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        BookDBContext context = new BookDBContext();

        //Allows user to change their profile picture.
        [HttpPut("ChangePhotoUrl")]
        public User ChangePhotoUrl(string id, string? photoUrl)
        {
            User user = context.Users.FirstOrDefault(x => x.Id == id);
            user.PhotoUrl = photoUrl;
            context.SaveChanges();
            return user;
        }

        //Collects NEW user information and stores to the SQL database. 
        [HttpPost("AddUser")]
        public User AddUser(string id, string firstName, string lastName, string name, string? photoUrl)
        {
            User user = context.Users.Find(id);
            //Doesn't add already existed users.
            if (user == null)
            {
                user = new User();
                user.Id = id;
                user.FirstName = firstName;
                user.LastName = lastName;
                user.Name = name;
                user.PhotoUrl = photoUrl;
                context.Users.Add(user);
                context.SaveChanges();
                user = context.Users.First(u => u.Id == id);
            }
            return user;
        }

        [HttpGet("GetUserById")]
        public User GetUserById(string id)
        {
            User user = context.Users.Find(id);
            if (user == null)
            {
                return null;
            }
            return context.Users.First(u => u.Id == id);
        }

        [HttpGet("GetUsersByName")]
        public List<User> GetUsersByName(string name)
        {
            return context.Users.Where(u => u.Name.ToLower().Contains(name.ToLower().Trim())).ToList();
        }

        [HttpGet("GetUserBySqlId")]
        public User GetUserBySqlId(int id)
        {
            return context.Users.FirstOrDefault(u => u.SqlId == id);
        }

        [HttpPost("FollowUser")]
        public Follower FollowUser(string userFollowedId, string userId)
        {
            bool following = context.Followers.FirstOrDefault(f => f.UserFollowedId == userFollowedId && f.UserFollowingId == userId) != null;
            if (!following && userFollowedId != userId)
            {
                Follower follower = new Follower()
                {
                    UserFollowedId = userFollowedId,
                    UserFollowingId = userId,
                };
                context.Followers.Add(follower);
                context.SaveChanges();
                return follower;
            }
            else
            {
                return null;
            }
            
        }

        [HttpDelete("UnFollow")]
        public Follower UnFollow(string userFollowedId, string userId)
        {
            Follower unFollowed = context.Followers.FirstOrDefault(f => f.UserFollowedId == userFollowedId && f.UserFollowingId == userId);
            if(unFollowed != null)
            {
                context.Followers.Remove(unFollowed);
                context.SaveChanges();
            }
            return unFollowed;
        }

        [HttpGet("GetFollowing")]
        public List<string> GetFollowing(string userId)
        {
            List<Follower> following = context.Followers.Where(f => f.UserFollowedId == userId).ToList();
            List<string> result = new List<string>();
            following.ForEach(f => result.Add(f.UserFollowingId));
            return result;
        }

        [HttpGet("GetFollowedUsers")]
        public List<string> GetFollowedUsers(string userId)
        {
            List<Follower> followedUsers = context.Followers.Where(f => f.UserFollowingId == userId).ToList();
            List<string> result = new List<String>();
            followedUsers.ForEach(f => result.Add(f.UserFollowedId));
            return result;
        }

        [HttpPost("SendReccomendation")]
        public UserReccomendation SendReccomendation(string? reccomendedTo, string? recomendedBy, string? isbn, string? title, string? author, string? subject, float? averageRating, int? ratingsCount, string? bookThumbnailUrl, string? description)
        {
            List<UserReccomendation> userReccomendations = new List<UserReccomendation>();
            UserReccomendation userReccomendation = new UserReccomendation()
            {
                ReccomendedTo = reccomendedTo,
                RecomendedBy = recomendedBy,
                Isbn = isbn,
                Title = title,
                Author = author,
                Subject = subject,
                AverageRating = averageRating,
                RatingsCount = ratingsCount,
                BookThumbnailUrl = bookThumbnailUrl,
                Description = description
            };
            
            if(!userReccomendations.Contains(userReccomendation))
            {
                context.UserReccomendations.Add(userReccomendation);
                context.SaveChanges();
            }
            return userReccomendation;
        }

        [HttpGet("GetUserReccomendations")]
        public List<UserReccomendation> GetUserReccomendations(string userId)
        {
            return context.UserReccomendations.Where(r => r.ReccomendedTo == userId).ToList();
        }
    }
}
