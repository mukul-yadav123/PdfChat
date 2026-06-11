"use client"

import * as React from 'react'
import ChatComponent from "./components/chat";
import FileUploadComponent from "./components/file-upload";
import { UserButton } from '@clerk/nextjs'
import { Sparkles, HelpCircle, FileText, CheckCircle2 } from 'lucide-react'

export default function Home() {
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null);

  const handleUploadSuccess = (filename: string) => {
    setUploadedFileName(filename);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex overflow-hidden">
      {/* Sidebar - File Upload & Controls */}
      <div className="w-[28vw] min-w-[320px] bg-slate-900/40 border-r border-slate-900 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* App Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-violet-400 to-indigo-200 bg-clip-text text-transparent">
                DocuMind AI
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">PDF Chat Assistant</p>
            </div>
          </div>

          {/* File Upload Component */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Document Source</span>
            <FileUploadComponent onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Guidelines/Tips */}
          <div className="space-y-3 bg-slate-950/40 border border-slate-900 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <HelpCircle className="w-4 h-4 text-violet-400" />
              <span>How it works</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-2.5 list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">1.</span>
                <span>Upload a PDF file. The document is stored and indexed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">2.</span>
                <span>Ask queries about its contents in the chat panel.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">3.</span>
                <span>The bot extracts key passages and shows direct source links.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* User Profile & Footer */}
        <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200">Active Account</p>
              <p className="text-[10px] text-slate-500">Authorized Session</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-600 font-medium">v1.0.0</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-h-screen">
        <ChatComponent uploadedFileName={uploadedFileName} />
      </div>
    </div>
  );
}
