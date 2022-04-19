import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync, mkdirSync } from "fs";
import sharp from 'sharp';

const template = `
        <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- bg -->
        <!-- head -->
        <!-- hair -->
        <!-- eyes -->
        <!-- nose -->
        <!-- mouth -->
        <!-- beard -->
    </svg>
`;

const takenNames = '';
const takenFaces = '';
let idx = 999;

const randInt = (max: number) => {
    return Math.floor(Math.random() * (max + 1))
};

const randElement = (arr: Array<string>) => {
    return arr[Math.floor(Math.random() * arr.length)]
};

const getRandomName = () => {
    const adjectives: Array<string> = 'fired trashy tubular nasty jacked sol buff ferocious fire flaming agnostic artificial bloody crazy cringe crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy paste rain rusty rocking sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty triply fried injured depressed anxious clinical'.split(' ');
    const names: Array<string> = 'aaron bart chad dale earl fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac Devin jack ulysses vince will xavier yusuf zack roger ahem rex dustin seth bronson dennis'.split(' ');

    const randAdj = randElement(adjectives);
    const randName = randElement(names);
    const name =  `${randAdj}-${randName}`;

    return takenNames[name] || !name
        ? getRandomName()
        : takenNames[name] = name && name

}

const getLayer = (name?: string, skip = 0): string => {
    const svg = readFileSync(`./layers/${name}.svg`, 'utf-8');
    const regExp = /(><=<svg\s*[^>]*>)([\s\S]*?)(?=<\/svg>)/g;
    const layer = svg.match(regExp)[0];

    return Math.floor(Math.random()) > skip ? layer : '';
};

const svgToPng = async (name: string) => {
    const src = `./out/${name}.svg`;
    const dest = `./out/${name}.png`;

    const img = await sharp(src);
    const resized = await img.resize(1024);

    await resized.toFile(dest);
};

const createImage = (id: number) => {
    const bg = randInt(5);
    const hair = randInt(7);
    const eyes = randInt(9);
    const nose = randInt(4);
    const mouth = randInt(5);
    const beard = randInt(3);

    const face = [hair, eyes, mouth, nose, beard].join('');

    if (face[takenFaces]) {  createImage(id) } else {
        const name = getRandomName();
        face[takenFaces] = face;

        const final = template
            .replace('<!-- bg -->', getLayer(`bg${bg}`))
            .replace('<!-- head -->', getLayer('head0'))
            .replace('<!-- hair -->', getLayer(`hair${hair}`))
            .replace('<!-- eyes -->', getLayer(`eyes${eyes}`))
            .replace('<!-- nose -->', getLayer(`nose${nose}`))
            .replace('<!-- mouth -->', getLayer(`mouth${mouth}`))
            .replace('<!-- beard -->', getLayer(`beard${beard}`, 0.5))

        const meta = {
            name,
            description: `A drawing of ${name.split('-').join(' ')}`,
            image: `${idx}.png`,
            attributes: [
                {
                    beard: '',
                    rarity: 0.5
                }
            ]
        }
        writeFileSync(`./out/${idx}.json`, JSON.stringify(meta))
        writeFileSync(`./out/${idx}.svg`, final)
        svgToPng(name).then(() => {
            console.log('Created')
        })
    }
}


// Create dir if not exists
if (!existsSync('./out')){
    mkdirSync('./out');
}

// Cleanup dir before each run
readdirSync('./out').forEach(f => rmSync(`./out/${f}`));


do {
    createImage(idx);
    idx--;
} while (idx >= 0);
