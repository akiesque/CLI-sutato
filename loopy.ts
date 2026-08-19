
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function spawnMagicSpinner(spin:any, c: (text:string)=> string) {
    let Running = true;

    const waiting_text = [
        "Battling cosmic entities",
        "Summoning the spirits of code",
        "Aligning the stars for your project",
        "Consulting the ancient scrolls of programming",
        "Whispering to the vibe code gods"
    ]

    const loop = (async () => {
        let i = 0;
        while (Running) {
            spin.message(c(waiting_text[i]));
            i = (i+1) % waiting_text.length;
            await sleep(1000);
    }

    })();

    return {
        start: () => {
            Running = true;
            spin.start(c(waiting_text[0]));
        },
        stop: (msg: string) => {
            Running = false;
            spin.stop(msg);
        },
        error: (msg: string) => {
            Running = false;
            spin.error(msg);
        }
    };
}