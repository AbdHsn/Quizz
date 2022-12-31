using BackendAPI.SignalREndPoints;
using DataLayer.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RepositoryLayer;

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
        public ActionResult<IEnumerable<user>> Get()
        {
            try
            {
                var getUser = _user.GetAll();
                return Ok(getUser);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        //// GET api/<UserController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/<UserController>
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// PUT api/<UserController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<UserController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
