"use client"
import { Upload } from 'lucide-react';
import * as React from 'react';

const FileUploadComponent: React.FC = () =>{

    const handleFileUploadButtonClick = () =>{
        const el = document.createElement('input')
        el.setAttribute('type','file');
        el.setAttribute('accept','application/pdf')
        el.addEventListener('change', (ev) => {
            if(el.files && el.files.length >0)
            {
                const file = el.files.item(0)
            }
        })
        el.click();
    }


    return (
        <div className='bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-2'>
            <div onClick={handleFileUploadButtonClick} className='cursor-pointer flex justify-center items-center flex-col'>
                <h3>Uploead a PDF File</h3>
                <Upload/>
            </div>
        </div>
    )
}

export default FileUploadComponent