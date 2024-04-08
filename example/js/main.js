import {useFlipdown} from "../../dist/flipdown.mjs";

document.addEventListener("DOMContentLoaded", () => {
    // Unix timestamp (in seconds) to count down to
    const twoDaysFromNow = new Date().getTime() / 1000 + 86400 * 2 + 1;
    const {start} = useFlipdown(twoDaysFromNow, '#flipdown');

    start();
});
