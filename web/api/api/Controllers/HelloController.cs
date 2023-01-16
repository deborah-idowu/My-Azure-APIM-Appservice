using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
        public string Get()
        {
            var result = new
            {
                message = "Hello from .NET API"
            };
            return JsonConvert.SerializeObject(result);
        }
    }
}