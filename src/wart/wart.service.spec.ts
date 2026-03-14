import {
  buildGoogleDriveImageUrl,
  buildGoogleDriveEmbeddedFolderUrl,
  extractGoogleDriveFolderId,
  isGoogleDriveImageMimeType,
  parsePublicGoogleDriveFolderHtml,
} from './google-drive.util';

describe('googleDriveUtil', () => {
  it('extracts a folder id from a shared folder URL', () => {
    expect(
      extractGoogleDriveFolderId(
        'https://drive.google.com/drive/folders/19D8lV6P59NoSzI4vZ9ZmhKYOi3lCAJQP',
      ),
    ).toBe('19D8lV6P59NoSzI4vZ9ZmhKYOi3lCAJQP');
  });

  it('detects image mime types', () => {
    expect(isGoogleDriveImageMimeType('image/jpeg')).toBe(true);
    expect(isGoogleDriveImageMimeType('application/pdf')).toBe(false);
  });

  it('builds a direct image URL from a file id', () => {
    expect(buildGoogleDriveImageUrl('abc123')).toBe(
      'https://drive.google.com/uc?export=view&id=abc123',
    );
  });

  it('builds the public embedded folder url', () => {
    expect(buildGoogleDriveEmbeddedFolderUrl('folder123')).toBe(
      'https://drive.google.com/embeddedfolderview?id=folder123#grid',
    );
  });

  it('parses image entries from a public embedded folder page', () => {
    const html = `
      <div class="flip-entry" id="entry-file123" tabindex="0" role="link">
        <div class="flip-entry-info">
          <a href="https://drive.google.com/file/d/file123/view?usp=drive_web" target="_blank">
            <div class="flip-entry-thumb">
              <img src="https://lh3.googleusercontent.com/demo=s190" alt="JPEG Image"/>
            </div>
            <div class="flip-entry-title">You&#39;ll&amp;Me.jpg</div>
          </a>
        </div>
      </div>
    `;

    expect(parsePublicGoogleDriveFolderHtml(html)).toEqual([
      {
        id: 'file123',
        name: "You'll&Me.jpg",
        mimeType: 'image/jpeg',
        thumbnailUrl: 'https://lh3.googleusercontent.com/demo=s190',
      },
    ]);
  });
});
