using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using AuthoringAndCustomization.Models;
using AuthoringAndCustomization.Services;

namespace AuthoringAndCustomization.Controllers {

  public class UserBookmarks {
    public IList<SharedBookmark> SharedBookmarks { get; set; }
    public IList<PersonalBookmark> PersonalBookmarks { get; set; }
  }

  [Route("api/[controller]")]
  [ApiController]
  public class BookmarksController : ControllerBase {

    private readonly AppOwnsDataCustomizationDbService appOwnsDataCustomizationDbService;

    public BookmarksController(AppOwnsDataCustomizationDbService appOwnsDataCustomizationDbService) {
      this.appOwnsDataCustomizationDbService = appOwnsDataCustomizationDbService;
    }

    [HttpGet]
    public UserBookmarks GetUserBookmarks(string UserId, string ReportId) {

      return new UserBookmarks {
        SharedBookmarks = this.appOwnsDataCustomizationDbService.GetSharedBookmarks(ReportId),
        PersonalBookmarks = this.appOwnsDataCustomizationDbService.GetPersonalBookmarks(UserId, ReportId)
      };

    }

  }
}
