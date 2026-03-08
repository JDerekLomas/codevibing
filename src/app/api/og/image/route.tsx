import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'default';
  const username = searchParams.get('username');
  const bio = searchParams.get('bio');
  const title = searchParams.get('title');

  if (type === 'profile' && username) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFDF9',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Top accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: '#92400E', display: 'flex' }} />

          {/* Avatar */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: '#F5F0EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 700,
              color: '#92400E',
              marginBottom: 24,
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>

          {/* Username */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#1C1917',
              marginBottom: 8,
              display: 'flex',
            }}
          >
            @{username}
          </div>

          {/* Bio */}
          {bio && (
            <div
              style={{
                fontSize: 24,
                color: '#78716C',
                maxWidth: 800,
                textAlign: 'center',
                lineHeight: 1.4,
                display: 'flex',
              }}
            >
              {bio.slice(0, 120)}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 20, color: '#A8A29E', display: 'flex' }}>
              codevibing.com
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  if (type === 'post' && title) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 80px',
            backgroundColor: '#FFFDF9',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: '#92400E', display: 'flex' }} />

          {username && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#F5F0EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#92400E',
                }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: 24, color: '#78716C', display: 'flex' }}>@{username}</div>
            </div>
          )}

          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: '#1C1917',
              lineHeight: 1.3,
              maxWidth: 900,
              display: 'flex',
            }}
          >
            {title.slice(0, 150)}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 80,
              fontSize: 20,
              color: '#A8A29E',
              display: 'flex',
            }}
          >
            codevibing.com
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default — site-level OG image
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFDF9',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: '#92400E', display: 'flex' }} />

        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: '#1C1917',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          codevibing
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#78716C',
            maxWidth: 700,
            textAlign: 'center',
            lineHeight: 1.5,
            display: 'flex',
          }}
        >
          A community for people shipping side projects with AI
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#A8A29E',
            display: 'flex',
          }}
        >
          codevibing.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
