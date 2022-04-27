import * as $ from 'jquery';
import { Modal } from 'bootstrap'

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";

import { UiBuilder } from './services/uibuilder';
import { ViewModel } from './models/viewmodel';
import { WebApi } from './services/webapi'

// ensure Power BI JavaScript API has loaded
require('powerbi-models');
require('powerbi-client');

$(() => {

  let reportContainer: HTMLElement = document.getElementById("embed-container");
  let viewModel: ViewModel = window["viewModel"];
  UiBuilder.InitilizeEmbedContainer();

  let config: powerbi.IReportEmbedConfiguration = {
    type: 'report',
    id: viewModel.reportId,
    embedUrl: viewModel.embedUrl,
    accessToken: viewModel.token,
    permissions: models.Permissions.Create,
    tokenType: models.TokenType.Embed,
    viewMode: models.ViewMode.Edit,
    settings: {
      useCustomSaveAsDialog: true,
      panes: {
        pageNavigation: { visible: false, position: models.PageNavigationPosition.Left },
        filters: { visible: true, expanded: false }
      }
    }
  };

  console.log(config);

  let report: powerbi.Report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

  let SaveAsDialogDiv: HTMLElement = document.getElementById('saveas-dialog');
  let SaveAsDialog = new Modal(SaveAsDialogDiv, { keyboard: false, focus: true });

  $("#save-report").click(async () => {

    // save report to source workspace
    await report.saveAs({
      name: $("#report-name").val().toString()
    });

  });

  
  $("#save-report-to-target").click(async () => {

    // save report to target workspace
    await report.saveAs({
      name: $("#report-name").val().toString(),
      targetWorkspaceId: viewModel.targetWorkspaceId
    });

  });

  $("#report-name").on("input", () => {
    let nameIsEmpty = $("#report-name").val() == "";
    $("#save-report").prop('disabled', nameIsEmpty);
    $("#save-report-to-target").prop('disabled', nameIsEmpty);
  });

  // this event handle fires when user selects SaveAs
  report.on("saveAsTriggered", (args) => {
    // initialize and display custom SaveAs dialog
    $("#report-name").val("");
    SaveAsDialog.show();
    $("#report-name").focus();
  });

  report.on("saved", async (event: any) => {
    if (event.detail.saveAs) {
      console.log("SaveAs Event", event);
      let reportId = event.detail.reportObjectId;
      LoadCustomizeReport(reportId);
    }
  });

  let LoadCustomizeReport = async (ReportId: string) => {

    config = {
      type: 'report',
      id: ReportId,
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=" + ReportId,
      accessToken: await WebApi.GetEmbedToken(),
      permissions: models.Permissions.All,
      tokenType: models.TokenType.Embed,
      viewMode: models.ViewMode.Edit,
      settings: {
        authoringHintsEnabled: true,
        useCustomSaveAsDialog: true,
        panes: {
          pageNavigation: { visible: false, position: models.PageNavigationPosition.Left },
          filters: { visible: true, expanded: false }
        }
      }
    };

    window.powerbi.reset(reportContainer);
    report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

    report.on("saveAsTriggered", (args) => {
      SaveAsDialog.show();
      $("#report-name").focus();
    });

    report.on("saved", async (event: any) => {
      if (event.detail.saveAs) {
        LoadCustomizeReport(event.detail.reportObjectId);
      }
    });

  };

});

