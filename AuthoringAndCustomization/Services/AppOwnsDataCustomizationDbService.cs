using AuthoringAndCustomization.Models;

namespace AuthoringAndCustomization.Services {

  public class AppOwnsDataCustomizationDbService {

    private readonly AppOwnsDataCustomizationDB dbContext;

    public AppOwnsDataCustomizationDbService(AppOwnsDataCustomizationDB context) {
      dbContext = context;
    }

    public PersonalBookmark CreatePersonalBookmark(PersonalBookmark bookmark) {
      dbContext.PersonalBookmarks.Add(bookmark);
      dbContext.SaveChanges();
      return bookmark;
    }

    public IList<PersonalBookmark> GetPersonalBookmarks(string UserId, string ReportId) {

      return dbContext.PersonalBookmarks
                       .Select(bookmark => bookmark)
                       .Where(bookmark => bookmark.UserId == UserId)
                       .Where(bookmark => bookmark.ReportId == ReportId)
                       .OrderBy(bookmark => bookmark.Caption)
                       .ToList();
    }

    public SharedBookmark CreateSharedBookmark(SharedBookmark bookmark) {
      dbContext.SharedBookmarks.Add(bookmark);
      dbContext.SaveChanges();
      return bookmark;
    }

    public IList<SharedBookmark> GetSharedBookmarks(string ReportId) {

      return dbContext.SharedBookmarks
                       .Select(bookmark => bookmark)
                       .Where(bookmark => bookmark.ReportId == ReportId)
                       .OrderBy(bookmark => bookmark.Caption)
                       .ToList();
    }

    public ReportSubscription CreateReportSubscription(ReportSubscription subscription) {
      dbContext.ReportSubscriptions.Add(subscription);
      dbContext.SaveChanges();
      return subscription;
    }

  }

}
