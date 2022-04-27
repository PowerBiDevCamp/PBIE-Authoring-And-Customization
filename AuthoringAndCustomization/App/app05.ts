import * as $ from 'jquery';

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";
import * as powerbiauthor from "powerbi-report-authoring";
import { Page } from 'page';

import { UiBuilder } from './services/uibuilder';
import { ViewModel } from './models/viewmodel';
import { IVisualResponse } from 'powerbi-report-authoring/dist/models';
import { VisualDescriptor } from 'visualDescriptor';

// ensure Power BI JavaScript API has loaded
require('powerbi-models');
require('powerbi-client');
require('powerbi-report-authoring');

$(() => {

  var reportContainer: HTMLElement = document.getElementById("embed-container");
  let viewModel: ViewModel = window["viewModel"];
  UiBuilder.InitilizeEmbedContainer();

  const schemaColumn = "http://powerbi.com/product/schema#column";
  const schemaMeasure = "http://powerbi.com/product/schema#measure";
  const schemaProperty = "http://powerbi.com/product/schema#property";

  const columnSalesRegion = { table: "Customers", column: "Sales Region", $schema: schemaColumn };
  const columnState = { table: "Customers", column: "State", $schema: schemaColumn };
  const columnQuarter = { table: "Calendar", column: "Quarter", $schema: schemaColumn };

  const measureSalesRevenue = { table: "Sales", measure: "Sales Revenue", $schema: schemaMeasure };
  const measureUnitsSold = { table: "Sales", measure: "Units Sold", $schema: schemaMeasure };
  const measureCustomerCount = { table: "Sales", measure: "Customer Count", $schema: schemaMeasure };
  
  let config: powerbi.IReportEmbedConfiguration = {
    type: 'report',
    id: viewModel.reportId,
    embedUrl: viewModel.embedUrl,
    accessToken: viewModel.token,
    permissions: models.Permissions.ReadWrite,
    tokenType: models.TokenType.Embed,
    viewMode: models.ViewMode.Edit,
    settings: {
      panes: {
        filters: { visible: true, expanded: false }
      }
    }
  };

  let report: powerbi.Report = <powerbi.Report>window.powerbi.embed(reportContainer, config);

  let newPageCount = 1;

  UiBuilder.AddCommandButton("Create Page", async () => {

    // add a new page to report
    let newPage: Page = await report.addPage("Test Page " + newPageCount);

    console.log("New Page", newPage);
    newPageCount++;
  });

  UiBuilder.AddCommandButton("Add Visual 1", async () => {

    let page: Page = await report.getActivePage();

    const visualLayout1: models.IVisualLayout = {
      x: 10, y: 10, width: 400, height: 132,
      displayState: { mode: models.VisualContainerDisplayMode.Visible }
    };

    let createVisualResponse: IVisualResponse = await page.createVisual('tableEx', visualLayout1, false);
    let visual: VisualDescriptor = createVisualResponse.visual;

    console.log("VisualDescriptor", visual);

    let capabilities = await report.getVisualCapabilities('tableEx');
    console.log("table capabilities", capabilities);

    await visual.addDataField('Values', columnSalesRegion);
    await visual.addDataField('Values', measureSalesRevenue);
    await visual.addDataField('Values', measureUnitsSold);
    await visual.addDataField('Values', measureCustomerCount);

    visual.sortBy({
      direction: models.SortDirection.Descending,
      orderBy: { table: "Sales", measure: "Sales Revenue" }
    });

    await visual.setProperty({ objectName: "border", propertyName: "visible" }, { schema: schemaProperty, value: true });

  });

  UiBuilder.AddCommandButton("Add Visual 2", async () => {

    let page: Page = await report.getActivePage();

    const visualLayout2: models.IVisualLayout = {
      x: 10, y: 146, width: 400, height: 566,
      displayState: { mode: models.VisualContainerDisplayMode.Visible }
    };

    let createVisualResponse: IVisualResponse = await page.createVisual('tableEx', visualLayout2, false);
    let visual: VisualDescriptor = createVisualResponse.visual;

    await visual.addDataField('Values', columnState);
    await visual.addDataField('Values', measureSalesRevenue);
    await visual.addDataField('Values', measureUnitsSold);
    await visual.addDataField('Values', measureCustomerCount);

    visual.sortBy({
      direction: models.SortDirection.Descending,
      orderBy: { table: "Sales", measure: "Sales Revenue" }
    });

    await visual.setProperty({ objectName: "border", propertyName: "visible" }, { schema: schemaProperty, value: true });

  });

  UiBuilder.AddCommandButton("Add Visual 3", async () => {

    let page: Page = await report.getActivePage();

    const visualLayout3: models.IVisualLayout = {
      x: 420, y: 10, width: 852, height: 356,
      displayState: { mode: models.VisualContainerDisplayMode.Visible }
    };

    let createVisualResponse: IVisualResponse = await page.createVisual('columnChart', visualLayout3, false);
    let visual: VisualDescriptor = createVisualResponse.visual;

    let capabilities = await report.getVisualCapabilities('columnChart');
    console.log("column chart capabilities", capabilities);

    await visual.addDataField('Category', columnQuarter);
    await visual.addDataField('Series', columnSalesRegion);
    await visual.addDataField('Y', measureSalesRevenue);

    await visual.setProperty({ objectName: "border", propertyName: "visible" }, { schema: schemaProperty, value: true });
    await visual.setProperty({ objectName: "title", propertyName: "visible" }, { schema: schemaProperty, value: false });
    await visual.setProperty({ objectName: "legend", propertyName: "position" }, { schema: schemaProperty, value: models.LegendPosition.Right });

  });

  UiBuilder.AddCommandButton("Add Visual 4", async () => {

    let page: Page = await report.getActivePage();

    const visualLayout4: models.IVisualLayout = {
      x: 420, y: 376, width: 852, height: 348,
      displayState: { mode: models.VisualContainerDisplayMode.Visible }
    };

    let createVisualResponse: IVisualResponse = await page.createVisual('map', visualLayout4, false);
    let visual: VisualDescriptor = createVisualResponse.visual;

    let capabilities = await report.getVisualCapabilities('map');
    console.log("Map capabilities", capabilities);

    await visual.addDataField('Category', columnState);
    await visual.addDataField('Size', measureSalesRevenue);
    await visual.addDataField('Tooltips', measureUnitsSold);
    await visual.addDataField('Tooltips', measureCustomerCount);

    await visual.setProperty({ objectName: "border", propertyName: "visible" }, { schema: schemaProperty, value: true });
    await visual.setProperty({ objectName: "title", propertyName: "visible" }, { schema: schemaProperty, value: false });

  });

});

