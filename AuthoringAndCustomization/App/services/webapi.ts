import * as $ from 'jquery';
import { ReportSubscription } from '../models/subscription';

import { PersonalBookmark, SharedBookmark, Bookmarks } from './../models/bookmarks';

export class WebApi {

  static GetEmbedToken = async () => {

    let restUrl = "/api/EmbedToken";
    return $.ajax({
      url: restUrl,
      method: "GET",
      headers: {
        "Accept": "application/text",
      }
    });

  }

  static GetBookmarks = async (UserId: string, ReportId: string) : Promise<Bookmarks> => {

    let restUrl = "/api/Bookmarks/?UserId=" + UserId + "&ReportId=" + ReportId;
    return $.ajax({
      url: restUrl,
      method: "GET",
      headers: {
        "Accept": "application/json",
      }
    });

  }

  static CreatePersonalBookmark = async (Bookmark: PersonalBookmark): Promise<PersonalBookmark> => {

    let restUrl = "/api/PersonalBookmarks/";
    return $.ajax({
      url: restUrl,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(Bookmark),
      headers: {
        "Accept": "application/json",
      }
    });
  }

  static CreateSharedBookmark = async (Bookmark: SharedBookmark): Promise<SharedBookmark> => {

    let restUrl = "/api/SharedBookmarks/";
    return $.ajax({
      url: restUrl,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(Bookmark),
      headers: {
        "Accept": "application/json",
      }
    });

  }

  static CreateReportSubscription = async (Subscription: ReportSubscription): Promise<ReportSubscription> => {

    let restUrl = "/api/ReportSubscriptions/";
    return $.ajax({
      url: restUrl,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(Subscription),
      headers: {
        "Accept": "application/json",
      }
    });

  }

}