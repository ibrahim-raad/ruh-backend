export const parseFileSize = (size: string): number => {
  const units = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };

  const match = size.match(/^(\d+)\s?(B|KB|MB|GB)$/i);
  if (!match) {
    throw new Error(
      'Invalid file size format. Use formats like "1MB", "500KB", or "2GB".',
    );
  }

  const [, value, unit] = match;
  return parseInt(value, 10) * units[unit.toUpperCase()];
};
