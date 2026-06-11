"use client"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import * as React from 'react';

interface FileUploadProps {
    onUploadSuccess: (filename: string) => void;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

    const handleFileUploadButtonClick = () => {
        const el = document.createElement('input')
        el.setAttribute('type', 'file');
        el.setAttribute('accept', 'application/pdf')
        el.addEventListener('change', async (ev) => {
            if (el.files && el.files.length > 0) {
                const file = el.files.item(0)
                if (file) {
                    setFileName(file.name);
                    setIsUploading(true);
                    setStatus('idle');
                    try {
                        const formData = new FormData();
                        formData.append('pdf', file)

                        const res = await fetch('http://localhost:8000/upload/pdf', {
                            method: 'POST',
                            body: formData
                        })
                        
                        if (res.ok) {
                            setStatus('success');
                            onUploadSuccess(file.name);
                        } else {
                            setStatus('error');
                        }
                    } catch (err) {
                        console.error('File upload error:', err);
                        setStatus('error');
                    } finally {
                        setIsUploading(false);
                    }
                }
            }
        })
        el.click();
    }

    return (
        <div className="w-full max-w-sm bg-slate-900/60 backdrop-blur-xl text-white shadow-2xl p-6 rounded-2xl border border-slate-800 transition-all duration-300 hover:border-violet-500/50">
            <div 
                onClick={isUploading ? undefined : handleFileUploadButtonClick} 
                className={`flex justify-center items-center flex-col p-8 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group
                    ${isUploading ? 'border-violet-500 bg-violet-500/5 cursor-not-allowed' : 
                      status === 'success' ? 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500' :
                      status === 'error' ? 'border-rose-500/50 bg-rose-500/5 hover:border-rose-500' :
                      'border-slate-700 hover:border-violet-500 bg-slate-950/40 hover:bg-slate-950/60'}`}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" />
                        <h4 className="font-semibold text-slate-200 text-center animate-pulse">Uploading file...</h4>
                        <p className="text-xs text-slate-400 text-center mt-2 truncate max-w-full px-2">{fileName}</p>
                    </>
                ) : status === 'success' ? (
                    <>
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-4 animate-bounce" />
                        <h4 className="font-semibold text-slate-200 text-center">Ready to Chat!</h4>
                        <p className="text-xs text-emerald-400/80 text-center mt-1 truncate max-w-full px-2">{fileName}</p>
                        <span className="text-[10px] text-slate-400 mt-4 bg-slate-800 px-3 py-1 rounded-full">Click to upload another</span>
                    </>
                ) : status === 'error' ? (
                    <>
                        <AlertCircle className="w-10 h-10 text-rose-400 mb-4" />
                        <h4 className="font-semibold text-rose-300 text-center">Upload Failed</h4>
                        <p className="text-xs text-rose-400/80 text-center mt-1">Try again</p>
                        <span className="text-[10px] text-slate-400 mt-4 bg-slate-800 px-3 py-1 rounded-full">Click to retry</span>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-violet-500/20">
                            <Upload className="w-6 h-6 text-violet-400" />
                        </div>
                        <h4 className="font-semibold text-slate-200 text-center group-hover:text-violet-400 transition-colors">Upload a PDF Document</h4>
                        <p className="text-xs text-slate-400 text-center mt-2">PDF files up to 20MB are supported</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default FileUploadComponent;