using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using AuthoringAndCustomization.Models;
using AuthoringAndCustomization.Services;

namespace AuthoringAndCustomization.Controllers {

  [Route("api/[controller]")]
  [ApiController]
  public class PersonalBookmarksController : ControllerBase {

    private readonly AppOwnsDataCustomizationDbService appOwnsDataCustomizationDbService;

    public PersonalBookmarksController(AppOwnsDataCustomizationDbService appOwnsDataCustomizationDbService) {
      this.appOwnsDataCustomizationDbService = appOwnsDataCustomizationDbService;
    }

    [HttpGet]
    public IList<PersonalBookmark> GetPersonalBookmark(string UserId, string ReportId) {
      return  this.appOwnsDataCustomizationDbService.GetPersonalBookmarks(UserId, ReportId);
    }

    [HttpPost]
    public ActionResult<PersonalBookmark> PostPersonalBookmark([FromBody] PersonalBookmark personalBookmark) {
      var bookmark = this.appOwnsDataCustomizationDbService.CreatePersonalBookmark(personalBookmark);
      return Created("", bookmark);
    }


  }
}
