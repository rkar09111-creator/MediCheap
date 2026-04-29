import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../../services/api';

const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const track = async () => {
            try {
                // Generate a session ID if not exists
                let sessionId = localStorage.getItem('medicheap_session_id');
                if (!sessionId) {
                    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    localStorage.setItem('medicheap_session_id', sessionId);
                }

                await analyticsService.trackVisit(sessionId);
            } catch (error) {
                // Silently fail for tracking
                console.debug('Tracking skipped');
            }
        };

        track();
    }, [location.pathname]);

    return null;
};

export default AnalyticsTracker;
