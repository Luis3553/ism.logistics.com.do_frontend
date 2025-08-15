export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Needed for CORS
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

export async function compressImageFromUrl(imageUrl: string, maxSizeKB = 900) {
    const img = await loadImage(imageUrl);

    const maxWidth = 800;
    const maxHeight = 600;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(img, 0, 0, width, height);

    // Binary search quality until ≤ maxSizeKB
    let quality = 0.9;
    let blob = await canvasToBlob(canvas, quality);
    while (blob.size > maxSizeKB * 1024 && quality > 0.1) {
        quality -= 0.05;
        blob = await canvasToBlob(canvas, quality);
    }

    return blob; // This will be ≤ maxSizeKB (if possible)
}

export function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality);
    });
}
