using Microsoft.EntityFrameworkCore;

namespace AuthoringAndCustomization.Models {

  public class PersonalBookmark {
    public int Id { get; set; }
    public string UserId { get; set; }
    public string ReportId { get; set; }
    public string Caption { get; set; }
    public string State { get; set; }
  }

  public class SharedBookmark {
    public int Id { get; set; }
    public string ReportId { get; set; }
    public string Caption { get; set; }
    public string State { get; set; }
  }

  public class ReportSubscription {
    public int Id { get; set; }
    public string UserId { get; set; }
    public string ReportId { get; set; }
    public string Caption { get; set; }
    public string State { get; set; }
    public string ScheduleFormula { get; set; }
  }

  public class AppOwnsDataCustomizationDB : DbContext {

    public AppOwnsDataCustomizationDB(DbContextOptions<AppOwnsDataCustomizationDB> options)
    : base(options) { }

    public DbSet<PersonalBookmark> PersonalBookmarks { get; set; }
    public DbSet<SharedBookmark> SharedBookmarks { get; set; }
    public DbSet<ReportSubscription> ReportSubscriptions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

  }
}
