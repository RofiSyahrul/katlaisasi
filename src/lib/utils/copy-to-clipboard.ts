function copyText(text: string) {
  const textArea = document.createElement('textarea');

  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise<boolean>((resolve) => {
    try {
      const isSuccess = document.execCommand('copy');
      document.body.removeChild(textArea);
      resolve(isSuccess);
    } catch {
      document.body.removeChild(textArea);
      resolve(false);
    }
  });
}

export async function copyToClipBoard(text: string): Promise<boolean> {
  let isSuccess = false;

  if (!navigator.clipboard) {
    isSuccess = await copyText(text);
    return isSuccess;
  }

  try {
    await navigator.clipboard.writeText(text);
    isSuccess = true;
  } catch {
    isSuccess = await copyText(text);
  }

  return isSuccess;
}
