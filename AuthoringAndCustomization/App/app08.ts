import * as $ from 'jquery';
import { Modal } from 'bootstrap';

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";
import { Page } from 'page';
import { ICustomEvent, IEventHandler } from 'service';

import { UiBuilder } from './services/uibuilder';
import { ViewModel } from './models/viewmodel';
import { PersonalBookmark, SharedBookmark, Bookmarks } from './models/bookmarks';
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
      panes: {
        filters: { visible: false, expanded: true },
        pageNavigation: { visible: false, position: models.PageNavigationPosition.Left }
      }
    }
  };

  let report: powerbi.Report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

  let firstPersonalBookmarkCreated: boolean = false;

  report.on("loaded", async () => {

    UiBuilder.AddLeftNavigationHeader("Report Bookmarks");

    // call bookmarksManager.getBookmarks to retrieve bookmarks defiend inside report
    let Bookmarks: models.IReportBookmark[] = await report.bookmarksManager.getBookmarks();
    Bookmarks.forEach((bookmark: models.IReportBookmark) => {
      UiBuilder.AddLeftNavigationItem(bookmark.displayName, () => {
        report.bookmarksManager.apply(bookmark.name);
      })
    });

    // call backend WebApi to retrieve persisted bookmarks from database
    let bookmarks = await WebApi.GetBookmarks(viewModel.impersonatedUser, viewModel.reportId);

    // add shared bookmarks to left navigation
    if (bookmarks.sharedBookmarks.length > 0) {
      UiBuilder.AddLeftNavigationHeader("Shared Bookmarks");
      bookmarks.sharedBookmarks.forEach((bookmark) => {
        UiBuilder.AddLeftNavigationItem(bookmark.caption, () => {
          report.bookmarksManager.applyState(bookmark.state);
        });
      });
    }

    // add personal bookmarks to left navigation
    if (bookmarks.personalBookmarks.length > 0) {
      UiBuilder.AddLeftNavigationHeader("Personal Bookmarks");
      bookmarks.personalBookmarks.forEach((bookmark) => {
        UiBuilder.AddLeftNavigationItem(bookmark.caption, () => {
          console.log(bookmark);
          report.bookmarksManager.applyState(bookmark.state);
        });
      });
      firstPersonalBookmarkCreated = true;
    }

  });

  report.on("error", (arg: ICustomEvent<Error>) => {
    console.log("ERROR");
    console.log(arg);
  });

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

  UiBuilder.AddCommandButton("Create Subscription", async () => {

    let bookmark = await report.bookmarksManager.capture({ personalizeVisuals: true, allPages: true });
    bookmark.displayName = "Subscription for " + viewModel.impersonatedUser;
    console.log(bookmark);

    let response = await WebApi.CreateReportSubscription({
      userId: viewModel.impersonatedUser,
      reportId: viewModel.reportId,
      caption: bookmark.displayName,
      state: bookmark.state,
      scheduleFormula: "M-Tu-W-Th-F 8:00AM"
    });

    console.log("Report Subscription Created", response);

    alert("Report Subscription Created")

  });


  UiBuilder.AddUserWelcome("Current User: " + viewModel.impersonatedUser);

  $("#create-personal-bookmark").click(async () => {

    let bookmarkName: string = $("#bookmark-name").val().toString();
    console.log("Bookmark Name: " + bookmarkName);

    let bookmark = await report.bookmarksManager.capture({ personalizeVisuals: true, allPages: true });
    bookmark.displayName = bookmarkName;
    console.log(bookmark);

    let response = await WebApi.CreatePersonalBookmark({
      userId: viewModel.impersonatedUser,
      reportId: viewModel.reportId,
      caption: bookmark.displayName,
      state: bookmark.state
    });

    console.log("Personal bookmark created", response);

    if (firstPersonalBookmarkCreated == false) {
      UiBuilder.AddLeftNavigationHeader("Personal Bookmarks");
      firstPersonalBookmarkCreated = true;
    }

    UiBuilder.AddLeftNavigationItem(bookmark.displayName, () => {
      console.log(bookmark);
      report.bookmarksManager.applyState(bookmark.state);
    });

  });

  $("#create-shared-bookmark").click(async () => {

    let bookmarkName: string = $("#bookmark-name").val().toString();
    console.log("Bookmark Name: " + bookmarkName);

    let bookmark = await report.bookmarksManager.capture({ personalizeVisuals: true, allPages: true });
    bookmark.displayName = bookmarkName;
    console.log(bookmark);

    let response = await WebApi.CreateSharedBookmark({
      reportId: viewModel.reportId,
      caption: bookmark.displayName,
      state: bookmark.state
    });

    console.log("Shared bookmark created", response);

    window.location.reload();

  });

  $("#bookmark-name").on("input", () => {
    let nameIsEmpty = $("#bookmark-name").val() == "";
    $("#create-personal-bookmark").prop('disabled', nameIsEmpty);
    $("#create-shared-bookmark").prop('disabled', nameIsEmpty);
  });

  UiBuilder.ResizeEmbedContainer();

});


