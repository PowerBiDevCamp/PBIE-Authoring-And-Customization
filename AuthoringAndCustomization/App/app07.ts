import * as $ from 'jquery';
import { Modal } from 'bootstrap';

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";

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
        pageNavigation: { visible: false, position: models.PageNavigationPosition.Left }
      }
    }
  };

  let report: powerbi.Report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

  report.on("loaded", async () => {
    UiBuilder.AddLeftNavigationHeader("Report Bookmarks");
    let Bookmarks: models.IReportBookmark[] = await report.bookmarksManager.getBookmarks();
    Bookmarks.forEach((bookmark: models.IReportBookmark) => {
      UiBuilder.AddLeftNavigationItem(bookmark.displayName, () => {
        report.bookmarksManager.apply(bookmark.name);
      })
    });
  });

  report.on("error", (arg) => {
    console.log("ERROR", arg);
  });

  // create variables to manage Create Bookmark model dialog
  let createBookmarkDiv: HTMLElement = document.getElementById('create-bookmark-dialog');
  let createBookmarkDialog = new Modal(createBookmarkDiv, { keyboard: false, focus: true });

  UiBuilder.AddCommandButton("Capture Bookmark", async () => {
    $("#bookmark-name").val("");
    createBookmarkDialog.show();
    $("#bookmark-name").focus();
  });

  let showLeftNav: boolean = false;
  UiBuilder.AddCommandButton("Toggle Left Nav", () => {
    showLeftNav = !showLeftNav;
    report.updateSettings({
      panes: { pageNavigation: { visible: showLeftNav } }
    });

  });

  let firstBookmarkCreated: boolean = false;

  $("#create-bookmark").click(async () => {

    if (firstBookmarkCreated == false) {
      UiBuilder.AddLeftNavigationHeader("Custom Bookmarks");
      firstBookmarkCreated = true;
    }

    let bookmarkName: string = $("#bookmark-name").val().toString();

    // capture custom bookmark
    let bookmark = await report.bookmarksManager.capture({ personalizeVisuals: true, allPages: true });

    // update bookmark display name
    bookmark.displayName = bookmarkName;

    console.log("Bookmark captured", bookmark);

    UiBuilder.AddLeftNavigationItem(bookmark.displayName, () => {
      console.log("Applying state for bookmark", bookmark);
      report.bookmarksManager.applyState(bookmark.state);
    });

  });

  $("#bookmark-name").on("input", () => {
    let nameIsEmpty = $("#bookmark-name").val() == "";
    $("#create-bookmark").prop('disabled', nameIsEmpty);
    $("#create-shared-bookmark").prop('disabled', nameIsEmpty);
  });

  UiBuilder.ResizeEmbedContainer();

});


