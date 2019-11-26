let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

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
        let n = notes.indexOf(key);

        let steps = [2, 2, 1, 2, 2, 2, 1];
        for (let i = 0; i < 7; i++) {
            let note = notes[n];
            rtv.push(note);
            n += steps[i];

            if (n >= notes.length) {
                n = n - notes.length;
            }
        }

        let minors = [2, 3, 6];

        let obj = {};
        rtv.forEach((v, i) => {
            let minor = minors.includes(i + 1) ? "m" : "";
            obj[v + minor] = {n: (i + 1) + minor}
        });

        return obj;
    }
}