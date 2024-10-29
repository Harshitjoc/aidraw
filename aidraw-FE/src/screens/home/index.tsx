import { ColorSwatch, Group, Slider } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from '@/constants';
import Pencil from '../../assets/pencil.png'
import Eraser from '../../assets/eraser.png'
// import {LazyBrush} from 'lazy-brush';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 0, y: 0 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [isErasing, setIsErasing] = useState(false);
    const [sliderValue, setSliderValue] = useState(3);

    // const lazyBrush = new LazyBrush({
    //     radius: 10,
    //     enabled: true,
    //     initialPoint: { x: 0, y: 0 },
    // });

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
            }

        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            });
        };

        return () => {
            document.head.removeChild(script);
        };

    }, []);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression([...latexExpression, latex]);

        // Clear the main canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };


    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                if (isErasing) {
                    setColor('');
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = sliderValue;
                    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    ctx.stroke();
                } else {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.lineWidth = sliderValue;
                    ctx.strokeStyle = color;
                    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    ctx.stroke();
                }
            }
        }
    };
    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const runRoute = async () => {
        const canvas = canvasRef.current;

        if (canvas) {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/calculate`,
                data: {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars
                }
            });

            const resp = await response.data;
            // console.log('Response', resp);
            resp.data.forEach((data: Response) => {
                if (data.assign === true) {
                    // dict_of_vars[resp.result] = resp.answer;
                    setDictOfVars({
                        ...dictOfVars,
                        [data.expr]: data.result
                    });
                }
            });
            const ctx = canvas.getContext('2d');
            const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            setLatexPosition({ x: centerX, y: centerY });
            resp.data.forEach((data: Response) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result
                    });
                }, 1000);
            });
        }
    };

    useEffect(() => {
        if (color) {
            setIsErasing(false);
        }
    }, [color])

    const handleErase = () => {
        setColor('');
        setIsErasing(true);
        setIsDrawing(false);
    };

    return (
        <>
            <div className='flex flex-col h-screen bg-black'>
                <div className='flex flex-wrap justify-between items-center p-2 bg-black'>
                    <Button
                        onClick={() => setReset(true)}
                        className='z-20 bg-red-500 text-white'
                        variant='default'
                        color='black'
                    >
                        Reset
                    </Button>
                    <Group className='z-20 bg-slate-400 p-2 rounded-md'>
                        {SWATCHES.map((swatch) => (
                            <ColorSwatch key={swatch} color={swatch} onClick={() =>
                                setColor(swatch)
                            } >
                                {
                                    color === swatch &&
                                    <div className='border-2 border-white rounded-full p-1'>
                                        <img src={Pencil} alt="Pencil" width={18} height={18} />
                                    </div>
                                }
                            </ColorSwatch>
                        ))}
                    </Group>
                    <Button
                        className={color ? 'z-20 bg-blue-200 text-white' : 'z-20 bg-pink-400 text-white'}
                        variant='default'
                        color='black'
                        onClick={handleErase}
                    >
                        <img src={Eraser} height={30} width={30} alt="eraser" />
                    </Button>
                    <div className='flex items-center space-x-2 bg-blue-200 p-2 rounded'>
                        {color ? <img src={Pencil} height={25} width={25} alt="Pencil" /> : <img src={Eraser} height={25} width={25} alt="eraser" />}
                        <Slider
                            className='w-40'
                            defaultValue={sliderValue}
                            color={color ? "blue" : "#f472b6"}
                            min={1}
                            max={15}
                            onChange={setSliderValue}
                        />
                        <span>{sliderValue}px</span>
                    </div>
                    <Button
                        onClick={runRoute}
                        className='z-20 bg-green-500 text-white'
                        variant='default'
                        color='white'
                    >
                        Calculate
                    </Button>
                </div>
                <canvas
                    ref={canvasRef}
                    className='top-0 left-0 w-full h-full bg-gray-800'
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                />
                {latexExpression && latexExpression.map((exp, index) => (
                    <Draggable
                        key={index}
                        defaultPosition={latexPosition}
                        onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
                    >
                        <div className="absolute p-2 text-white rounded shadow-md">
                            <div className="latex-content">
                                <pre>{exp.replace(/\\\(.*?\{/, '').replace(/\}.*/, '')}</pre>
                            </div>
                        </div>
                    </Draggable>
                ))}
            </div>
        </>
    );
}