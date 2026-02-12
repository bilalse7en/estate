'use client';

import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import ImageTool from '@editorjs/image';

export default function EditorJSComponent({ data, onChange, editorblock }) {
  const ejInstance = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: editorblock,
      onReady: () => {
        ejInstance.current = editor;
      },
      autofocus: true,
      data: data || {
        blocks: []
      },
      onChange: async () => {
        try {
          const content = await editor.saver.save();
          onChange(content);
        } catch (error) {
          console.error('Error saving editor content:', error);
        }
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote author',
          }
        },
        code: {
          class: Code,
          config: {
            placeholder: 'Enter code here'
          }
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
              codepen: true,
              twitter: true,
              imgur: true,
              vimeo: true,
           }
          }
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          }
        },
        image: {
          class: ImageTool,
          config: {
            /**
             * Custom uploader
             */
            uploader: {
              /**
               * Upload file to the server and return an uploaded image data
               * @param {File} file - file selected from the device or pasted by drag-n-drop
               * @return {Promise.<{success, file: {url}}>}
               */
              uploadByFile(file) {
                return uploadImage(file).then((url) => {
                  return {
                    success: 1,
                    file: {
                      url: url,
                    }
                  };
                });
              },

              /**
               * Send URL-string to the server, return an uploaded image data
               * @param {string} url - pasted image URL
               * @return {Promise.<{success, file: {url}}>}
               */
              uploadByUrl(url) {
                return Promise.resolve({
                  success: 1,
                  file: {
                    url: url
                  }
                });
              }
            }
          }
        },
      },
      placeholder: 'Start writing your blog content here...',
    });
  };

  // Image upload function
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        return data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isMounted && !ejInstance.current) {
      initEditor();
    }

    return () => {
      if (ejInstance.current && ejInstance.current.destroy) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [isMounted]);

  return (
    <div className="border border-[var(--glass-border)] rounded-2xl p-8 bg-[var(--bg-secondary)] min-h-[500px]">
      <div id={editorblock} className="prose prose-lg max-w-none dark:prose-invert" />
    </div>
  );
}
