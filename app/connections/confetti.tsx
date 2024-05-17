import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti: React.FC = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            confetti({
                particleCount: 500, // Increase particle count
                spread: 400, // Increase spread
                origin: {y: -.5},
            });
        }, 2000);

        // Clear the interval after a certain duration (e.g., 5 seconds)
        const animationDuration = 3000; // 5 seconds
        setTimeout(() => {
            clearInterval(interval);
        }, animationDuration);

        return () => clearInterval(interval);
    }, []);

    return null; // No need to render anything
};

export default Confetti;
