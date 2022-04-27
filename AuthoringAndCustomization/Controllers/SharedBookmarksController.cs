using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using AuthoringAndCustomization.Models;
using AuthoringAndCustomization.Services;

namespace AuthoringAndCustomization.Controllers {

  [Route("api/[controller]")]
  [ApiController]
  public class SharedBookmarksController : ControllerBase {

    private readonly AppOwnsDataCustomizationDbService appOwnsDataCustomizationDbService;

    public SharedBookmarksController(AppOwnsDataCustomizationDbService appOwnsDataCustomizationDbService) {
      this.appOwnsDataCustomizationDbService = appOwnsDataCustomizationDbService;
    }

    [HttpGet]
    public IList<SharedBookmark> GetSharedBookmark(string ReportId) {
      return this.appOwnsDataCustomizationDbService.GetSharedBookmarks(ReportId);
    }

    [HttpPost]
    public ActionResult<SharedBookmark> PostSharedBookmark([FromBody] SharedBookmark sharedBookmark) {
      var bookmark = this.appOwnsDataCustomizationDbService.CreateSharedBookmark(sharedBookmark);
      return Created("", bookmark);
    }



  }

}
