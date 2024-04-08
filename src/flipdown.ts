import { pad } from './lib/pad';

type Options = {
    theme?: string;
    headings?: string[];
    onEnd?: () => unknown;
}

export const useFlipdown = (date: string | number, el: string | HTMLElement, opt: Partial<Options> = {}) => {
    let initialised = false;

    let now = getTime();

    let epoch = date;
    if (typeof epoch === 'string') {
        epoch = new Date(`${epoch}Z`).getTime() / 1000;
    }

    // FlipDown DOM element
    const element = typeof el === 'string' ? document.querySelector(el) : el;

    // Rotor DOM elements
    const rotors = [];
    let rotorLeafFront = [];
    let rotorLeafRear = [];
    let rotorTops = [];
    let rotorBottoms = [];

    // Number of days remaining
    let daysRemaining = 0;

    // Clock values as numbers
    const clockValues = {
        d: 0,
        h: 0,
        m: 0,
        s: 0
    };

    // Clock values as strings
    const clockStrings = {
        d: '00',
        h: '00',
        m: '00',
        s: '00'
    };

    // Clock values as array
    let clockValuesAsString = [];
    let prevClockValuesAsString = [];

    const defaults: Options = {
        theme: "dark",
        headings: ["Days", "Hours", "Minutes", "Seconds"],
    }

    const opts: Options = { ...defaults, ...opt }

    element.classList.add(`flipdown__theme-${opts.theme}`);

    const start = () => {
        // Initialize the clock
        if (!initialised) {
            init();
        }

        setInterval(tick, 1000);
    };

    const hasCountdownEnded = () => {
        if (epoch - now < 0) {
            if (opts.onEnd != null) {
                opts.onEnd();

                // Remove the callback
                opts.onEnd = null;
            }

            return true;
        }

        return false;
    };

    const init = () => {
        initialised = true;

        // Check whether countdown has ended and calculate how many digits the day counter needs
        if (hasCountdownEnded()) {
            daysRemaining = 0;
        } else {
            daysRemaining = Math.floor((epoch - now) / 86400).toString().length;
        }

        const dayRotorCount = daysRemaining <= 2 ? 2 : daysRemaining;

        // Create and store rotors
        for (let i = 0; i < dayRotorCount + 6; i++) {
            rotors.push(createRotor(0));
        }

        // Create day rotor group
        const dayRotors = [];
        for (let i = 0; i < dayRotorCount; i++) {
            dayRotors.push(rotors[i]);
        }

        element.appendChild(createRotorGroup(dayRotors, 0));

        // Create other rotor groups
        let count = dayRotorCount;
        for (let i = 0; i < 3; i++) {
            const otherRotors = [];
            for (let j = 0; j < 2; j++) {
                otherRotors.push(rotors[count]);
                count++;
            }

            element.appendChild(createRotorGroup(otherRotors, i + 1));
        }

        // Store and convert rotor nodelists to arrays
        rotorLeafFront = Array.from(element.querySelectorAll(".rotor-leaf-front"));
        rotorLeafRear = Array.from(element.querySelectorAll(".rotor-leaf-rear"));
        rotorTops = Array.from(element.querySelectorAll(".rotor-top"));
        rotorBottoms = Array.from(element.querySelectorAll(".rotor-bottom"));

        // Set initial values;
        tick();
        updateClockValues(true);

        return this;
    };

    const createRotorGroup = (rotors: HTMLDivElement[], rotorIndex: number) => {
        const rotorGroup = document.createElement("div");
        rotorGroup.className = "rotor-group";
        const dayRotorGroupHeading = document.createElement("div");

        dayRotorGroupHeading.className = "rotor-group-heading";
        dayRotorGroupHeading.setAttribute("data-before", opts.headings[rotorIndex]);

        rotorGroup.appendChild(dayRotorGroupHeading);
        appendChildren(rotorGroup, rotors);

        return rotorGroup;
    };

    const createRotor = (v = 0): HTMLDivElement => {
        const rotor = document.createElement("div");
        const rotorLeaf = document.createElement("div");
        const rotorLeafRear = document.createElement("figure");
        const rotorLeafFront = document.createElement("figure");
        const rotorTop = document.createElement("div");
        const rotorBottom = document.createElement("div");

        rotor.className = "rotor";
        rotorLeaf.className = "rotor-leaf";
        rotorLeafRear.className = "rotor-leaf-rear";
        rotorLeafFront.className = "rotor-leaf-front";
        rotorTop.className = "rotor-top";
        rotorBottom.className = "rotor-bottom";

        rotorLeafRear.textContent = v.toString();
        rotorTop.textContent = v.toString();
        rotorBottom.textContent = v.toString();

        appendChildren(rotor, [rotorLeaf, rotorTop, rotorBottom]);
        appendChildren(rotorLeaf, [rotorLeafRear, rotorLeafFront]);

        return rotor;
    };

    const tick = () => {
        // Get time now
        now = getTime();

        // Between now and epoch
        let diff = epoch - now <= 0 ? 0 : epoch - now;

        // Days remaining
        clockValues.d = Math.floor(diff / 86400);
        diff -= clockValues.d * 86400;

        // Hours remaining
        clockValues.h = Math.floor(diff / 3600);
        diff -= clockValues.h * 3600;

        // Minutes remaining
        clockValues.m = Math.floor(diff / 60);
        diff -= clockValues.m * 60;

        // Seconds remaining
        clockValues.s = Math.floor(diff);

        // Update clock values
        updateClockValues();

        // Has the countdown ended?
        hasCountdownEnded();
    };

    const updateClockValues = (init = false) => {
        // Build clock value strings
        clockStrings.d = pad(clockValues.d, 2);
        clockStrings.h = pad(clockValues.h, 2);
        clockStrings.m = pad(clockValues.m, 2);
        clockStrings.s = pad(clockValues.s, 2);

        // Concat clock value strings
        clockValuesAsString = (clockStrings.d + clockStrings.h + clockStrings.m + clockStrings.s).split("");

        // Update rotor values
        // Note that the faces which are initially visible are:
        // - rotorLeafFront (top half of current rotor)
        // - rotorBottom (bottom half of current rotor)
        // Note that the faces which are initially hidden are:
        // - rotorTop (top half of next rotor)
        // - rotorLeafRear (bottom half of next rotor)
        rotorLeafFront.forEach((el, i) => {
            el.textContent = prevClockValuesAsString[i];
        });

        rotorBottoms.forEach((el, i) => {
            el.textContent = prevClockValuesAsString[i];
        });

        const rotorTopFlip = () => {
            rotorTops.forEach((el, i) => {
                if (el.textContent !== clockValuesAsString[i]) {
                    el.textContent = clockValuesAsString[i];
                }
            });
        };

        const rotorLeafRearFlip = () => {
            rotorLeafRear.forEach((el, i) => {
                if (el.textContent !== clockValuesAsString[i]) {
                    el.textContent = clockValuesAsString[i];
                    el.parentElement.classList.add("flipped");
                    const flip = setInterval(() => {
                        el.parentElement.classList.remove("flipped");
                        clearInterval(flip);
                    }, 500);
                }
            });
        };

        // Init
        if (!init) {
            setTimeout(rotorTopFlip, 500);
            setTimeout(rotorLeafRearFlip, 500);
        } else {
            rotorTopFlip();
            rotorLeafRearFlip();
        }

        // Save a copy of clock values for next tick
        prevClockValuesAsString = clockValuesAsString;
    };

    return { start };
};

const getTime = () => new Date().getTime() / 1000;

const appendChildren = (parent: HTMLDivElement, children: HTMLElement[]) => {
    children.forEach((el) => {
        parent.appendChild(el);
    });
};
