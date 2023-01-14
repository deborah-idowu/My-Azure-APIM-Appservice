using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HelloController : ControllerBase
    {
        private readonly ILogger<HelloController> _logger;

        public HelloController(ILogger<HelloController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetHello")]
        //public Hello Get()
        //{
        //    return new Hello { Message = "Hello from .NET API" };
        //}
        public string Get()
        {
            return "Hello from .NET API";
        }
    }
}