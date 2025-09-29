import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'latitude', 'longitude', 'rainfall', 'temperature', 'humidity',
      'river_discharge', 'water_level', 'elevation', 'land_cover', 'soil_type',
      'population_density', 'infrastructure', 'historical_floods'
    ];
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Call the flood prediction backend
    const backendUrl = process.env.FLOOD_BACKEND_URL || "http://localhost:8000";
    
    const response = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flood prediction backend error:", errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error("Error in flood prediction:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      },
      { status: 500 }
    );
  }
}
