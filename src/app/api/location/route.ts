import { NextRequest, NextResponse } from 'next/server';

// Define the location data structure
export interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
}

// In-memory storage for demo purposes
// In a production app, you might want to use a database or Redis
const userLocations: Record<string, LocationData> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.lat || !body.lng) {
      return NextResponse.json(
        { error: 'Missing required fields: lat and lng' },
        { status: 400 }
      );
    }

    const locationData: LocationData = {
      lat: body.lat,
      lng: body.lng,
      timestamp: Date.now()
    };

    // In a real app, you would use a user ID from authentication
    // For demo purposes, we'll use a fixed ID or IP-based ID
    const userId = request.headers.get('x-user-id') || 'default-user';
    
    // Store the location
    userLocations[userId] = locationData;

    return NextResponse.json({ 
      success: true, 
      message: 'Location saved successfully',
      data: locationData
    });
  } catch (error) {
    console.error('Error saving location:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would use a user ID from authentication
    const userId = request.headers.get('x-user-id') || 'default-user';
    
    // Get the location for this user
    const locationData = userLocations[userId];
    
    if (!locationData) {
      return NextResponse.json(
        { error: 'No location data found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Error retrieving location:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}