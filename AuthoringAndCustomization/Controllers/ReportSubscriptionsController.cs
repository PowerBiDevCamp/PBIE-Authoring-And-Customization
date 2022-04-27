using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using AuthoringAndCustomization.Models;
using AuthoringAndCustomization.Services;

namespace AuthoringAndCustomization.Controllers {

  [Route("api/[controller]")]
  [ApiController]
  public class ReportSubscriptionsController : ControllerBase {

    private readonly AppOwnsDataCustomizationDbService appOwnsDataCustomizationDbService;

    public ReportSubscriptionsController(AppOwnsDataCustomizationDbService appOwnsDataCustomizationDbService) {
      this.appOwnsDataCustomizationDbService = appOwnsDataCustomizationDbService;
    }

    [HttpPost]
    public ActionResult<ReportSubscription> PostReportSubscription([FromBody] ReportSubscription reportSubscription) {
      var subscription = this.appOwnsDataCustomizationDbService.CreateReportSubscription(reportSubscription);
      return Created("", subscription);
    }

  }
}
