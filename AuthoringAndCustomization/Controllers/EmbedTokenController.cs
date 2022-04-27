using Microsoft.AspNetCore.Mvc;
using AuthoringAndCustomization.Services;

namespace AuthoringAndCustomization.Controllers {

  [Route("api/[controller]")]
  [ApiController]
  public class EmbedTokenController : ControllerBase {

    private PowerBiServiceApi powerBiServiceApi;

    public EmbedTokenController(PowerBiServiceApi powerBiServiceApi) {
      this.powerBiServiceApi = powerBiServiceApi;
    }

    public async Task<string> GetEmbedToken() {
      return await this.powerBiServiceApi.GetEmbedToken();
    }

  }
}

