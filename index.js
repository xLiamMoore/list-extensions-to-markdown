"use strict";
/*
 * Copyright © 2022, xLiam <xliam.moore@gmail.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var node_fetch_1 = require("node-fetch");
function fetchExtensionInformation(extensionId) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var information, extension, contentExtension, iconExtension, nameExtension;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("[\uD83D\uDE80] Retrieving information about extension '".concat(extensionId, "'"));
                    information = {
                        id: extensionId,
                        icon: undefined,
                        name: undefined
                    };
                    return [4 /*yield*/, (0, node_fetch_1["default"])("https://marketplace.visualstudio.com/items?itemName=".concat(extensionId), {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0"
                            }
                        })];
                case 1:
                    extension = (_d.sent());
                    if (extension instanceof Error) {
                        console.log("[\uD83D\uDE25] Something went wrong while trying to get information about the extension '".concat(extensionId, "'"));
                        return [2 /*return*/, information];
                    }
                    return [4 /*yield*/, extension.text()];
                case 2:
                    contentExtension = (_d.sent());
                    iconExtension = contentExtension.match(/<img class="image-display" .*?>/g);
                    (iconExtension && iconExtension[0] && (information.icon = (_b = (_a = iconExtension[0].match(/src="(?<src>.*?)"/)) === null || _a === void 0 ? void 0 : _a.groups.src) !== null && _b !== void 0 ? _b : ""));
                    nameExtension = ((/<span class="ux-item-name">(?<name>.*?)<\/span>/)).exec(contentExtension);
                    (nameExtension && nameExtension[0] && (information.name = (_c = nameExtension === null || nameExtension === void 0 ? void 0 : nameExtension.groups.name) !== null && _c !== void 0 ? _c : "Undefined Extension Name"));
                    if (!iconExtension || !nameExtension)
                        console.log("[\uD83D\uDE25] Something went wrong while trying to get information about the extension '".concat(extensionId, "'"));
                    return [2 /*return*/, information];
            }
        });
    });
}
function generateMarkdown(fileName, extensions) {
    var markdown = [];
    markdown.push("# My List of Extensions");
    extensions.forEach(function (extension) { return markdown.push("<div style='display: flex;align-items: center;gap: 8px;margin: 10px;'>\n    <img src='".concat(extension.icon, "' width='36' height='36' alt='").concat(extension.name, "' />\n    <a href='https://marketplace.visualstudio.com/items?itemName=").concat(extension.id, "'>").concat(extension.name, "</a>\n</div>")); });
    markdown.push("##### List generated with script by xLiam#0329 [675843976275689525]");
    (0, fs_1.writeFileSync)(fileName, markdown.join("\n\n"));
    console.log("[\u2728] File \"".concat(fileName, "\" was successfully generated!"));
}
(0, child_process_1.exec)("code --list-extensions", function (err, stdout, stderr) { return __awaiter(void 0, void 0, void 0, function () {
    var extensions, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (err)
                    throw err;
                extensions = stdout.split("\n").map(function (extension) { return extension.trim(); }).filter(function (extension) { return extension.length > 0; });
                _a = generateMarkdown;
                _b = ["extensions.md"];
                return [4 /*yield*/, extensions.reduce(function (prev, extensionId) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, prev];
                                case 1:
                                    _b = (_a = (_c.sent())).push;
                                    return [4 /*yield*/, fetchExtensionInformation(extensionId)];
                                case 2: return [2 /*return*/, (_b.apply(_a, [_c.sent()]), prev)];
                            }
                        });
                    }); }, Promise.resolve([]))];
            case 1:
                _a.apply(void 0, _b.concat([(_c.sent()).filter(function (extension) { return extension.icon && extension.name; })]));
                return [2 /*return*/];
        }
    });
}); });
