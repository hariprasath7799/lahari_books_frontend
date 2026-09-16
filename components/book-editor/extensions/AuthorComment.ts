import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AuthorCommentComponent } from './AuthorCommentComponent';

export interface AuthorCommentOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        authorComment: {
            setAuthorComment: (attributes?: {
                comment?: string;
                author?: string;
                color?: string;
            }) => ReturnType;
        };
    }
}

export const AuthorComment = Node.create<AuthorCommentOptions>({
    name: 'authorComment',

    group: 'inline',

    inline: true,

    atom: true,

    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            comment: {
                default: 'Editorial note: Review paragraph phrasing and tone.',
                parseHTML: (element) => element.getAttribute('data-comment'),
                renderHTML: (attributes) => ({
                    'data-comment': attributes.comment,
                }),
            },
            author: {
                default: 'Senior Editor',
                parseHTML: (element) => element.getAttribute('data-author'),
                renderHTML: (attributes) => ({
                    'data-author': attributes.author,
                }),
            },
            createdAt: {
                default: new Date().toISOString(),
                parseHTML: (element) => element.getAttribute('data-created-at'),
                renderHTML: (attributes) => ({
                    'data-created-at': attributes.createdAt,
                }),
            },
            color: {
                default: 'amber',
                parseHTML: (element) => element.getAttribute('data-color'),
                renderHTML: (attributes) => ({
                    'data-color': attributes.color,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="author-comment"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(
                { 'data-type': 'author-comment', class: 'editorial-comment-node' },
                this.options.HTMLAttributes,
                HTMLAttributes
            ),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(AuthorCommentComponent);
    },

    addCommands() {
        return {
            setAuthorComment:
                (attributes = {}) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                comment: attributes.comment || 'Editorial note: Verify historical fact.',
                                author: attributes.author || 'Senior Editor',
                                color: attributes.color || 'amber',
                                createdAt: new Date().toISOString(),
                            },
                        });
                    },
        };
    },
});
