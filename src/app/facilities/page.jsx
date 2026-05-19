import React from 'react';
import { getFacilities } from '../lib/data';

const FacilitiesPage =async () => {
    const facilities = await getFacilities();

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-8">Facilities</h1>

            <h2>{facilities.length} Facilities Available</h2>
        </div>
    );
};

export default FacilitiesPage;