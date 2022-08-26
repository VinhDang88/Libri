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
        public User ChangePhotoUrl(string id, string photoUrl)
        {
            User user = context.Users.FirstOrDefault(x => x.Id == id);
            user.PhotoUrl = photoUrl;
            context.SaveChanges();
            return user;
        }
        //Collects NEW user information and stores to the SQL database. 
        [HttpPost("AddUser")]
        public User AddUser(string id, string firstName, string lastName, string name, string photoUrl)
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

    }
}
