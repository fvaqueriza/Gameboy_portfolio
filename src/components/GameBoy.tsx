"use client";

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";

type Screen = 'boot' | 'menu' | 'sobremi' | 'proyectos' | 'contacto' | 'minijuego';
const menuItems = ['Sobre Mí', 'Proyectos', 'Contacto', 'Minijuego'];

const ScreenWrapper = ({ children }: { children: ReactNode }) => (
    <div className="p-2 text-foreground text-xs leading-relaxed flex flex-col gap-2 h-full overflow-y-auto">
        {children}
    </div>
);

export function GameBoy() {
    const [screen, setScreen] = useState<Screen>('boot');
    const [selectedItem, setSelectedItem] =useState(0);
    const [isBooting, setIsBooting] = useState(true);

    // Minigame state
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const [timer, setTimer] = useState(15);

    useEffect(() => {
        const bootTimer = setTimeout(() => {
            setIsBooting(false);
        }, 2000);
        return () => clearTimeout(bootTimer);
    }, []);

    const resetGame = useCallback(() => {
        setGameActive(false);
        setScore(0);
        setTimer(15);
    }, []);

    useEffect(() => {
        let gameTimer: NodeJS.Timeout;
        if (gameActive && timer > 0) {
            gameTimer = setTimeout(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0) {
            setGameActive(false);
        }
        return () => clearTimeout(gameTimer);
    }, [gameActive, timer]);

    const handleDirection = useCallback((direction: 'up' | 'down') => {
        if (screen !== 'menu' || isBooting) return;
        if (direction === 'up') {
            setSelectedItem(prev => (prev > 0 ? prev - 1 : menuItems.length - 1));
        } else {
            setSelectedItem(prev => (prev < menuItems.length - 1 ? prev + 1 : 0));
        }
    }, [screen, isBooting]);

    const handleConfirm = useCallback(() => {
        if (isBooting) return;
        if (screen === 'boot') {
            setScreen('menu');
        } else if (screen === 'menu') {
            const selectionMap: Record<string, Screen> = {
                'sobre mí': 'sobremi',
                'proyectos': 'proyectos',
                'contacto': 'contacto',
                'minijuego': 'minijuego'
            };
            const selectionKey = menuItems[selectedItem].toLowerCase();
            const selection = selectionMap[selectionKey];

            if (selection === 'minijuego') {
                resetGame();
            }
            if(selection) {
                setScreen(selection);
            }
        } else if (screen === 'minijuego' && !gameActive) {
            setGameActive(true);
        }
    }, [screen, selectedItem, isBooting, gameActive, resetGame]);

    const handleBack = useCallback(() => {
        if (screen === 'sobremi' || screen === 'proyectos' || screen === 'contacto' || screen === 'minijuego') {
            setScreen('menu');
            resetGame();
        }
    }, [screen, resetGame]);

    const handleStart = useCallback(() => {
        if (isBooting) return;
        if (screen === 'boot') {
            setScreen('menu');
        } else if (screen !== 'menu') {
            setScreen('menu');
            resetGame();
        } else if (screen === 'minijuego' && !gameActive) {
            setGameActive(true);
            setScore(0);
            setTimer(15);
        }
    }, [screen, isBooting, gameActive, resetGame]);


    const handleMinigameHit = () => {
        if (!gameActive) return;
        setScore(s => s + 1);
        setTargetPosition({
            x: Math.floor(Math.random() * 90),
            y: Math.floor(Math.random() * 80),
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp': e.preventDefault(); handleDirection('up'); break;
                case 'ArrowDown': e.preventDefault(); handleDirection('down'); break;
                case 'Enter': case 'a': case 'A': e.preventDefault(); handleConfirm(); if(screen === 'minijuego') handleMinigameHit(); break;
                case 'Backspace': case 'b': case 'B': e.preventDefault(); handleBack(); break;
                case 's': case 'S': e.preventDefault(); handleStart(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleDirection, handleConfirm, handleBack, handleStart, screen]);

    const renderScreen = () => {
        if (isBooting) {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                    <h1 className="text-xl font-bold text-shadow-sm">GAME DEVFOLIO</h1>
                    <div className="w-full h-1 bg-foreground/20 overflow-hidden">
                        <div className="h-full bg-foreground animate-scanline"></div>
                    </div>
                </div>
            )
        }
        
        switch (screen) {
            case 'boot':
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-xl font-bold text-shadow-sm mb-4">GAME DEVFOLIO</h1>
                        <p className="animate-text-blink text-shadow-sm">PULSA START</p>
                    </div>
                );
            case 'menu':
                return (
                    <ScreenWrapper>
                        <h2 className="text-center font-bold text-shadow-sm">[ Menú Principal ]</h2>
                        <ul className="flex flex-col items-center gap-2 mt-4">
                            {menuItems.map((item, index) => (
                                <li key={item} className="flex items-center gap-2">
                                    <span className={cn("transition-opacity", selectedItem === index ? 'opacity-100' : 'opacity-0')}>▶</span>
                                    <span className="w-24 text-left">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </ScreenWrapper>
                );
            case 'sobremi':
                return (
                    <ScreenWrapper>
                        <h2 className="font-bold text-shadow-sm">[ Sobre Mí ]</h2>
                        <p>¡Hola! Soy Felipe Vaqueriza, desarrollador con formación en DAM y experiencia en proyectos Odoo.</p>
                        <p>Me apasiona la tecnología y busco crear soluciones empresariales eficientes.</p>
                        <p className="font-bold mt-2">Aptitudes:</p>
                        <p>Java, Docker, Python, JavaScript, SQL.</p>
                    </ScreenWrapper>
                );
            case 'proyectos':
                return (
                    <ScreenWrapper>
                        <h2 className="font-bold text-shadow-sm">[ Experiencia ]</h2>
                        <div className="flex flex-col gap-3">
                            <div>
                                <h3 className="font-bold">Factor Libre</h3>
                                <p>Desarrollador web y prácticas (2024). Foco en Odoo, Git, y optimización de módulos.</p>
                            </div>
                             <div>
                                <h3 className="font-bold">Educación</h3>
                                <p>Técnico Superior en DAM (IES Barajas, 2024). 2 años de Ing. Telecom. (Univ. Alcalá).</p>
                            </div>
                        </div>
                    </ScreenWrapper>
                );
            case 'contacto':
                return (
                    <ScreenWrapper>
                        <h2 className="font-bold text-shadow-sm">[ Contacto ]</h2>
                        <p>Redes sociales, haz click para ir al enlace:</p>
                        <ul className="flex flex-col gap-2 mt-2">
                            <li className="flex items-center gap-2"><Github size={14} /><a href="https://github.com/fvaqueriza" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                            <li className="flex items-center gap-2"><Linkedin size={14} /><a href="https://www.linkedin.com/in/felipe-vaqueriza/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            <li className="flex items-center gap-2"><Mail size={14} /><a href="mailto:fvaqueriza@gmail.com">fvaqueriza@gmail.com</a></li>
                        </ul>
                    </ScreenWrapper>
                );
            case 'minijuego':
                return (
                    <ScreenWrapper>
                         <div className="flex justify-between text-shadow-sm">
                            <span>Puntos: {score}</span>
                            <span>Tiempo: {timer}</span>
                        </div>
                        <div className="relative w-full h-[120px] bg-black/10 mt-1 border border-foreground/30">
                            {gameActive ? (
                                <button
                                    className="absolute w-4 h-4 bg-foreground"
                                    style={{ left: `${targetPosition.x}%`, top: `${targetPosition.y}%` }}
                                    onClick={handleMinigameHit}
                                    aria-label="Target"
                                ></button>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    {timer === 0 ? (
                                        <>
                                            <p className="text-shadow-sm">¡Fin del juego!</p>
                                            <p className="text-shadow-sm">Puntuación Final: {score}</p>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="font-bold text-shadow-sm">[ Juego de Reacción ]</h2>
                                            <p className="mt-2 text-shadow-sm">¡Golpea el cuadrado!</p>
                                            <p className="mt-2 animate-text-blink text-shadow-sm">Pulsa A o Start</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </ScreenWrapper>
                )
        }
    }
    
    return (
        <div className="relative w-[340px] h-[560px] bg-[#d1d1d1] rounded-t-lg rounded-b-[30px] shadow-2xl p-4 border-b-8 border-l-4 border-r-4 border-t-2 border-black/20 font-headline select-none">
            {/* Side bevels for 3D effect */}
            <div className="absolute -left-1.5 top-0 bottom-0 w-1.5 bg-black/10 rounded-l-lg"></div>
            <div className="absolute -right-1.5 top-0 bottom-0 w-1.5 bg-white/10 rounded-r-lg"></div>
            <div className="absolute -bottom-2.5 left-0 right-0 h-2.5 bg-black/10 rounded-b-[30px]"></div>

            {/* Screen Area */}
            <div className="w-full h-[290px] bg-[#1a1a1a] rounded-sm p-5 flex items-center justify-center border-t-2 border-l-2 border-[#c4c4c4] border-r-2 border-b-4 border-black/30">
                <div className="relative w-full h-full bg-background border-2 border-foreground/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] pixel-grid overflow-hidden">
                    {renderScreen()}
                    <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-red-600 border border-black/50 shadow-inner"></div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-foreground/50">POWER</span>
                </div>
            </div>

            <h1 className="font-headline text-xl text-blue-800/80 font-bold italic absolute top-[305px] left-1/2 -translate-x-1/2 [text-shadow:1px_1px_#a8a8a8]">
                <span className="text-[#3058a8]">GAME</span> DEVFOLIO
            </h1>

            <div className="absolute bottom-4 left-3 right-3 h-[180px]">
                {/* D-Pad */}
                <div className="absolute top-5 left-5 w-[72px] h-[72px]">
                    <div className="absolute w-full h-1/3 top-1/3 left-0 bg-[#2b2b2b] shadow-[inset_2px_2px_2px_rgba(255,255,255,0.2),_inset_-2px_-2px_2px_rgba(0,0,0,0.5)]"></div>
                    <div className="absolute h-full w-1/3 top-0 left-1/3 bg-[#2b2b2b] shadow-[inset_2px_2px_2px_rgba(255,255,255,0.2),_inset_-2px_-2px_2px_rgba(0,0,0,0.5)]"></div>
                    <button onClick={() => handleDirection('up')} aria-label="Up" className="absolute w-1/3 h-1/3 top-0 left-1/3 active:shadow-inner active:bg-black/50"></button>
                    <button aria-label="Left" className="absolute w-1/3 h-1/3 top-1/3 left-0 active:shadow-inner active:bg-black/50"></button>
                    <button aria-label="Right" className="absolute w-1/3 h-1/3 top-1/3 right-0 active:shadow-inner active:bg-black/50"></button>
                    <button onClick={() => handleDirection('down')} aria-label="Down" className="absolute w-1/3 h-1/3 bottom-0 left-1/3 active:shadow-inner active:bg-black/50"></button>
                </div>


                {/* A and B Buttons */}
                <div className="absolute top-8 right-0 w-[110px] h-[50px] flex justify-between items-center -rotate-12">
                     <button onClick={handleBack} className="w-10 h-10 bg-[#a93f55] rounded-full border-2 border-black/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_1px_1px_3px_rgba(0,0,0,0.4),_inset_-1px_-1px_2px_rgba(0,0,0,0.6)] active:shadow-inner active:bg-[#8c3446] flex items-center justify-center" aria-label="Back (B Button)">
                        <span className="font-bold text-lg text-white/80 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)] leading-none mt-0.5">B</span>
                    </button>
                    <button onClick={handleConfirm} className="w-10 h-10 bg-[#a93f55] rounded-full border-2 border-black/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),_1px_1px_3px_rgba(0,0,0,0.4),_inset_-1px_-1px_2px_rgba(0,0,0,0.6)] active:shadow-inner active:bg-[#8c3446] flex items-center justify-center" aria-label="Confirm (A Button)">
                        <span className="font-bold text-lg text-white/80 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)] leading-none mt-0.5">A</span>
                    </button>
                </div>

                {/* Start and Select */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-5 flex justify-between items-center">
                    <button onClick={handleBack} className="w-12 h-4 bg-[#2b2b2b] rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)] active:shadow-none"></button>
                    <button onClick={handleStart} className="w-12 h-4 bg-[#2b2b2b] rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)] active:shadow-none"></button>
                </div>
                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-3 flex justify-between items-center text-[8px] text-foreground/50">
                    <span>SELECT</span>
                    <span>START</span>
                </div>

                {/* Speaker */}
                <div className="absolute bottom-6 right-2 w-16 h-14 space-y-1 -rotate-[15deg]">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-1.5 bg-black/20 rounded-none"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}