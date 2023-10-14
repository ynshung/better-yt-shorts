import { getOverlayElement, getProgressBarList, getVideo } from "./getters";
import { render } from "./utils";

export function modifyProgressBar(enabled: boolean) {
  if (!enabled) return;

  const overlayElement = getOverlayElement();
  const ytShorts = getVideo();

  if (!overlayElement) return;
  if (ytShorts === null) return;

  //[id="0"]  > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer > #overlay
  const progressBar = getProgressBarList() as HTMLElement; // ? the progressbar itself
  const pbBackground = progressBar.children[0] as HTMLElement; // ? the grey background of the bar
  const pbForeground = progressBar.children[1] as HTMLElement; // ? The red part of the progress bar

  const subBox = overlayElement.children[1] as HTMLElement;
  const tooltip = render(
    '<div class="betterYT-timestamp-tooltip"></div>',
  ) as HTMLElement;

  progressBar.appendChild(tooltip);

  // Styling to ensure rest of bottom overlay (shorts title/sub button) stay in place
  subBox.style.marginBottom = "-7px"; // ? changed to 1 from 0 bc i think its not targeting the right thing
  progressBar.style.height = "10px";
  progressBar.style.paddingTop = "2px"; // Slight padding to increase hover box

  progressBar.classList.add("betterYT-progress-bar");
  pbBackground.classList.add("betterYT-progress-bar");
  pbForeground.classList.add("betterYT-progress-bar");

  addListeners({
    progressBar,
    pbBackground,
    pbForeground,
    tooltip,
  });
}

interface ListenerProps {
  progressBar: HTMLElement;
  pbBackground: HTMLElement;
  pbForeground: HTMLElement;
  tooltip: HTMLElement;
}
function addListeners({
  progressBar,
  pbBackground,
  pbForeground,
  tooltip,
}: ListenerProps) {
  const ytShorts = getVideo();
  if (ytShorts === null) return;

  progressBar.addEventListener("mouseover", () => {
    pbBackground.classList.add("betterYT-progress-bar-hover");
    pbForeground.classList.add("betterYT-progress-bar-hover");
  });
  progressBar.addEventListener("mousemove", (e: MouseEvent) => {
    let x = e.clientX - ytShorts.getBoundingClientRect().left;
    // Deal with slight inaccuracies
    if (x < 0) x = 0;
    if (x > ytShorts.clientWidth) x = ytShorts.clientWidth;
    // Get timestamp and round to nearest 0.1
    const timestamp = ((x / ytShorts.clientWidth) * ytShorts.duration).toFixed(
      1,
    );
    tooltip.textContent = `${timestamp}s`;

    // Ensure tooltip stays visible at edges of client
    if (
      x - tooltip.offsetWidth / 2 >
      ytShorts.clientWidth - tooltip.offsetWidth
    ) {
      tooltip.style.left = `${ytShorts.clientWidth - tooltip.offsetWidth}px`;
    } else if (x - tooltip.offsetWidth / 2 <= 0) {
      tooltip.style.left = "0px";
    } else {
      tooltip.style.left = `${x - tooltip.offsetWidth / 2}px`;
    }

    tooltip.style.top = "-20px";
    tooltip.style.display = "block";
  });

  progressBar.addEventListener("mouseout", () => {
    pbBackground.classList.remove("betterYT-progress-bar-hover");
    pbForeground.classList.remove("betterYT-progress-bar-hover");
    tooltip.style.display = "none";
  });

  progressBar.addEventListener("click", (event) => {
    let x = (<MouseEvent>event).clientX - ytShorts.getBoundingClientRect().left;
    if (x < 0) x = 0;
    if (x > ytShorts.clientWidth) x = ytShorts.clientWidth;
    ytShorts.currentTime = (x / ytShorts.clientWidth) * ytShorts.duration;
  });
}

export function handleProgressBarNotAppearing() {
  // ? to show on shorter shorts
  getProgressBarList()?.removeAttribute("hidden");
}
