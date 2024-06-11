// popups.js: standalone Javascript library for creating 'popups' which display link metadata (typically, title/author/date/summary), for extremely convenient reference/abstract reading.
// Author: Said Achmiz, Shawn Presser (mobile & Youtube support)
// Date: 2019-08-21
// When:  Time-stamp: "2020-04-10 17:10:33 gwern"
// license: MIT (derivative of footnotes.js, which is PD)

// popups.js parses a HTML document and looks for <a> links which have the 'docMetadata' attribute class, and the attributes 'data-popup-title', 'data-popup-author', 'data-popup-date', 'data-popup-doi', 'data-popup-abstract'.
// (These attributes are expected to be populated already by the HTML document's compiler, however, they can also be done dynamically. See 'https://share.obormot.net/misc/gwern/wikipedia-popups.js' for an example of a library which does Wikipedia-only dynamically on page loads.)

// Whenever any such link is mouse-overed by the user, popups.js will pop up a large tooltip-like square with the contents of the attributes. This is particularly intended for references, where it is extremely convenient to autopopulate links such as to Arxiv.org/Biorxiv.org/Wikipedia with the link's title/author/date/abstract, so the reader can see it instantly. Links to 'reverse citations' are provided as much as possible: links with DOIs go to a Semantic Scholar search engine query for that DOI, which prioritizes meta-analyses & systematic reviews to provide context for any given paper (particularly whether it has failed to replicate or otherwise been debunked); for URLs ending in 'PDF' which probably have Semantic Scholar entries, they go to a title search; and for all other URLs, a Google search using the obscure `link:` operator is provided.

// Popups save the user both time and bandwidth as they can instantly see a summary, and decide whether to pursue it further; if they had to click on it, that is both heavy-weight interaction, uses possibly several seconds to load & render, and will use many times the bandwidth.

// On mobile, clicking on links (as opposed to hovering over links on desktop) will bring up the annotation or image or video; another click on it or the popup will then go to it. A click outside it de-activates it.

// For an example of a Hakyll library which generates annotations for Wikipedia/Biorxiv/Arxiv/PDFs/arbitrarily-defined links, see https://www.gwern.net/LinkMetadata.hs ; for a live demonstration, see the links in https://www.gwern.net/newsletter/2019/07

// Modified by Steven Chun
// Date: 2020-04-23

