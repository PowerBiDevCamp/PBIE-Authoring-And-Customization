export class PersonalBookmark {
  reportId: string;
  userId: string;
  caption: string;
  state: string;
  id?: string;
}

export class SharedBookmark {
  reportId: string;
  caption: string;
  state: string;
  id?: string;
}

export class Bookmarks {
  personalBookmarks: PersonalBookmark[];
  sharedBookmarks: SharedBookmark[];
}