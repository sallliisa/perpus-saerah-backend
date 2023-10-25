export const flattenObject = (obj: Record<string, any>, prefix = '') =>
  Object.keys(obj).reduce((acc: Record<string, any>, k) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (obj[k] && typeof obj[k] === 'object' && !(obj[k] instanceof Date)) Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
}, {});

export async function getModelConfig(name: string): Promise<Record<string, any>> {
  try {
    return (await import(`@/configs/${name}`)).default
  } catch {
    return {}
  }
}