using System;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Web;
using Microsoft.Rest;
using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using AuthoringAndCustomization.Models;
using AuthoringAndCustomization.Controllers;

namespace AuthoringAndCustomization.Services {

  public class EmbeddedReportViewModel {
    public string ReportId;
    public string EmbedUrl;
    public string Token;
    public string TargetWorkspaceId;
    public string ImpersonatedUser;
  }


  public class PowerBiServiceApi {

    private ITokenAcquisition tokenAcquisition { get; }
    private string urlPowerBiServiceApiRoot { get; }
    private Guid workspaceId { get; }
    private Guid reportId { get; }
    private Guid targetWorkspaceId { get; }
    private string impersonatedUser { get; }

    public PowerBiServiceApi(IConfiguration configuration, ITokenAcquisition tokenAcquisition) {
      this.urlPowerBiServiceApiRoot = configuration["PowerBi:ServiceRootUrl"];
      this.workspaceId = new Guid(configuration["PowerBi:WorkspaceId"]);
      this.reportId = new Guid(configuration["PowerBi:ReportId"]);
      this.targetWorkspaceId = new Guid(configuration["PowerBi:TargetWorkspaceId"]);
      this.impersonatedUser = configuration["PowerBi:ImpersonatedUser"];
      this.tokenAcquisition = tokenAcquisition;
    }

    public const string powerbiApiDefaultScope = "https://analysis.windows.net/powerbi/api/.default";

    public string GetAccessToken() {
      return this.tokenAcquisition.GetAccessTokenForAppAsync(powerbiApiDefaultScope).Result;
    }

    public PowerBIClient GetPowerBiClient() {
      string accessToken = GetAccessToken();
      var tokenCredentials = new TokenCredentials(accessToken, "Bearer");
      return new PowerBIClient(new Uri(urlPowerBiServiceApiRoot), tokenCredentials);
    }

    public async Task<EmbeddedReportViewModel> GetReportEmbeddingData() {

      PowerBIClient pbiClient = GetPowerBiClient();

      // call to Power BI Service API to get dataset ID
      var report = await pbiClient.Reports.GetReportInGroupAsync(this.workspaceId, this.reportId);
      var dataset = await pbiClient.Datasets.GetDatasetInGroupAsync(this.workspaceId, report.DatasetId);

      // prepare to generate embed token using V2 Embed Token API
      var datasetRequest = new GenerateTokenRequestV2Dataset { Id = report.DatasetId };
      var reportRequest = new GenerateTokenRequestV2Report { Id = report.Id };
      var workspaceRequest = new GenerateTokenRequestV2TargetWorkspace { Id = this.workspaceId };
      var targetWorkspaRequest = new GenerateTokenRequestV2TargetWorkspace { Id = this.targetWorkspaceId };

      var tokenRequest = new GenerateTokenRequestV2 {
        Datasets = new List<GenerateTokenRequestV2Dataset>() { datasetRequest },
        Reports = new List<GenerateTokenRequestV2Report>() { reportRequest },
        TargetWorkspaces = new List<GenerateTokenRequestV2TargetWorkspace>() { workspaceRequest, targetWorkspaRequest }
      };

      // call to Power BI Service API to generate embed token as serivce principal profile
      string embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest).Token;
  
      // return report embedding data to caller
      return new EmbeddedReportViewModel {
        ReportId = report.Id.ToString(),
        EmbedUrl = report.EmbedUrl,
        Token = embedToken,
        TargetWorkspaceId = this.targetWorkspaceId.ToString(),
        ImpersonatedUser = this.impersonatedUser
      };
    }

    public async Task<string> GetEmbedToken() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var workspaceRequests = new List<GenerateTokenRequestV2TargetWorkspace>();
      var datasetRequests = new List<GenerateTokenRequestV2Dataset>();
      var reportRequests = new List<GenerateTokenRequestV2Report>();

      workspaceRequests.Add(new GenerateTokenRequestV2TargetWorkspace(workspaceId));
      workspaceRequests.Add(new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId));

      var datasetsSource = (await pbiClient.Datasets.GetDatasetsInGroupAsync(workspaceId)).Value;
      foreach (var dataset in datasetsSource) {
        datasetRequests.Add(new GenerateTokenRequestV2Dataset(dataset.Id));
      };

      var reportsSource = (await pbiClient.Reports.GetReportsInGroupAsync(workspaceId)).Value;
      foreach (var report in reportsSource) {
        reportRequests.Add(new GenerateTokenRequestV2Report(report.Id, allowEdit: true));
      };
  
      var reportsTarget = (await pbiClient.Reports.GetReportsInGroupAsync(targetWorkspaceId)).Value;
      foreach (var report in reportsTarget) {
        reportRequests.Add(new GenerateTokenRequestV2Report(report.Id, allowEdit: true));
      };

      GenerateTokenRequestV2 tokenRequest =
        new GenerateTokenRequestV2 {
          Datasets = datasetRequests,
          Reports = reportRequests,
          TargetWorkspaces = workspaceRequests
        };

      // call to Power BI Service API and pass GenerateTokenRequest object to generate embed token
      var EmbedTokenResult = pbiClient.EmbedToken.GenerateToken(tokenRequest);

      // return embed token as string
      return EmbedTokenResult.Token;

    }

  }

}


