
import React from 'react';
import { SupportMessages } from '../constants';

interface SupportDialogProps {
  onSupport: () => void;
  onBack: () => void;
}

/**
 * Replicates Android XML: <LinearLayout ... android:orientation="vertical">
 */
const SupportDialog: React.FC<SupportDialogProps> = ({ onSupport, onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-md mx-auto">
        {/* Navigation Header (Not in original XML but required for web flow) */}
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Replicates Android XML Hierarchy */}
        <div className="flex flex-col gap-4">
          
          {/* <TextView android:text="@string/support_title" android:textSize="18sp" android:textStyle="bold" /> */}
          <h2 className="text-xl font-bold leading-tight">
            {SupportMessages.TITLE}
          </h2>

          {/* <TextView android:text="@string/support_description" android:textSize="14sp" android:layout_marginTop="8dp" /> */}
          <p className="text-[14px] text-zinc-300 leading-relaxed mt-2">
            {SupportMessages.DESCRIPTION}
          </p>

          {/* <TextView android:text="@string/support_details" android:textSize="14sp" android:layout_marginTop="8dp" /> */}
          <div className="mt-2 space-y-1">
             <p className="text-[14px] text-zinc-400 leading-relaxed font-medium">
               {SupportMessages.DETAILS.map((detail, i) => (
                 <span key={i} className="block">• {detail}</span>
               ))}
             </p>
          </div>

          {/* <TextView android:text="@string/support_social_impact" android:textSize="14sp" android:layout_marginTop="8dp" /> */}
          <p className="text-[14px] text-zinc-300 leading-relaxed mt-2">
            {SupportMessages.SOCIAL_IMPACT}
          </p>

          {/* <TextView android:text="@string/support_optional" android:textSize="12sp" android:textColor="#666666" android:layout_marginTop="12dp" /> */}
          <p className="text-[12px] text-zinc-500 leading-relaxed mt-3 uppercase font-bold tracking-wide">
            {SupportMessages.OPTIONAL}
          </p>

          {/* <Button android:text="@string/support_button" android:layout_marginTop="16dp" android:layout_width="match_parent" /> */}
          <button 
            onClick={onSupport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest mt-6 shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            {SupportMessages.BUTTON}
          </button>
          
          <button 
            onClick={onBack}
            className="w-full py-4 text-zinc-600 font-bold uppercase text-[10px] tracking-widest hover:text-zinc-400 transition-colors"
          >
            Talvez depois
          </button>
        </div>

        {/* Branding Footer */}
        <div className="mt-12 pt-12 border-t border-zinc-900 text-center opacity-40">
           <p className="text-[8px] font-black uppercase tracking-[0.4em]">Carlin Dev Environment • v5.2</p>
        </div>
      </div>
    </div>
  );
};

export default SupportDialog;
