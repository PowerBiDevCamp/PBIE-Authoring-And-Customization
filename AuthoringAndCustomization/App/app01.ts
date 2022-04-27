import * as $ from 'jquery';

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
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: true, position: models.PageNavigationPosition.Left }
      }
    }
  };

  let report: powerbi.Report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

  // output report object to console 
  console.log(report);

  // loop through all supported events and register each one
  report.allowedEvents.forEach((event) => {

    console.log(event + " event registered");

    // register an event handler for each type of event
    report.on(event, (args) => {

      // when event is triggered, log to console with event args
      console.log(event, args);

    })
  });

  UiBuilder.ResizeEmbedContainer();

});

