import React from 'react';

// This is where TypeScript shines! We define an "interface" 
// which is like a blueprint for the "props" (data) this component might receive later.
// Even though it's empty now, it sets up a solid foundation.
interface TrackCaseProps { }

// We tell React that this is a Functional Component (React.FC) 
// and it uses our TrackCaseProps blueprint.
const TrackCase: React.FC<TrackCaseProps> = (props) => {
    return (
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h1>Track Your Case</h1>
            <p>This is the new TypeScript page where users will track their cases.</p>
        </div>
    );
};

export default TrackCase;
