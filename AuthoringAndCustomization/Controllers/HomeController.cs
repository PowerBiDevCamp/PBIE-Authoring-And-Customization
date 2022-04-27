using AuthoringAndCustomization.Models;
using AuthoringAndCustomization.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace AuthoringAndCustomization.Controllers {

  [AllowAnonymous]
  public class HomeController : Controller {

    private PowerBiServiceApi powerBiServiceApi;

    public HomeController(PowerBiServiceApi powerBiServiceApi) {
      this.powerBiServiceApi = powerBiServiceApi;
    }

    public async Task<IActionResult> Index() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    public async Task<IActionResult> Demo01() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    public async Task<IActionResult> Demo02() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    public async Task<IActionResult> Demo03() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    public async Task<IActionResult> Demo04() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    public async Task<IActionResult> Demo05() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    public async Task<IActionResult> Demo06() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    public async Task<IActionResult> Demo07() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    public async Task<IActionResult> Demo08() {
      var viewModel = await powerBiServiceApi.GetReportEmbeddingData();
      return View(viewModel);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() {
      return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
  }
}