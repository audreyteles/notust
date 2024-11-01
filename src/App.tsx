import "./index.css";

import {exists, create, writeTextFile, readFile} from '@tauri-apps/plugin-fs';
import {save, open} from '@tauri-apps/plugin-dialog';
import {useState} from "react";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function saveFile(fileContent: string) {

    const path = await save({
        filters: [
            {
                name: 'Save as',
                extensions: ['txt', 'rs', 'py'],
            },
        ],
    });

    let fileExists = await exists(String(path));
    const content = new TextEncoder().encode(fileContent);

    if (fileExists) {
        await writeTextFile(String(path), fileContent);
        document.getElementById("notify")!.classList.remove("hidden")
        await sleep(2000)
        document.getElementById("notify")!.classList.add("hidden")
    } else {
        const file = await create(String(path));
        const fileSaved = await file.write(content);

        if (fileSaved) {
            await file.close();
            document.getElementById("notify")!.classList.remove("hidden")
            await sleep(2000)
            document.getElementById("notify")!.classList.add("hidden")
        } else {
            throw Error("The file can't be saved!")
        }
    }
}

async function openFile() {
    const file = await open({
        multiple: false,
        directory: false,
    });
    const content = await readFile(String(file));
    document.getElementById("inputText")!.textContent = new TextDecoder().decode(content);

}

function App() {
    const [fileContent, setFileContent] = useState<string>('');

    return (
        <main className={"flex justify-end items-end"}>
            <div id={"notify"}
                 className={"absolute h-fit p-2 m-4 rounded-2xl bg-opacity-70 bg-green-300 text-green-800 font-normal select-none hidden"}>
                <p>Saved.</p>
            </div>

            <div className={"flex justify-end items-center"}>
                <div className={"absolute bg-white p-2 py-4 m-4 rounded-2xl bg-opacity-70 "}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor"
                         className="size-6 m-2 mb-6 transition-transform delay-75 cursor-pointer hover:scale-125"
                         onClick={() => {
                             saveFile(fileContent)
                         }}
                    >
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor"
                         className="size-6 m-2 mt-4 transition-transform delay-75 cursor-pointer hover:scale-125"
                         onClick={openFile}>
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"/>
                    </svg>
                </div>
                <div className="h-screen w-screen overflow-hidden grid grid-cols-1">
                <textarea id={"inputText"} onChange={(e) => {
                    e.preventDefault();
                    setFileContent(e.currentTarget.value);
                }} placeholder={"Write here..."}
                          className={"bg-black caret-amber-600 w-screen resize-none text-white p-4 focus:outline-none "}>
            </textarea>
                </div>
            </div>
        </main>
    );
}

export default App;
