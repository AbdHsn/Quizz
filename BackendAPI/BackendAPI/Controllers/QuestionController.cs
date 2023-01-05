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
    public class QuestionController : ControllerBase
    {

        #region Properties
        private readonly IEntityRepo<questions> _question;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        #endregion

        #region Constructor
        public QuestionController(
           IEntityRepo<questions> question,
           IHubContext<BroadcastHub, IHubClient> hubContext
        )
        {
            _question = question;
            _hubContext = hubContext;
        }
        #endregion

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var getquestion = await _question.GetAll();
                return Ok(getquestion);
            }
            catch (Exception ex)
            {
                return BadRequest("Process failed.");
            }
        }
        
        [HttpGet("GetQuizWithTopic")]
        public async Task<IActionResult> GetQuizWithTopic(string topic)
        {
            try
            {
                var getquestion = await _question.GetByFilter(w => w.topic.ToLower() == topic.ToLower());
                return Ok(new
                {
                    questions = getquestion,
                    total_questions = getquestion.Count,
                    total_times = getquestion.Sum(s => s.time_in_minutes)
                }); ;
            }
            catch (Exception ex)
            {
                return BadRequest("Process failed.");
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> Create(questions model)
        {
            try
            {
                #region Validation
                if (model == null)
                    return BadRequest("Invalid data.");

                var validationCheck = await new QuestionsValidation().ValidateAsync(model);

                if (!validationCheck.IsValid)
                    return BadRequest(validationCheck.Errors);

                #endregion Validation

                var newquestion = await _question.Insert(model);
                return Ok(newquestion);
            }
            catch (Exception)
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

                var getquestion = await _question.GetById(w => w.id == id);

                if (getquestion == null)
                {
                    return NotFound("Requested item is not found.");
                }

                await _question.Delete(getquestion);

                return Ok(true);
            }
            catch (Exception)
            {
                return BadRequest("Process failed.");
            }
        }
    }
}
