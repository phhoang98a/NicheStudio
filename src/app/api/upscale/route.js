export const maxDuration = 60;

export async function POST(request) {
  const data = await request.json();
  try {
    const response = await fetch(
      "https://nicheimage.nichetensor.com/api/v1/upscale",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          API_KEY: process.env.NEXT_PUBLIC_API_TOKEN,
        },
        body: JSON.stringify(data),
      },
    );
    const responseData = await response.json();
    return Response.json(responseData);
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "An error occurred while upscaling the image" },
      { status: 500 },
    );
  }
}
