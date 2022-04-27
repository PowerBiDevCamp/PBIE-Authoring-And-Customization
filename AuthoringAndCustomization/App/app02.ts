import * as $ from 'jquery';

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";
import { Page } from 'page';

import { UiBuilder } from './services/uibuilder';
import { ViewModel } from './models/viewmodel';

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
      panes: {
        filters: { visible: false, expanded: true },
        pageNavigation: { visible: true, position: models.PageNavigationPosition.Left }
      }
    }
  };

  let report: powerbi.Report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

  UiBuilder.AddInLineHeader("Show Panes:");

  UiBuilder.AddCheckbox("Filters", "filters", false, (args: any) => {
    let checked: boolean = $("#filters").is(':checked');
    let settings: powerbi.IEmbedSettings = {
      panes: { filters: { visible: checked, expanded: true } }
    };
    report.updateSettings(settings);
  });

  UiBuilder.AddCheckbox("Bookmarks", "bookmarks", false, (args: any) => {
    let checked: boolean = $("#bookmarks").is(':checked');
    let settings: powerbi.IEmbedSettings = {
      panes: { bookmarks: { visible: checked } }
    };
    report.updateSettings(settings);
  });

  UiBuilder.AddInLineHeader("Display Option:");
    
  UiBuilder.AddRadioButton("Fit to Page", "FitToPage", "PageView", true, () => {
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage }
    });
  });

  UiBuilder.AddRadioButton("Fit to Width", "FitToWidth", "PageView", false, () => {
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToWidth }
    });
  });

  UiBuilder.AddRadioButton("Actual Size", "actualSize", "PageView", false, () => {
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.ActualSize }
    });
  });

  UiBuilder.AddInLineHeader("Navigation:");

  UiBuilder.AddRadioButton("Left", "navigationLeft", "Navigation", true, () => {

    UiBuilder.RemoveLeftNavigation();

    if (config.settings.panes.pageNavigation.position == models.PageNavigationPosition.Left) {
      report.updateSettings({
        panes: { pageNavigation: { visible: true, position: models.PageNavigationPosition.Left } }
      });
    }
    else {
      config.settings.panes.pageNavigation = {
        visible: true, position: models.PageNavigationPosition.Left
      };
      report = <powerbi.Report>window.powerbi.embed(reportContainer, config);
    }
    UiBuilder.ResizeEmbedContainer();

  });

  UiBuilder.AddRadioButton("Off", "navigationOff", "Navigation", false, () => {

    UiBuilder.RemoveLeftNavigation();

    report.updateSettings({
      panes: {
        pageNavigation: {
          visible: false
        }
      }
    });
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.AddRadioButton("Bottom", "navigationBotton", "Navigation", false, () => {

    UiBuilder.RemoveLeftNavigation();

    if (config.settings.panes.pageNavigation.position == models.PageNavigationPosition.Bottom) {
      report.updateSettings({
        panes: { pageNavigation: { visible: true, position: models.PageNavigationPosition.Bottom } }
      });
    }
    else {
      config.settings.panes.pageNavigation = {
        visible: true, position: models.PageNavigationPosition.Bottom
      };
      report = <powerbi.Report>window.powerbi.embed(reportContainer, config);
    }
    UiBuilder.ResizeEmbedContainer();
  });

  UiBuilder.AddRadioButton("Custom", "navigationCustom", "Navigation", false, () => {

    config.settings.panes.pageNavigation.visible = false;
    report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

    report.off("loaded");
    report.on("loaded", async () => {

      UiBuilder.EnableLeftNavigation();

      UiBuilder.AddLeftNavigationHeader("Report Pages");
      let pages: Page[] = await report.getPages();
      pages.forEach((page: Page) => {
        console.log(page);
        // only show pages that are not hidden
        if (page.visibility == 0) {
          UiBuilder.AddLeftNavigationItem(page.displayName, () => {
            page.setActive();
          })
        }
      });

      UiBuilder.AddLeftNavigationHeader("Bookmarks");
      let Bookmarks: models.IReportBookmark[] = await report.bookmarksManager.getBookmarks();
      Bookmarks.forEach((bookmark: models.IReportBookmark) => {
        console.log(bookmark);
        UiBuilder.AddLeftNavigationItem(bookmark.displayName, () => {
          report.bookmarksManager.apply(bookmark.name);
        })
      });
    });

    UiBuilder.ResizeEmbedContainer();

  });

});