Extracts = {
  popupStylesID: "popups-styles",
  popupContainerID: "popup-container",
  popupContainerParentSelector: "html",
  //targetElementsSelector: "#markdownBody a.docMetadata, #markdownBody a[href^='./images/'], #markdownBody a[href^='../images/'], #markdownBody a[href*='youtube.com'], #markdownBody a[href*='youtu.be'], #TOC a",
  targetElementsSelector: "a.docMetadata",
  minPopupWidth: 260,
  maxPopupWidth: 320,
  popupBorderWidth: 3.0,
  videoPopupWidth: 495,
  videoPopupHeight: 310,
  popupTriggerDelay: 250,
  popupFadeoutDelay: 25,
  popupFadeoutDuration: 250,
  popupFadeTimer: false,
  popupDespawnTimer: false,
  popupSpawnTimer: false,
  popupBreathingRoomX: -48.0,
  popupBreathingRoomY: 12.0,
  popup: null,
  encoder: new TextEncoder(),
  isMobileMediaQuery: matchMedia(
    "not screen and (hover:hover) and (pointer:fine)",
  ),
  extractForTarget: (target) => {
    var doi = "";
    // Create link to archive
    let internetArchiveLink = "https://web.archive.org/web/";
    // But only if the link itself doesn't point to the IA already.
    let archive = target.href.startsWith(internetArchiveLink)
      ? ``
      : `<a class="archive" href="${internetArchiveLink + target.href}">[archive]</a>`;

    if (target.dataset.popupDoi != undefined) {
      doi =
        `; ` +
        `<a href="https://ricon.dev/citations_for_doi?doi=${target.dataset.popupDoi}" ` +
        `target='_new' ` +
        `title="Reverse citations of the paper '${target.dataset.popupTitle}' with DOI '${target.dataset.popupDoi}' in Semantic Scholar">` +
        `citations</a>`;
    } else if (target.href.includes("pdf")) {
      doi =
        `; ` +
        `<a href="https://ricon.dev/citations_for_title?title=%22${target.dataset.popupTitle}%22" ` +
        `target='_new' ` +
        `title="Reverse citations of the paper '${target.dataset.popupTitle}' by title in Semantic Scholar">` +
        `citations</a>`;
    } else {
      doi =
        `; ` +
        `<a href="https://www.google.com/search?num=100&q=link%3A${target.href}" ` +
        `target='_new' ` +
        `title="Links to this page '${target.dataset.popupTitle}' in Google">` +
        `citations</a>`;
    }

    let uri = new URL(target.href);
    const kMaxDescriptionChars = 140;
    const kMaxTitleChars = 80;
    let image = "";
    if (target.dataset.popupImage != "") {
      image = `<div class='popup-image' style="background-image:
               url(${target.dataset.popupImage})"></div>`;
    }
    abstract = target.dataset.popupAbstract;
    return (
      `<div class='popup-extract' onclick='parentNode.remove()'>` +
      `<div class='data-field title'>` +
      `<a class='title-link' target='_new'
          href='${target.href}'
          title='${target.href}'>
          <h4>
          ${target.dataset.popupTitle.substring(0, kMaxTitleChars) || ""}
          </h4>
      </a>` +
      `</div>` +
      `<div class="popup-subtitle">` +
      `<p>${uri.hostname}</p>` +
      archive +
      `</div>` +
      image +
      `<div class='data-field abstract' onclick='parentNode.remove()'>` +
      `${abstract.substring(0, kMaxDescriptionChars) || ""}` +
      `</div>` +
      `</div>`
    );
  },
  youtubeId: (url) => {
    let match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
    );
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return "";
    }
  },
  videoForTarget: (target, videoId) => {
    return (
      `<div class='popup-screenshot' onclick="parentNode.remove()">` +
      `<iframe width="${Extracts.videoPopupWidth}px" height="${Extracts.videoPopupHeight}px"` +
      `src="//www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen>` +
      `</iframe></div>`
    );
  },
  sectionEmbedForTarget: (target) => {
    let targetSectionHTML = document.querySelector(
      target.getAttribute("href"),
    ).innerHTML;
    return `<div class='popup-section-embed'>${targetSectionHTML}</div>`;
  },
  localImageForTarget: (target) => {
    return `<div class='popup-local-image'><img src='${target.href}'></div>`;
  },
  unbind: () => {
    document
      .querySelectorAll(Extracts.targetElementsSelector)
      .forEach((target) => {
        //  Unbind existing mouseover/mouseout events, if any.
        target.removeEventListener("mouseover", Extracts.targetover);
        target.removeEventListener("mouseout", Extracts.targetout);
        target.onclick = () => {};
      });
    if (Extracts.popupContainer)
      Extracts.popupContainer.removeEventListener(
        "mouseup",
        Extracts.popupContainerClicked,
      );
  },
  cleanup: () => {
    console.log("popups.js: Cleaning up...");

    //  Unbind event listeners.
    Extracts.unbind();

    //  Remove popups container and injected styles.
    document
      .querySelectorAll(
        `#${Extracts.popupStylesID}, #${Extracts.popupContainerID}`,
      )
      .forEach((element) => element.remove());
  },
  setup: () => {
    //  Run cleanup.
    Extracts.cleanup();

    if (
      "ontouchstart" in document.documentElement &&
      Extracts.isMobileMediaQuery.matches
    ) {
      console.log("Mobile client detected. Exiting.");
      return;
    } else {
      console.log("popups.js: Setting up...");
    }

    //  Inject styles.
    document
      .querySelector("head")
      .insertAdjacentHTML("beforeend", Extracts.popupStylesHTML);

    //  Inject popups container.
    var popupContainerParent = document.querySelector(
      Extracts.popupContainerParentSelector,
    );
    document
      .querySelector(Extracts.popupContainerParentSelector)
      .insertAdjacentHTML(
        "beforeend",
        `<div id='${Extracts.popupContainerID}'></div>`,
      );
    requestAnimationFrame(() => {
      Extracts.popupContainer = document.querySelector(
        `#${Extracts.popupContainerID}`,
      );
      Extracts.popupContainer.addEventListener(
        "mouseup",
        Extracts.popupContainerClicked,
      );
    });

    //  Get all targets.
    document
      .querySelectorAll(Extracts.targetElementsSelector)
      .forEach((target) => {
        //  Bind mousemover/mouseout events.
        target.addEventListener("mouseover", Extracts.targetover);
        target.addEventListener("mouseout", Extracts.targetout);

        //  Remove the title attribute.
        target.removeAttribute("title");
        target.onclick = () => {
          return false;
        };
      });
  },
  //  The mouseover event.
  targetover: (event) => {
    //  Get the target.
    let target = event.target.closest("a");
    if (target.classList.contains("footnote-ref")) return;

    event.preventDefault();

    //  Stop the countdown to un-pop the popup.
    clearTimeout(Extracts.popupFadeTimer);
    clearTimeout(Extracts.popupDespawnTimer);
    clearTimeout(Extracts.popupSpawnTimer);

    //    document.querySelector("html").style.transform = "translateX(0)";

    Extracts.popupSpawnTimer = setTimeout(() => {
      target.onclick = () => {};

      let popupContainerViewportRect =
        Extracts.popupContainer.getBoundingClientRect();
      let targetViewportRect = target.getBoundingClientRect();
      let targetOriginInPopupContainer = {
        x: targetViewportRect.left - popupContainerViewportRect.left,
        y: targetViewportRect.top - popupContainerViewportRect.top,
      };
      let mouseOverEventPositionInPopupContainer = {
        x: event.clientX - popupContainerViewportRect.left,
        y: event.clientY - popupContainerViewportRect.top,
      };

      //  Get, or create, the popup.
      Extracts.popup = document.querySelector("#popupdiv");
      if (Extracts.popup) {
        Extracts.popup.classList.remove("fading");
        Extracts.popup.remove();
      } else {
        Extracts.popup = document.createElement("div");
        Extracts.popup.id = "popupdiv";
        Extracts.popup.className = target.className;
      }

      var isVideo = false;
      let videoId = Extracts.youtubeId(target.href);

      //  Inject the contents of the popup into the popup div.
      Extracts.popup.removeAttribute("style");
      if (videoId) {
        Extracts.popup.innerHTML = Extracts.videoForTarget(target, videoId);
        isVideo = true;
      } else if (target.getAttribute("href").startsWith("#")) {
        Extracts.popup.innerHTML = Extracts.sectionEmbedForTarget(target);
        Extracts.popup
          .querySelectorAll(".caption-wrapper")
          .forEach((captionWrapper) => {
            captionWrapper.style.minWidth = "";
          });
        Extracts.popup
          .querySelectorAll("a:not([href^='#'])")
          .forEach((externalLink) => {
            externalLink.target = "_new";
            externalLink.title = externalLink.href + "\n[Opens in new window]";
          });
        Extracts.popup.style.width = Extracts.maxPopupWidth + "px";
        Extracts.popup.style.maxHeight = Extracts.maxPopupWidth * 0.75 + "px";
      } else if (target.href.startsWith("https://www.gwern.net/images/")) {
        Extracts.popup.innerHTML = Extracts.localImageForTarget(target);
      } else if (target.classList.contains("docMetadata")) {
        Extracts.popup.innerHTML = Extracts.extractForTarget(target);
      }

      //  Inject the popup into the page.
      Extracts.popup.style.visibility = "hidden";
      Extracts.popup.style.left = "0px";
      Extracts.popup.style.top = "0px";
      document
        .querySelector(`#${Extracts.popupContainerID}`)
        .appendChild(Extracts.popup);

      //  Add event listeners.
      Extracts.popup.addEventListener("mouseup", (event) => {
        event.stopPropagation();
      });
      Extracts.popup.addEventListener("mouseover", Extracts.divover);
      Extracts.popup.addEventListener("mouseout", Extracts.targetout);

      //  Wait for the "naive" layout to be completed, and then...
      requestAnimationFrame(() => {
        /*  How much "breathing room" to give the target (i.e., offset of
                    the popup).
                    */
        var popupBreathingRoom = {
          x: Extracts.popupBreathingRoomX,
          y: Extracts.popupBreathingRoomY,
        };

        /*  This is the width and height of the popup, as already determined
                    by the layout system, and taking into account the popup芒鈧劉s content,
                    and the max-width, min-width, etc., CSS properties.
                    */
        var popupIntrinsicWidth = Extracts.popup.clientWidth;
        var popupIntrinsicHeight = Extracts.popup.clientHeight;

        var tocLink = target.closest("#TOC");
        var offToTheSide = false;

        var provisionalPopupXPosition;
        var provisionalPopupYPosition;

        /*  Can the popup fit above the target? If so, put it there.
                    Failing that, can it fit below the target? If so, put it there.
                    */
        var popupSpawnYOriginForSpawnAbove = Math.min(
          mouseOverEventPositionInPopupContainer.y - popupBreathingRoom.y,
          targetOriginInPopupContainer.y +
            targetViewportRect.height -
            popupBreathingRoom.y * 2.0,
        );
        var popupSpawnYOriginForSpawnBelow = Math.max(
          mouseOverEventPositionInPopupContainer.y + popupBreathingRoom.y,
          targetOriginInPopupContainer.y + popupBreathingRoom.y * 2.0,
        );
        if (tocLink) {
          provisionalPopupXPosition =
            document.querySelector("#TOC").getBoundingClientRect().right +
            1.0 -
            popupContainerViewportRect.left;
          provisionalPopupYPosition =
            mouseOverEventPositionInPopupContainer.y -
            (event.clientY / window.innerHeight) * popupIntrinsicHeight;
        } else if (
          popupSpawnYOriginForSpawnAbove - popupIntrinsicHeight >=
          popupContainerViewportRect.y * -1
        ) {
          //  Above.
          provisionalPopupYPosition =
            popupSpawnYOriginForSpawnAbove - popupIntrinsicHeight;
        } else if (
          popupSpawnYOriginForSpawnBelow + popupIntrinsicHeight <=
          popupContainerViewportRect.y * -1 + window.innerHeight
        ) {
          //  Below.
          provisionalPopupYPosition = popupSpawnYOriginForSpawnBelow;
        } else {
          /*  The popup does not fit above or below! We will have to
                        put it off to the left or right.
                        */
          offToTheSide = true;
        }

        if (offToTheSide) {
          popupBreathingRoom.x *= 2.0;
          provisionalPopupYPosition =
            mouseOverEventPositionInPopupContainer.y -
            (event.clientY / window.innerHeight) * popupIntrinsicHeight;
          if (provisionalPopupYPosition - popupContainerViewportRect.y < 0)
            provisionalPopupYPosition = 0.0;

          //  Determine whether to put the popup off to the right, or left.
          if (
            mouseOverEventPositionInPopupContainer.x +
              popupBreathingRoom.x +
              popupIntrinsicWidth <=
            popupContainerViewportRect.x * -1 + window.innerWidth
          ) {
            //  Off to the right.
            provisionalPopupXPosition =
              mouseOverEventPositionInPopupContainer.x + popupBreathingRoom.x;
          } else if (
            mouseOverEventPositionInPopupContainer.x -
              popupBreathingRoom.x -
              popupIntrinsicWidth >=
            popupContainerViewportRect.x * -1
          ) {
            //  Off to the left.
            provisionalPopupXPosition =
              mouseOverEventPositionInPopupContainer.x -
              popupIntrinsicWidth -
              popupBreathingRoom.x;
          }
        } else if (!tocLink) {
          /*  Place popup off to the right (and either above or below),
                        as per the previous block of code.
                        */
          provisionalPopupXPosition =
            mouseOverEventPositionInPopupContainer.x + popupBreathingRoom.x;
        }

        /*  Does the popup extend past the right edge of the container?
                    If so, move it left, until its right edge is flush with
                    the container's right edge.
                    */
        if (
          provisionalPopupXPosition + popupIntrinsicWidth >
          popupContainerViewportRect.width
        ) {
          provisionalPopupXPosition -=
            provisionalPopupXPosition +
            popupIntrinsicWidth -
            popupContainerViewportRect.width;
        }

        /*  Now (after having nudged the popup left, if need be),
                    does the popup extend past the *left* edge of the container?
                    Make its left edge flush with the container's left edge.
                    */
        if (provisionalPopupXPosition < 0) {
          provisionalPopupXPosition = 0;
        }

        Extracts.popup.style.left = provisionalPopupXPosition + "px";
        Extracts.popup.style.top = provisionalPopupYPosition + "px";

        Extracts.popupContainer.classList.add("popup-visible");
        Extracts.popup.style.visibility = "";
        document.activeElement.blur();
      });
    }, Extracts.popupTriggerDelay);
  },
  //  The mouseout event.
  targetout: (event) => {
    clearTimeout(Extracts.popupFadeTimer);
    clearTimeout(Extracts.popupDespawnTimer);
    clearTimeout(Extracts.popupSpawnTimer);

    if (!Extracts.popup) return;

    Extracts.popupFadeTimer = setTimeout(() => {
      Extracts.popup.classList.add("fading");
      Extracts.popupDespawnTimer = setTimeout(() => {
        Extracts.despawnPopup();
      }, Extracts.popupFadeoutDuration);
    }, Extracts.popupFadeoutDelay);
  },
  //  The "user moved mouse back into popup" mouseover event.
  divover: (event) => {
    clearTimeout(Extracts.popupFadeTimer);
    clearTimeout(Extracts.popupDespawnTimer);
    clearTimeout(Extracts.popupSpawnTimer);
    Extracts.popup.classList.remove("fading");
  },
  popupContainerClicked: (event) => {
    Extracts.despawnPopup();
  },
  despawnPopup: () => {
    Extracts.popup.remove();
    document.activeElement.blur();
    Extracts.popup.classList.remove("fading");
    document.querySelector("html").style.transform = "";
    Extracts.popupContainer.classList.remove("popup-visible");
  },
};

