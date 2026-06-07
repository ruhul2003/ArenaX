import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import EditFacilityForm from './EditFacilityForm';

// 1. This Server Component loads first to safely extract session tokens
export default async function EditFacilityPage({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Fetch the token on the server side using your auth configuration
    const authData = await auth.api.getToken({
        headers: await headers()
    });

    const token = authData?.token || null;

    // Pass the token down directly into the client form component
    return <EditFacilityForm id={id} token={token} />;
}