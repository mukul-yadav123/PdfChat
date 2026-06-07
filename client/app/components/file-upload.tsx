"use client"
import { Upload } from 'lucide-react';
import * as React from 'react';

const FileUploadComponent: React.FC = () =>{
    return (
        <div className='bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-2'>
            <div className='flex justify-center items-center flex-col'>
                <h3>Uploead a PDF File</h3>
                <Upload/>
            </div>
        </div>
    )
}

export default FileUploadComponent