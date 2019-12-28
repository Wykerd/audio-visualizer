import React, { useRef, useEffect, useState } from 'react';
import * as AudioVisualizer from '../index';
import './index.css';

export default function ({ src, type, style, autoPlay, ...props }) {
    const audioRef = useRef(undefined);
    const canvasRef = useRef(undefined);
    const [ visualizer, setVisualizer ] = useState(undefined);
    const [ playing, setPlaying ] = useState(false);

    function handlePlayPause () {
        if(audioRef.current) visualizer.audioContext.resume().then(()=> {
            if (!audioRef.current.paused) visualizer.pause()
            else visualizer.play().catch(()=>{})
        }).catch(console.error);
    }

    useEffect(()=>{
        if (visualizer) {
            if (autoPlay) {
                visualizer.audioContext.resume().then(()=> {
                    visualizer.play().catch(()=>{})
                }).catch(console.error);
            }
        }
    }, [visualizer, autoPlay]);

    useEffect(()=>{
        if (audioRef.current && canvasRef.current) {
            const appliedStyles = Object.assign({}, {back: '#1c2541', line:'#f56476', progress:'rgba(211, 76, 85, 0.2)'}, style)
            const av = new AudioVisualizer(audioRef.current, canvasRef.current, appliedStyles)
            av.audioElement.addEventListener("play", () => setPlaying(true));
            av.audioElement.addEventListener("pause", () => setPlaying(false));
            av.draw();
            audioRef.current.pause();
            setVisualizer(av);
        }
    }, [style]);

    return <div className="react_audio" data-playing={playing}>
        <audio src={src} type={type} crossOrigin='anonymous' ref={audioRef} {...props} />
        <canvas height="100px" width={`${window.screen.width || window.innerWidth}px`} ref={canvasRef} />
        <button onClick={handlePlayPause}>{audioRef.current ? audioRef.current.paused ? `Play` : `Pause` : '?'}</button>
    </div>
}