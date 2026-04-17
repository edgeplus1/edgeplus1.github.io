  function getAverageColor(imgElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    const width = canvas.width = imgElement.naturalWidth || imgElement.width;
    const height = canvas.height = imgElement.naturalHeight || imgElement.height;
    context.drawImage(imgElement, 0, 0);
    const data = context.getImageData(0, 0, width, height).data;
    let r = 0, g = 0, b = 0;
    const length = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    r = Math.floor(r / length);
    g = Math.floor(g / length);
    b = Math.floor(b / length);
    return { rgb: `${r},${g},${b}`, full: `rgb(${r},${g},${b})` };
  }

  const imgUrl = getComputedStyle(document.querySelector('.appstore-banner'))
    .getPropertyValue('--bg-image')
    .replace(/url\(['"]?(.*?)['"]?\)/, '$1');

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imgUrl;
  img.onload = function() {
    const avgColor = getAverageColor(img);
    const banner = document.querySelector('.appstore-banner');
    banner.style.setProperty('--bg-color', avgColor.full);
    banner.style.setProperty('--bg-rgb', avgColor.rgb);
  };