Extracts.popupStylesHTML = `<style id='${Extracts.popupStylesID}'>
#${Extracts.popupContainerID} {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3;
}
#${Extracts.popupContainerID} > * {
    pointer-events: auto;
}
@media not screen and (hover:hover) and (pointer:fine) {
    #${Extracts.popupContainerID}.popup-visible::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: auto;
        opacity: 0;
    }
}

#popupdiv {
    z-index: 10001;
    font-size: 0.8em;
    /* box-shadow: 0 0 0 2px #fff; */
    box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    border-radius: 5px;
    position: absolute;
    animation-name: popin;
    animation-duration: .2s;
    animation-fill-mode: forwards;
    opacity: 0.0;
    touch-action: none;
    user-select: none;
}
@keyframes popin {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
#popupdiv.fading {
    opacity: 0.0;
    transition:
        opacity 0.75s ease-in 0.1s;
}
#popupdiv > div {
    background-color: #fff;
    padding: 12px 16px 14px 16px;
    border-radius: 5px;
    line-height: 1.45;
    overflow: auto;
    overscroll-behavior: none;
    touch-action: none;
    user-select: none;
    min-width: ${Extracts.minPopupWidth}px;
    max-width: ${Extracts.maxPopupWidth}px;
    max-height: 60vh;
}

.popup-image {
  height: 120px;
  background-size: cover;
  background-position: center;
}

#popupdiv > .popup-extract {
  display: flex;
  flex-flow: column;
}

#popupdiv > div .data-field.title {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
}

#popupdiv > div h4 {
    font-size: 1.2em;
    margin: 0;
}

.popup-extract > .popup-subtitle {
    color: gray;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
}

.popup-extract > .popup-subtitle > p{
    margin: 0;
    font-size: 1em;
}

/* TODO: the popups should ideally inherit from the regular CSS once the #markdownBody class is rewritten, and the underlining can be removed */
#popupdiv a { text-decoration: underline; }
#popupdiv a:hover { color: #888; }
#popupdiv > div .data-field {
    text-align: left;
    text-indent: 0;
    hyphens: none;
}
#popupdiv > div .data-field + .data-field {
    margin-top: 0.25em;
}
#popupdiv > div .data-field:empty {
    display: none;
}

#popupdiv > div .data-field.author-plus-date {
}
#popupdiv > div .data-field.abstract {
    text-align: justify;
    hyphens: auto;
}
#popupdiv > div.popup-screenshot {
    padding: 0;
    max-width: unset;
}
#popupdiv > div.popup-screenshot img {
    display: block;
}
#popupdiv > div.popup-screenshot a::after {
    content: none;
}
#popupdiv > div.popup-section-embed {
    height: 100%;
    padding: 12px 24px 14px 24px;
    overflow-x: hidden;
}
#popupdiv > div.popup-section-embed > h1:first-child,
#popupdiv > div.popup-section-embed > h2:first-child,
#popupdiv > div.popup-section-embed > h3:first-child,
#popupdiv > div.popup-section-embed > h4:first-child  {
    margin-top: 0;
}
#popupdiv > div.popup-section-embed > :last-child {
    margin-bottom: 12px;
}
#popupdiv > div .icon {
    background-image: none !important;
    position: relative;
    top: 0.15em;
    font-size: 1.125em;
}
#popupdiv > div .icon::after {
    margin: 0 0.175em 0 0;
    width: 1em;
    height: 1em;
    font-size: 1em;
}
#popupdiv > div .icon:not([href*='.pdf'])::after {
    background-position: center center;
    background-size: 100%;
}
#popupdiv > div .title-link::after {
    content: none;
}

/*  Scroll bar styles (Webkit/Blink only).
    */
#popupdiv > div::-webkit-scrollbar {
    width: 14px;
}
#popupdiv > div::-webkit-scrollbar-thumb {
    background-color: #ccc;
    box-shadow:
        0 0 0 3px #fff inset;
}
#popupdiv > div::-webkit-scrollbar-thumb:hover {
    background-color: #999;
}

/*  Popups on mobile.
    */
@media only screen and (max-width: 64.9ch), not screen and (hover:hover) and (pointer:fine) {
    #popupdiv > div {
        max-width: 100%;
    }
}

/*  Image focus interaction.
    */
#markdownBody #popupdiv img {
    filter: none;
    cursor: initial;
    transform: none;
}
#markdownBody #popupdiv .popup-screenshot a img {
    cursor: pointer;
}

#popupdiv .originalURL {
  font-size: 75%;
}

</style>`;

if (document.readyState == "complete") {
  Extracts.setup();
} else {
  window.addEventListener("load", Extracts.setup);
}
