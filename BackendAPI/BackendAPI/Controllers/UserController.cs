using APIDotNetCore.Models.Validation;
using BackendAPI.SignalREndPoints;
using DataLayer.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RepositoryLayer;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {

        #region Properties
        private readonly IEntityRepo<user> _user;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        #endregion

        #region Constructor
        public UserController(
           IEntityRepo<user> user,
           IHubContext<BroadcastHub, IHubClient> hubContext
        )
        {
            _user = user;
            _hubContext = hubContext;
        }
        #endregion

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var getUser = await _user.GetAll();
                return Ok(getUser);
            }
            catch (Exception ex)
            {
                return BadRequest("Process failed.");
            }
        }
        
        [HttpGet("GetByUserName")]
        public async Task<IActionResult> GetUserByUserName(string userName)
        {
            try
            {
                var getUser = await _user.GetByFilter(u => u.user_name.ToLower() == userName.ToLower());

                return Ok(getUser.FirstOrDefault());
            }
            catch (Exception ex)
            {
                return BadRequest("Process failed.");
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> Create(user model)
        {
            try
            {
                #region Validation
                if (model == null)
                    return BadRequest("Invalid data.");

                var validationCheck = await new UserValidation().ValidateAsync(model);

                if (!validationCheck.IsValid)
                    return BadRequest(validationCheck.Errors);

                #endregion Validation

                var newUser = await _user.Insert(model);
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return BadRequest("Process failed.");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest("Data is not valid.");

                var getUser = await _user.GetById(w => w.id == id);

                if (getUser == null)
                {
                    return NotFound("Requested item is not found.");
                }

                await _user.Delete(getUser);

                return Ok(true);
            }
            catch (Exception)
            {
                return BadRequest("Process failed.");
            }
        }
    }
}
