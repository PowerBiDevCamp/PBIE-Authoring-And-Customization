import * as $ from 'jquery';

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";
import { Page } from 'page';
import { ICustomEvent, IEventHandler } from 'service';

import { UiBuilder } from './services/uibuilder';
import { ViewModel } from './models/viewmodel';
import { LayoutBuilder } from './services/layoutbuilder';

// ensure Power BI JavaScript API has loaded
require('powerbi-models');
require('powerbi-client');

$(() => {

  let reportContainer: HTMLElement = document.getElementById("embed-container");
  let viewModel: ViewModel = window["viewModel"];
  UiBuilder.InitilizeEmbedContainer();

  let pageNameSalesBreakdown = "ReportSectionf349759215f3d34cfb0e";
  let visualName1 = "98cce181612d46af7720";
  let visualName2 = "3c5ff0382f57752baae2";
  let visualName3 = "773dc5f43c1db5188d38";
  let visualName4 = "5e633ff71a1be7a30f38";
  let visualName5 = "b1620b50467d4789fa30";
  let visualName6 = "331cea7dd94a0d7d1809";

  let displayModeVisible = { mode: models.VisualContainerDisplayMode.Visible }
  let displayModeHidden = { mode: models.VisualContainerDisplayMode.Hidden}

  let config: powerbi.IReportEmbedConfiguration = {
    type: 'report',
    id: viewModel.reportId,
    embedUrl: viewModel.embedUrl,
    accessToken: viewModel.token,
    permissions: models.Permissions.All,
    tokenType: models.TokenType.Embed,
    viewMode: models.ViewMode.View,
    pageName: pageNameSalesBreakdown,
    settings: {
      panes: {
        filters: { visible: false, expanded: true },
        pageNavigation: { visible: false }
      }
    }
  };

  let report: powerbi.Report = <powerbi.Report>window.powerbi.embed(reportContainer, config);


  UiBuilder.AddInLineHeader("Static Layouts:")

  UiBuilder.AddCommandButton("4 per row", async () => {

    let currentPage = await report.getPageByName(pageNameSalesBreakdown);
    let pageWidth = currentPage.defaultSize.width;

    let margin: number = 6;
    let width: number = ((pageWidth - (margin * 5)) / 4);
    let height: number = width * (4 / 5);

    let pageHeight: number = (height * 2) + (margin * 3);

    let pageSize: models.ICustomPageSize = {
      type: models.PageSizeType.Custom,
      width: pageWidth,
      height: pageHeight
    };


    let settings: models.ISettings = {
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth,
        pageSize: pageSize,
        pagesLayout: {
          [pageNameSalesBreakdown]: {
            visualsLayout: {
              [visualName1]: { x: margin, y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName2]: { x: width + (margin * 2), y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName3]: { x: (width * 2) + (margin * 3), y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName4]: { x: (width * 3) + (margin * 4), y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName5]: { x: margin, y: height + (margin * 2), width: width, height: height, displayState: displayModeVisible },
              [visualName6]: { x: width + (margin * 2), y: height + (margin * 2), width: width, height: height, displayState: displayModeVisible }
            }
          }
        }
      }
    };

    report.updateSettings(settings);

    UiBuilder.ResizeEmbedContainer();

  });

  UiBuilder.AddCommandButton("3 per row", async () => {

    let currentPage = await report.getPageByName(pageNameSalesBreakdown);
    let pageWidth = currentPage.defaultSize.width;

    let margin: number = 8;
    let width: number = ((pageWidth - (margin * 4)) / 3);
    let height: number = width * (2 / 3);

    let pageHeight: number = (height * 2) + (margin * 3);

    let pageSize: models.ICustomPageSize = {
      type: models.PageSizeType.Custom,
      width: pageWidth,
      height: pageHeight
    };

    let settings: models.ISettings = {
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth,
        pageSize: pageSize,
        pagesLayout: {
          [pageNameSalesBreakdown]: {
            visualsLayout: {
              [visualName1]: { x: margin, y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName2]: { x: width + (margin * 2), y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName3]: { x: (width * 2) + (margin * 3), y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName4]: { x: margin, y: height + (margin * 2), width: width, height: height, displayState: displayModeVisible },
              [visualName5]: { x: width + (margin * 2), y: height + (margin * 2), width: width, height: height, displayState: displayModeVisible },
              [visualName6]: { x: (width * 2) + (margin * 3), y: height + (margin * 2), width: width, height: height, displayState: displayModeVisible }
            }
          }
        }
      }
    };

    console.log(settings);

    report.updateSettings(settings);
    UiBuilder.ResizeEmbedContainer();

  });

  UiBuilder.AddCommandButton("2 per row", async () => {

    let currentPage = await report.getPageByName(pageNameSalesBreakdown);
    let pageWidth = currentPage.defaultSize.width;

    let margin: number = 8;
    let width: number = ((pageWidth - (margin * 3)) / 2);
    let height: number = width * (9 / 16);

    let pageHeight: number = (height * 3) + (margin * 4);

    let pageSize: models.ICustomPageSize = {
      type: models.PageSizeType.Custom,
      width: pageWidth,
      height: pageHeight
    };

    let settings: models.ISettings = {
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth,
        pageSize: pageSize,
        pagesLayout: {
          [pageNameSalesBreakdown]: {
            visualsLayout: {
              [visualName1]: { x: margin, y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName2]: { x: width + (margin * 2), y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName3]: { x: margin, y: height + (margin * 2), width: width, height: height, displayState: displayModeVisible },
              [visualName4]: { x: width + (margin * 2), y: height + (margin * 2), width: width, height: height, displayState: displayModeVisible },
              [visualName5]: { x: margin, y: (height * 2) + (margin * 3), width: width, height: height, displayState: displayModeVisible },
              [visualName6]: { x: width + (margin * 2), y: (height * 2) + (margin * 3), width: width, height: height, displayState: displayModeVisible }
            }
          }
        }
      }
    };

    report.updateSettings(settings);

    UiBuilder.ResizeEmbedContainer();

  });

  UiBuilder.AddCommandButton("1 per row", async () => {

    let currentPage = await report.getPageByName(pageNameSalesBreakdown);
    let pageWidth = currentPage.defaultSize.width;

    let margin: number = 12;
    let width: number = pageWidth - (margin * 2);
    let height: number = width * (6 / 16);

    let pageHeight: number = (height * 6) + (margin * 7);

    let pageSize: models.ICustomPageSize = {
      type: models.PageSizeType.Custom,
      width: pageWidth,
      height: pageHeight
    };

    let settings: models.ISettings = {
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth,
        pageSize: pageSize,
        pagesLayout: {
          [pageNameSalesBreakdown]: {
            visualsLayout: {
              [visualName1]: { x: margin, y: margin, width: width, height: height, displayState: displayModeVisible },
              [visualName2]: { x: margin, y: height + (margin * 2), width: width, height: height, displayState: displayModeVisible },
              [visualName3]: { x: margin, y: (height * 2) + (margin * 3), width: width, height: height, displayState: displayModeVisible },
              [visualName4]: { x: margin, y: (height * 3) + (margin * 4), width: width, height: height, displayState: displayModeVisible },
              [visualName5]: { x: margin, y: (height * 4) + (margin * 5), width: width, height: height, displayState: displayModeVisible },
              [visualName6]: { x: margin, y: (height * 5) + (margin * 6), width: width, height: height, displayState: displayModeVisible }
            }
          }
        }
      }
    };

    report.updateSettings(settings);

    // $("#embed-container").height(pageHeight);
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.AddInLineHeader("Dynamic Layouts:")

  UiBuilder.AddCommandButton("4 per row", async () => {
    LayoutBuilder.CreateDynamicLayout(report, 4);
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.AddCommandButton("3 per row", async () => {
    LayoutBuilder.CreateDynamicLayout(report, 3);
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.AddCommandButton("2 per row", async () => {
    LayoutBuilder.CreateDynamicLayout(report, 2);
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.AddCommandButton("1 per row", async () => {
    LayoutBuilder.CreateDynamicLayout(report, 1);
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.AddInLineHeader("Misc:")

  UiBuilder.AddCommandButton("Reset Default", async () => {
    report = <powerbi.Report>window.powerbi.embed(reportContainer, config);
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.AddCommandButton("Show Map", async () => {

    let currentPage = await report.getPageByName(pageNameSalesBreakdown);
    let pageWidth = currentPage.defaultSize.width;

    let margin: number = 6;
    let width: number = pageWidth - (margin * 2);
    let height: number = width * (0.48);

    let pageHeight: number = height + (margin * 2);

    let pageSize: models.ICustomPageSize = {
      type: models.PageSizeType.Custom,
      width: pageWidth,
      height: pageHeight
    };

    let settings: models.ISettings = {
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth,
        pageSize: pageSize,
        pagesLayout: {
          [pageNameSalesBreakdown]: {
            defaultLayout: { displayState: { mode: models.VisualContainerDisplayMode.Hidden } },
            visualsLayout: {
              [visualName4]: {
                x: margin,
                y: margin,
                width: width,
                height: height,
                displayState: { mode: models.VisualContainerDisplayMode.Visible }
              },
            }
          }
        }
      }
    };

    report.updateSettings(settings);

    UiBuilder.ResizeEmbedContainer();
  });

  let visualsArray = [visualName1, visualName2, visualName3, visualName4, visualName5, visualName5, visualName6];
  let nextVisual = 0;

  UiBuilder.AddCommandButton("Next Visual", async () => {

    let visualIndex = nextVisual % visualsArray.length;
    let visualName = visualsArray[visualIndex];
    // increment variable for next time
    nextVisual++;

    let currentPage = await report.getPageByName(pageNameSalesBreakdown);
    let pageWidth = currentPage.defaultSize.width;

    let margin: number = 6;
    let width: number = pageWidth - (margin * 2);
    let height: number = width * (0.48);

    let pageHeight: number = height + (margin * 2);

    let pageSize: models.ICustomPageSize = {
      type: models.PageSizeType.Custom,
      width: pageWidth,
      height: pageHeight
    };

    let settings: models.ISettings = {
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth,
        pageSize: pageSize,
        pagesLayout: {
          [pageNameSalesBreakdown]: {
            defaultLayout: { displayState: { mode: models.VisualContainerDisplayMode.Hidden } },
            visualsLayout: {
              [visualName]: { x: margin, y: margin, width: width, height: height, displayState: { mode: models.VisualContainerDisplayMode.Visible } },
            }
          }
        }
      }
    };
    report.updateSettings(settings);
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.ResizeEmbedContainer();



});