import React from 'react';

export default function Header() {
    return (
        <header className="flex items-center justify-between border-b border-neutral-900 pb-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-[1px]">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-amber-400 font-bold text-xs tracking-wider">
                        S
                    </div>
                </div>
                <span className="text-xs font-medium tracking-[0.2em] text-neutral-300 uppercase">
          SEMISA <span className="text-amber-400 font-light">Web Solutions</span>
        </span>
            </div>

            <a
                href="/admin/login"
                className="text-[11px] uppercase tracking-widest text-neutral-400 hover:text-amber-400 transition-colors border border-neutral-800 hover:border-amber-500/40 px-4 py-2 rounded-full bg-neutral-950/50"
            >
                Panel Privado
            </a>
        </header>
    );
}