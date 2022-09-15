/*
 * Copyright © 2022, xLiam <xliam.moore@gmail.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */


import {exec} from "child_process";
import {writeFileSync} from "fs";
import fetch from "node-fetch";

interface ExtensionInformation {
    id: string;
    icon: string;
    name: string;
}

async function fetchExtensionInformation(extensionId: string): Promise<ExtensionInformation> {
    console.log(`[🚀] Retrieving information about extension '${extensionId}'`);
    let information: ExtensionInformation = {
        id: extensionId,
        icon: undefined,
        name: undefined
    };
    let extension = (await fetch(`https://marketplace.visualstudio.com/items?itemName=${extensionId}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0"
        }
    }));
    if(extension instanceof Error) {
        console.log(`[😥] Something went wrong while trying to get information about the extension '${extensionId}'`);
        return information;
    }
    let contentExtension = (await extension.text());
    let iconExtension = contentExtension.match(/<img class="image-display" .*?>/g);
    (iconExtension && iconExtension[0] && (information.icon = iconExtension[0].match(/src="(?<src>.*?)"/)?.groups.src ?? ""));
    let nameExtension = ((/<span class="ux-item-name">(?<name>.*?)<\/span>/)).exec(contentExtension);
    (nameExtension && nameExtension[0] && (information.name = nameExtension?.groups.name ?? "Undefined Extension Name"));
    if(!iconExtension || !nameExtension)
        console.log(`[😥] Something went wrong while trying to get information about the extension '${extensionId}'`);
    return information;
}

function generateMarkdown(fileName: string, extensions: ExtensionInformation[]) {
    let markdown = [];
    markdown.push("# My List of Extensions");

    extensions.forEach(extension => markdown.push(
        `<div style='display: flex;align-items: center;gap: 8px;margin: 10px;'>
    <img src='${extension.icon}' width='36' height='36' alt='${extension.name}' />
    <a href='https://marketplace.visualstudio.com/items?itemName=${extension.id}'>${extension.name}</a>
</div>`
    ))

    markdown.push("##### List generated with script by xLiam#0329 [675843976275689525]");

    writeFileSync(fileName, markdown.join("\n\n"));
    console.log(`[✨] File "${fileName}" was successfully generated!`);
}

exec("code --list-extensions", async (err, stdout, stderr) => {
    if(err)
        throw err;
    let extensions: string[] = stdout.split("\n").map(extension => extension.trim()).filter(extension => extension.length > 0);
    generateMarkdown("extensions.md", (await extensions.reduce(async (prev: Promise<ExtensionInformation[]>, extensionId) => {
        return ((await prev).push(await fetchExtensionInformation(extensionId)), prev);
    }, Promise.resolve([]))).filter((extension: ExtensionInformation) => extension.icon && extension.name));
})