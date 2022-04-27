import * as $ from 'jquery';


export class UiBuilder {


  public static InitilizeEmbedContainer() {
    this.ResizeEmbedContainer();
    $(window).on("resize", this.ResizeEmbedContainer);
  }

  public static ResizeEmbedContainer() {
    let heightBuffer = 8;
    let heightHeader = $("header").height();
    let heightWindow = $(window).height();
    let newHeight = heightWindow - (heightHeader + heightBuffer);
    $("#embed-container").height(newHeight);
  };

  public static AddInLineHeader(caption: string): void {

    let header = $("<span>")
      .addClass("inline-header")
      .text(caption);

    let toolbar: JQuery = $("#embed-toolbar");
    toolbar.append(header);

  }

  public static AddCommandButton(caption: string, command: Function): void {   
    
    $("#embed-toolbar-container").show();

    let button = $("<button>", { type: "button" })
      .addClass("btn btn-primary btn-sm")
      .text(caption)
      .val(caption)
      .click(() => { command(); });

    let listitem: JQuery = $("<li>").addClass("nav-item").append(button);

    let toolbar: JQuery = $("#embed-toolbar");
    toolbar.append(listitem);
    this.ResizeEmbedContainer();

  }

  public static AddCheckbox(caption: string, id: string, checked: boolean, command: Function): void {

    $("#embed-toolbar-container").show();

    let input: JQuery = $("<input>", { type: "checkbox", id: id, value: caption })
      .addClass("form-check-input")
      .click(() => { command(); });

    if (checked) {
      input.attr("checked", "checked");
    }

    let label: JQuery = $("<label>", { for: id })
      .text(caption)
      .addClass("form-check-label")
      .click(() => { command(); });

    let div: JQuery = $("<div>")
      .addClass("form-check")
      .addClass("form-check-inline")
      .append(input)
      .append(label);

    let toolbar: JQuery = $("#embed-toolbar");
    toolbar.append(div);
    this.ResizeEmbedContainer();

  }

  public static AddRadioButton(caption: string, id: string, name: string, checked: boolean ,command: Function): void {

    $("#embed-toolbar-container").show();

    let input: JQuery = $("<input>", { type: "radio",id: id, name: name, value: caption })
      .addClass("form-check-input")
      .click(() => { command(); });

    if (checked) {
      input.attr("checked", "checked");
    }

    let label: JQuery = $("<label>", { for: id })
      .text(caption)
      .addClass("form-check-label")
      .click(() => { command(); });

    let div: JQuery = $("<div>")
      .addClass("form-check")
      .addClass("form-check-inline")
      .append(input)
      .append(label);

    let toolbar: JQuery = $("#embed-toolbar");
    toolbar.append(div);
    this.ResizeEmbedContainer();

  }

  public static AddUserWelcome(user: string): void {

    let header = $("<span>", { id: "user-welcome"} )
      .addClass("ms-auto")
      .text(user);

    let toolbar: JQuery = $("#embed-toolbar");
    toolbar.append(header);
  }


  private static leftNavigationEnabled: boolean = false;

  public static EnableLeftNavigation(): void {

    let leftNavWidth: string = "180px";

    $("#embed-container").css({ "margin-left": leftNavWidth });

    let leftNav: JQuery = $("<div>", { id: "left-nav" }).css({ float: "left", width: leftNavWidth });

    let leftNavItemContainer: JQuery = $("<ul>", { id: "left-nav-item-container" }).css({ width: "100%" });

    leftNav.append(leftNavItemContainer);

    $("#embed-content-box").prepend(leftNav);
     

    this.leftNavigationEnabled = true;

  }

  public static EnsureLeftNavigation(): void {
    if (!this.leftNavigationEnabled) {
      this.EnableLeftNavigation();
    }
  }

  public static AddLeftNavigationHeader(caption: string): void {
    this.EnsureLeftNavigation();

    let leftNavHeader: JQuery =
      $("<li>")
        .text(caption).addClass("navbar-header");

    $("#left-nav-item-container").append(leftNavHeader);

  }

  public static AddLeftNavigationItem(caption: string, command: Function): void {
    this.EnsureLeftNavigation();

    let leftNavItem: JQuery =
      $("<li>")
        .addClass("nav-item")
        .append(
          $("<a>", { href: "javascript: void(0);" })
            .text(caption)
            .addClass("nav-link"))
            .click(() => {
              command();
            });

    $("#left-nav-item-container").append(leftNavItem);

  }

  public static RemoveLeftNavigation(): void {
    $("#embed-container").css({ "margin-left": "0px" });
    $("#left-nav").remove();
    this.leftNavigationEnabled = false;
  }

}
