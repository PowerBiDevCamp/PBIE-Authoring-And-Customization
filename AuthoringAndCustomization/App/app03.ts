import * as $ from 'jquery';

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
    permissions: models.Permissions.All,
    tokenType: models.TokenType.Embed,
    viewMode: models.ViewMode.View,
    settings: {
      bars: {
        actionBar: { visible: true }
      },
      panes: {
        filters: { visible: true, expanded: false },
        pageNavigation: { visible: true, position: models.PageNavigationPosition.Left },
      }
    }
  };

  let report: powerbi.Report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

  // add support for save-as redirect
  report.on("saved", async (event: any) => {
    if (event.detail.saveAs) {
      LoadCustomizedReport(event.detail.reportObjectId);
    }
  });

  let LoadCustomizedReport = async (ReportId: string) => {

    // get new embed token with reportId for new report
    let updatedEmbedToken = await WebApi.GetEmbedToken();

    config = {
      type: 'report',
      id: ReportId,
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId=" + ReportId,
      accessToken: updatedEmbedToken,
      permissions: models.Permissions.All,
      tokenType: models.TokenType.Embed,
      viewMode: models.ViewMode.Edit,
      settings: {
        authoringHintsEnabled: true,
        panes: {
          pageNavigation: { visible: false, position: models.PageNavigationPosition.Left },
          filters: { visible: true, expanded: false }
        }
      }
    };

    window.powerbi.reset(reportContainer);
    report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

    report.off("saved");
    report.on("saved", async (event: any) => {
      if (event.detail.saveAs) {
        LoadCustomizedReport(event.detail.reportObjectId);
      }
    });

  };

  // add menu items for user customization

  UiBuilder.AddInLineHeader("View Mode:");

  UiBuilder.AddRadioButton("View", "ViewMode", "ViewMode", true, () => {
    report.switchMode(models.ViewMode.View);
    report.updateSettings({ bars: { actionBar: { visible: false } } });
    UpdateUI(false);

  });

  UiBuilder.AddRadioButton("Edit", "EditMode", "ViewMode", false, () => {

    report.switchMode(models.ViewMode.Edit);
    report.updateSettings({ bars: { actionBar: { visible: true } } });

    UpdateUI(true);
  });

  UiBuilder.AddInLineHeader("Action Bar:");

  UiBuilder.AddRadioButton("On", "ActionBarOn", "ActionBar", true, () => {
    report.updateSettings({ bars: { actionBar: { visible: true } } });
  });

  UiBuilder.AddRadioButton("Off", "ActionBarOff", "ActionBar", false, () => {
    report.updateSettings({ bars: { actionBar: { visible: false } } });
  });

  let UpdateUI = (editMode: Boolean) => {
    $("#ActionBarOn").prop("disabled", editMode == false);
    $("#ActionBarOff").prop("disabled", editMode == false);
    $("#visualizationsPane").prop("disabled", editMode == false);
    $("#fieldsPane").prop("disabled", editMode == false);
    $("#selectionPane").prop("disabled", editMode == false);
    $("#syncSlicersPane").prop("disabled", editMode == false);
  };

  UiBuilder.AddInLineHeader("Show Panes:");

  UiBuilder.AddCheckbox("Filters", "filtersPane", true, (args: any) => {
    let checked: boolean = $("#filtersPane").is(':checked');
    report.updateSettings({ panes: { filters: { visible: checked } } });
  });

  UiBuilder.AddCheckbox("Bookmarks", "bookmarksPane", false, (args: any) => {
    let checked: boolean = $("#bookmarksPane").is(':checked');
    report.updateSettings({ panes: { bookmarks: { visible: checked } } });
  });

  UiBuilder.AddCheckbox("Visualizations", "visualizationsPane", true, (args: any) => {
    let checked: boolean = $("#visualizationsPane").is(':checked');
    report.updateSettings({ panes: { visualizations: { visible: checked } } });
  });

  UiBuilder.AddCheckbox("Fields", "fieldsPane", true, (args: any) => {
    let checked: boolean = $("#fieldsPane").is(':checked');
    report.updateSettings({ panes: { fields : { visible: checked } } });
  });

  UiBuilder.AddCheckbox("Selection", "selectionPane", false, (args: any) => {
    let checked: boolean = $("#selectionPane").is(':checked');
    report.updateSettings({ panes: { selection: { visible: checked } } });
  });

  UiBuilder.AddCheckbox("Sync Slicers", "syncSlicersPane", false, (args: any) => {
    let checked: boolean = $("#syncSlicersPane").is(':checked');
    report.updateSettings({ panes: { syncSlicers: { visible: checked } } });
  });

  UiBuilder.AddInLineHeader("Utility:");

  UiBuilder.AddCommandButton("Full Screen", () => {
    report.fullscreen();
  });

  UpdateUI(false);


});

