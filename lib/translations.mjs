let sharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export default {
    modifiers: [
        "2",
        "7",
        "4",
        "maj7",
        "(4)",
        "(no3)",
        "(n03)",
        "2(n03)",
        "sus",
    ],

    provide(key) {
        let rtv = [];
        let source = sharps;

        if (key === "F")
            source = flats;

        let n = source.indexOf(key);

        if (!n) {
            source = flats;
            n = source.indexOf(key);
        }

        if (n === -1) {
            return null;
        }

        let steps = [2, 2, 1, 2, 2, 2, 1];
        for (let i = 0; i < 7; i++) {
            let note = source[n];
            rtv.push(note);
            n += steps[i];

            if (n >= source.length) {
                n = n - source.length;
            }
        }

        let minors = [2, 3, 6];

        let obj = {};
        rtv.forEach((v, i) => {
            let minor = minors.includes(i + 1) ? "m" : "";
            obj[v + minor] = {n: (i + 1) + minor};
            if (minor) {
                obj[v] = {n: (i + 1)};
            }
        });

        return obj;
    }
}