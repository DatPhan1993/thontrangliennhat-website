import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const CustomEditor = ({ onChange, initialValue }) => {
    const editorRef = useRef(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    const handleEditorChange = (content) => {
        onChange(content);
    };

    const handleInit = (evt, editor) => {
        if (editor) {
            editorRef.current = editor;
            setIsEditorReady(true);
        }
    };

    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (editorRef.current && isEditorReady && initialValue) {
            editorRef.current.setContent(initialValue, { format: 'html' });
        }
    }, [initialValue, isEditorReady]);

    return (
        <Editor
            apiKey={process.env.REACT_APP_TINY_MCE || ''}
            init={{
                height: 700,
                plugins:
                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                    { value: 'First.Name', title: 'First Name' },
                    { value: 'Email', title: 'Email' },
                ],
                language: 'vi',
                ai_request: (request, respondWith) =>
                    respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
            }}
            initialValue=""
            onInit={handleInit}
            onChange={(e) => handleEditorChange(e.target.getContent())}
        />
    );
};

export default CustomEditor;
