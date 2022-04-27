import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";
import { Page } from 'page';

export class LayoutBuilder {

  public static GetXforVisual(VisualIndex: number, VisualsPerRow: number, VisualWidth: number, Margin: number): number {
    let rowPosition: number = VisualIndex % VisualsPerRow;
    let x: number = (rowPosition * VisualWidth) + ((rowPosition + 1) * Margin);
    return x;
  }

  public static GetYforVisual(VisualIndex: number, VisualsPerRow: number, VisualHeight: number, Margin: number): number {
    let rowNumber = Math.floor(VisualIndex / VisualsPerRow);
    let y: number = (rowNumber * VisualHeight) + ((rowNumber + 1) * Margin)
    return y;
  }

  public static async CreateDynamicLayout(report: powerbi.Report, VisualsPerRow: number) {

    let currentPage: Page = await report.getActivePage();
    let currentPageName: string = currentPage.name;

    let pageWidth = currentPage.defaultSize.width;

    let visuals: models.IVisual[] = await currentPage.getVisuals();
    let visualCount: number = visuals.length;
    let visualRowCount: number = Math.ceil(visualCount / VisualsPerRow);

    let margin: number = 6;
    let width: number = ((pageWidth - (margin * (VisualsPerRow + 1))) / VisualsPerRow);
    let height: number = width * (9 / 16);

    let pageHeight: number = (height * visualRowCount) + (margin * (visualRowCount+1));

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
          [currentPageName]: {
            defaultLayout: { displayState: { mode: models.VisualContainerDisplayMode.Hidden } },
            visualsLayout: {}
          }
        }
      }
    };

    for (let index: number = 0; index < visualCount; index++) {
      let currentVisual: models.IVisual = visuals[index];
      let visualName: string = currentVisual.name;
      settings.customLayout.pagesLayout[currentPageName].visualsLayout[visualName] = {
        x: LayoutBuilder.GetXforVisual(index, VisualsPerRow, width, margin),
        y: LayoutBuilder.GetYforVisual(index, VisualsPerRow, height, margin),
        width: width,
        height: height,
        displayState: { mode: models.VisualContainerDisplayMode.Visible }
      };
    }

    report.updateSettings(settings);

  }


}
