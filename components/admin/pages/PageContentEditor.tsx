// File: frontend/src/components/admin/page/PageContentEditor.tsx

"use client";

import { useState, useEffect } from "react";
import { LexicalComposer, InitialConfigType } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import { LinkNode } from "@lexical/link";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { ImageNode } from "@/components/editor/nodes/ImageNode"; // Agregado para soportar el Toolbar compartido
import Toolbar from "@/components/admin/products/Toolbar"; // Toolbar actualizado para incluir el toggle de HTML y soporte para ImageNode
import EditorTheme from "@/components/form/editor/EditorTheme";

const editorConfig: InitialConfigType = {
    namespace: "EcommercePageEditor",
    theme: EditorTheme,
    onError(error) { throw error; },
    // Se añade ImageNode al registro de nodos del editor
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, TableNode, TableCellNode, TableRowNode, LinkNode, ImageNode],
};

const moveStylesToSpans = (dom: Document) => {
    const doc = dom;
    const stylesToTransfer = ['color', 'background-color', 'font-size', 'font-family', 'font-weight', 'text-align'];
    const elements = doc.querySelectorAll('*');

    elements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        const hasStyles = stylesToTransfer.some(style => el.style.getPropertyValue(style));

        if (hasStyles) {
            const childNodes = Array.from(el.childNodes);
            if (childNodes.length === 0) return;

            childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
                    const span = doc.createElement('span');
                    span.textContent = child.textContent;
                    stylesToTransfer.forEach(style => {
                        const val = el.style.getPropertyValue(style);
                        if (val) span.style.setProperty(style, val);
                    });
                    el.replaceChild(span, child);
                } else if (child instanceof HTMLElement) {
                    stylesToTransfer.forEach(style => {
                        const parentVal = el.style.getPropertyValue(style);
                        const childVal = child.style.getPropertyValue(style);
                        if (parentVal && !childVal) {
                            child.style.setProperty(style, parentVal);
                        }
                    });
                }
            });
        }
    });
    return doc;
};

function InitialHTMLPlugin({ html }: { html: string }) {
    const [editor] = useLexicalComposerContext();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!html || isLoaded) return;

        editor.update(() => {
            const root = $getRoot();
            if (root.getTextContentSize() === 0) {
                const parser = new DOMParser();
                let dom = parser.parseFromString(html, "text/html");
                dom = moveStylesToSpans(dom);

                const nodes = $generateNodesFromDOM(editor, dom);
                root.clear();
                $insertNodes(nodes);
            }
        });
        setIsLoaded(true);
    }, [html, editor, isLoaded]);

    return null;
}

interface PageContentEditorProps {
    fieldName: string;
    initialHTML?: string;
}

export default function PageContentEditor({ fieldName, initialHTML = "" }: PageContentEditorProps) {
    const [html, setHtml] = useState(initialHTML);
    const [isHTMLMode, setIsHTMLMode] = useState(false);

    return (
        <div className="rounded-md border border-zinc-200 overflow-hidden bg-white shadow-sm focus-within:border-zinc-950 transition-colors">
            <input type="hidden" name={fieldName} value={html} />

            <LexicalComposer initialConfig={editorConfig}>
                <Toolbar onToggleHTML={() => setIsHTMLMode(m => !m)} isHTMLMode={isHTMLMode} />

                {isHTMLMode ? (
                    <textarea
                        className="w-full h-[400px] p-4 font-mono text-xs bg-zinc-50 border-t border-zinc-100 outline-none resize-none text-zinc-800"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                    />
                ) : (
                    <div className="relative border-t border-zinc-100">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className="min-h-[350px] max-h-[600px] overflow-y-auto p-5 outline-none prose prose-zinc max-w-none text-sm text-zinc-900"
                                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                                />
                            }
                            placeholder={
                                <div className="absolute top-5 left-5 text-zinc-400 pointer-events-none select-none text-sm">
                                    Escribe el contenido enriquecido de la página...
                                </div>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <InitialHTMLPlugin html={initialHTML} />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <ListPlugin />
                        <TablePlugin />
                        <OnChangePlugin onChange={(editorState, editor) => {
                            if (!isHTMLMode) {
                                editorState.read(() => {
                                    setHtml($generateHtmlFromNodes(editor));
                                });
                            }
                        }} />
                    </div>
                )}
            </LexicalComposer>
        </div>
    );
}