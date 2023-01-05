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
    public class AnswerController : ControllerBase
    {

        #region Properties
        private readonly IEntityRepo<user> _user;
        private readonly IEntityRepo<answer> _answer;
        private readonly IEntityRepo<questions> _question;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        #endregion

        #region Constructor
        public AnswerController(
            IEntityRepo<user> user,
           IEntityRepo<answer> answer,
           IEntityRepo<questions> question,
           IHubContext<BroadcastHub, IHubClient> hubContext
        )
        {
            _user = user;
            _answer = answer;
            _question = question;
            _hubContext = hubContext;
        }
        #endregion

        [HttpGet]
        public async Task<IActionResult> GetAdminDashboard()
        {
            try
            {
                var getAnswers = await _answer.GetAll();
                var getUsers = await _user.GetAll();

                var groupedAnswer = (from ans in getAnswers
                                group ans.user_id by ans.quiz_reference into groupEntity
                                select new { quiz_reference  = groupEntity.Key, items = groupEntity.ToList() }).ToList();

                var joinQry = (from g in groupedAnswer
                              join ans in getAnswers on g.quiz_reference equals ans.quiz_reference
                              join u in getUsers on ans.user_id equals u.id
                              select new { user = u.name, quiz_reference = g.quiz_reference, total_answer = g.items.Count() }).ToList();

                return Ok(groupedAnswer);
            }
            catch (Exception)
            {
                return BadRequest("Process failed.");
            }
        }    
        
        [HttpGet("GetQuizSummary")]
        public async Task<IActionResult> GetQuizSummary(string quiz_reference)
        {
            try
            {
                var answers = await _answer.GetByFilter(f => f.quiz_reference == quiz_reference);
                var returnObj = new
                {
                    quiz_reference = answers?.FirstOrDefault()?.quiz_reference,
                    total_question = answers?.Count(),
                    correct = answers?.Where(w => w.is_correct == true)?.Count(),
                    wrong = answers?.Where(w => w.is_correct == false)?.Count()
                };
                return Ok(returnObj);
            }
            catch (Exception)
            {
                return BadRequest("Process failed.");
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> submitAnswer(answer model)
        {
            try
            {
                var newquestion = await _answer.Insert(model);
                await _hubContext.Clients.All.BroadcastMessage("quizSubmitted");
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

                var getanswer = await _answer.GetById(w => w.id == id);

                if (getanswer == null)
                {
                    return NotFound("Requested item is not found.");
                }

                await _answer.Delete(getanswer);

                return Ok(true);
            }
            catch (Exception)
            {
                return BadRequest("Process failed.");
            }
        }
    }
}
