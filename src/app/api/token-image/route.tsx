import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1024,
  height: 1024,
};

const gradients = [
  'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
  'linear-gradient(135deg, #45B7D1, #96CEB4)',
  'linear-gradient(225deg, #FFEEAD, #D4A5A5)',
  'linear-gradient(315deg, #845EC2, #FF9671)',
];

export async function POST(request: Request) {
  try {
    const { name, symbol } = await request.json();

    if (!name || !symbol) {
      return new Response('Missing name or symbol', { status: 400 });
    }

    console.log('Generating image for:', { name, symbol });
    
    const gradient = gradients[Math.floor(Math.random() * gradients.length)];

    const image = new ImageResponse(
      (
        <div
          style={{
            background: gradient,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              width: '150%',
              height: '150%',
              background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
              transform: 'rotate(30deg)',
            }}
          />
          
          {/* Token symbol circle */}
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              padding: '80px',
              border: '8px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 100px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: 200,
                fontWeight: 'bold',
                color: 'white',
                textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
                letterSpacing: '-0.05em',
              }}
            >
              {symbol}
            </div>
          </div>

          {/* Token name */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              maxWidth: '80%',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              background: 'rgba(0,0,0,0.1)',
              padding: '20px 40px',
              borderRadius: '20px',
              border: '4px solid rgba(255,255,255,0.1)',
            }}
          >
            {name}
          </div>

          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: 24,
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            MEMECOIN
          </div>

          {/* Corner decorations */}
          {[0, 90, 180, 270].map((rotation) => (
            <div
              key={rotation}
              style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                border: '4px solid rgba(255,255,255,0.2)',
                transform: `rotate(${rotation}deg)`,
                top: rotation === 180 || rotation === 270 ? 'auto' : '0',
                bottom: rotation === 180 || rotation === 270 ? '0' : 'auto',
                left: rotation === 90 || rotation === 180 ? 'auto' : '0',
                right: rotation === 90 || rotation === 180 ? '0' : 'auto',
                borderRadius: '50%',
              }}
            />
          ))}
        </div>
      ),
      {
        ...size,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );

    console.log('Image generated successfully');
    return image;

  } catch (error) {
    console.error('Failed to generate image:', error);
    return new Response(
      `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
