interface EventData {
  name: string
}

export interface ToggleEvent extends EventData {
  name: 'toggle'
  width: string
  height: string
}

(function() {
  const FRAME_ID = 'bello-widget-frame'

  function handleToggleEvent(data: ToggleEvent) {
    const { width, height } = data
    const frame = document.getElementById(FRAME_ID)
    if (frame) {
      frame.style.height = height
      frame.style.width = width
    }
  }

  function postMessageHandler(event: MessageEvent) {
    const origin = event.origin
    const data: EventData = event.data 

    const allowedOrigins = [
      'https://widget.belloforwork.com', 
      'https://bello-widget.firebaseapp.com',
    ]

    if (allowedOrigins.indexOf(origin) !== -1) {
      if (data && data.name === "toggle") {
        handleToggleEvent(data as ToggleEvent);
      }
    }
  }

  function createDomElements() {
    const root = document.createElement("div");
    root.id = "bello-widget-root";
    root.style.position = "absolute";
    root.style.zIndex = "2147483648";

    const frame = document.createElement("iframe");
    frame.id = FRAME_ID
    frame.src = "//widget.belloforwork.com/index.html";
    frame.style.border = "none";
    frame.style.display = "block";
    frame.style.position = "fixed";
    frame.style.top = "auto";
    frame.style.left = "auto";
    frame.style.bottom = "24px";
    frame.style.right = "24px";
    frame.style.width = "76px";
    frame.style.height = "76px";
    frame.style.visibility = "visibile";
    frame.style.zIndex = "2147483647";
    frame.style.maxHeight = "100vh";
    frame.style.maxWidth = "100vw";
    frame.style.transition = "none";
    frame.style.background = "none transaprent";
    frame.style.opacity = "1";

    root.appendChild(frame);

    document.addEventListener("DOMContentLoaded", function() {
      document.body.appendChild(root);
    });
  }

  function attachHandlers() {
    if (window.addEventListener) {
      window.addEventListener("message", postMessageHandler, false);
    } else {
      // @ts-ignore
      window.attachEvent("onmessage", postMessageHandler);
    }
  }

  // starts here
  function init() {
    createDomElements();
    attachHandlers();
  }

  init();
})();
