import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti: React.FC = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            confetti({
                particleCount: 500, 
                spread: 400, 
                origin: {y: -.5},
            });
        }, 2000);
        const animationDuration = 3000; 
        setTimeout(() => {
            clearInterval(interval);
        }, animationDuration);
        return () => clearInterval(interval);
    }, []);
    return null; // No need to render anything
};

export default Confetti;
